<?php

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Sefirosweb\LaravelAccessList\Http\Middleware\CheckACLMiddleware;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

class CheckACLMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app('router')->aliasMiddleware('checkAcl', CheckACLMiddleware::class);

        // A tiny route protected by the middleware to exercise the whole stack.
        Route::middleware(['checkAcl:acl_edit'])->get('/_test/protected', function () {
            return response()->json(['ok' => true]);
        });
    }

    private function createUser(string $email = 'user@test.local'): User
    {
        return User::forceCreate([
            'name' => 'Test',
            'email' => $email,
            'password' => bcrypt('secret'),
        ]);
    }

    public function test_guest_gets_401_on_ajax_request(): void
    {
        $this->getJson('/_test/protected')
            ->assertStatus(401)
            ->assertJson(['message' => "You don't have permissions for this site"]);
    }

    public function test_guest_is_redirected_on_non_ajax_request(): void
    {
        $this->get('/_test/protected')->assertRedirect('/');
    }

    public function test_user_without_the_required_acl_is_denied(): void
    {
        $user = $this->createUser();
        // No roles attached → no ACLs.

        $this->actingAs($user)
            ->getJson('/_test/protected')
            ->assertStatus(401);
    }

    public function test_user_with_the_required_acl_is_allowed(): void
    {
        $user = $this->createUser();

        $role = Role::where('name', 'acl')->firstOrFail();
        $aclEdit = AccessList::where('name', 'acl_edit')->firstOrFail();
        $role->access_lists()->sync([$aclEdit->id]);
        $user->roles()->sync([$role->id]);

        $this->actingAs($user)
            ->getJson('/_test/protected')
            ->assertStatus(200)
            ->assertJson(['ok' => true]);
    }

    public function test_admin_acl_grants_access_to_any_protected_route(): void
    {
        $user = $this->createUser();

        $role = Role::where('name', 'admin')->firstOrFail();
        // Admin role already seeded with 'admin' access-list by migrations.
        $user->roles()->sync([$role->id]);

        $this->actingAs($user)
            ->getJson('/_test/protected')
            ->assertStatus(200);
    }

    public function test_user_missing_from_db_despite_being_authenticated_is_denied(): void
    {
        // Regression for added null guard: $User::find() returning null must NOT crash.
        $user = $this->createUser();
        $this->actingAs($user);

        // Simulate stale session: delete the user from DB while still authenticated.
        $user->forceDelete();

        $this->getJson('/_test/protected')->assertStatus(401);
    }
}
