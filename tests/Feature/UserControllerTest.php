<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(string $email = 'user@test.local'): User
    {
        return User::forceCreate([
            'name' => 'Test ' . uniqid(),
            'email' => $email,
            'password' => bcrypt('secret'),
        ]);
    }

    public function test_get_endpoint_returns_user_list(): void
    {
        $this->createUser('one@test.local');
        $this->createUser('two@test.local');

        $this->getJson('/acl/users')
            ->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonCount(2, 'data');
    }

    public function test_store_creates_user(): void
    {
        $this->postJson('/acl/users', [
            'name' => 'Alice',
            'email' => 'alice@test.local',
            'password' => 'secret123',
        ])->assertStatus(200)->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', ['email' => 'alice@test.local', 'name' => 'Alice']);
    }

    public function test_store_validates_required_fields(): void
    {
        $this->postJson('/acl/users', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_store_validates_unique_email(): void
    {
        $this->createUser('dup@test.local');

        $this->postJson('/acl/users', [
            'name' => 'Bob',
            'email' => 'dup@test.local',
            'password' => 'secret123',
        ])->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_store_tolerates_user_model_without_getRules(): void
    {
        // Simulate a host that overrode 'User' with a plain Authenticatable
        // missing getRules()/changeRules(). The controller must skip validation
        // gracefully instead of throwing "Call to undefined method".
        config()->set('laravel-access-list.User', \App\Models\User::class);

        $this->postJson('/acl/users', [
            'name' => 'Carol',
            'email' => 'carol@test.local',
            'password' => 'secret123',
        ])->assertStatus(200)->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', ['email' => 'carol@test.local']);
    }

    public function test_update_modifies_existing_user(): void
    {
        $user = $this->createUser('old@test.local');

        $this->putJson('/acl/users', [
            'user_id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@test.local',
        ])->assertStatus(200)->assertJson(['success' => true]);

        $fresh = $user->fresh();
        $this->assertSame('Updated Name', $fresh->name);
        $this->assertSame('updated@test.local', $fresh->email);
    }

    public function test_update_changes_password_when_provided(): void
    {
        $user = $this->createUser();
        $oldHash = $user->password;

        $this->putJson('/acl/users', [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'newsecret123',
        ])->assertStatus(200);

        $this->assertNotSame($oldHash, $user->fresh()->password, 'password should be re-hashed');
    }

    public function test_update_keeps_password_when_not_provided(): void
    {
        $user = $this->createUser();
        $oldHash = $user->password;

        $this->putJson('/acl/users', [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ])->assertStatus(200);

        $this->assertSame($oldHash, $user->fresh()->password, 'password unchanged when omitted');
    }

    public function test_destroy_hard_deletes_when_no_softdeletes(): void
    {
        $user = $this->createUser();

        $this->deleteJson('/acl/users', ['user_id' => $user->id])
            ->assertStatus(200)->assertJson(['success' => true]);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_add_role_to_user_attaches_role(): void
    {
        $user = $this->createUser();
        $role = Role::where('name', 'admin')->firstOrFail();

        $this->postJson('/acl/user/roles', [
            'user_id' => $user->id,
            'role_id' => $role->id,
        ])->assertStatus(200)->assertJson(['success' => true]);

        $this->assertTrue($user->fresh()->roles->contains('id', $role->id));
    }

    public function test_add_role_is_idempotent(): void
    {
        $user = $this->createUser();
        $role = Role::where('name', 'admin')->firstOrFail();

        $this->postJson('/acl/user/roles', ['user_id' => $user->id, 'role_id' => $role->id]);
        $this->postJson('/acl/user/roles', ['user_id' => $user->id, 'role_id' => $role->id]);

        $this->assertCount(1, $user->fresh()->roles, 'syncWithoutDetaching should not duplicate');
    }

    public function test_get_roles_from_user_returns_attached_roles(): void
    {
        $user = $this->createUser();
        $admin = Role::where('name', 'admin')->firstOrFail();
        $acl = Role::where('name', 'acl')->firstOrFail();

        $user->roles()->sync([$admin->id, $acl->id]);

        $response = $this->getJson('/acl/user/roles?user_id=' . $user->id)
            ->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_delete_role_of_the_user_detaches(): void
    {
        $user = $this->createUser();
        $role = Role::where('name', 'admin')->firstOrFail();
        $user->roles()->sync([$role->id]);

        $this->deleteJson('/acl/user/roles', [
            'user_id' => $user->id,
            'role_id' => $role->id,
        ])->assertStatus(200);

        $this->assertCount(0, $user->fresh()->roles);
    }

    public function test_get_roles_array_returns_roles_decorated_with_value_field(): void
    {
        $response = $this->getJson('/acl/user/roles/get_array')
            ->assertStatus(200);

        $data = $response->json('data');

        $this->assertNotEmpty($data);
        $first = $data[0];
        $this->assertArrayHasKey('id', $first);
        $this->assertArrayHasKey('value', $first);
        $this->assertSame($first['id'], $first['value']);
    }
}
