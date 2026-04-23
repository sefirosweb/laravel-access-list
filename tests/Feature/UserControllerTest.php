<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

/**
 * Integration tests for UserController role-management endpoints.
 *
 * Note: store/update/destroy are NOT tested here because those endpoints
 * call User::getRules() and $user->changeRules() which are expected to be
 * provided by the host application's User model. The package's default
 * User model does not ship them. get_fillable_data() is also skipped
 * because it relies on MySQL-specific "describe users" syntax.
 */
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
