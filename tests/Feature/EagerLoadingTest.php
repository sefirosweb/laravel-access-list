<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

/**
 * Regression suite for the N+1 issue that hit production: each row in the
 * users / roles / access lists listing was triggering an extra query for
 * its relations or counters. Now controllers do `with(...)` / `withCount(...)`.
 */
class EagerLoadingTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_endpoint_eager_loads_roles_in_constant_queries(): void
    {
        $admin = Role::where('name', 'admin')->firstOrFail();
        $aclRole = Role::where('name', 'acl')->firstOrFail();

        for ($i = 0; $i < 5; $i++) {
            $u = User::forceCreate([
                'name' => "U{$i}",
                'email' => "u{$i}@t.local",
                'password' => bcrypt('x'),
            ]);
            $u->roles()->sync([$admin->id, $aclRole->id]);
        }

        DB::enableQueryLog();
        $resp = $this->getJson('/acl/users')->assertStatus(200);
        $count = count(DB::getQueryLog());
        DB::disableQueryLog();

        // Without eager loading this would be 1 + N (one per user). With
        // `with('roles')` we expect a small constant: SELECT users + SELECT
        // roles via pivot.
        $this->assertLessThanOrEqual(
            3,
            $count,
            "Expected eager-loaded query count, got {$count}",
        );

        $first = $resp->json('data.0');
        $this->assertArrayHasKey('roles', $first, 'roles should be hydrated');
        $this->assertCount(2, $first['roles']);
    }

    public function test_roles_endpoint_returns_users_count_and_access_lists_count(): void
    {
        $role = Role::create(['name' => 'analysts', 'description' => 'A']);
        $access = AccessList::create([
            'name' => 'reports_view',
            'description' => 'view',
        ]);
        $role->access_lists()->attach($access);

        $u = User::forceCreate([
            'name' => 'Z',
            'email' => 'z@t.local',
            'password' => bcrypt('x'),
        ]);
        $u->roles()->attach($role);

        $resp = $this->getJson('/acl/roles')->assertStatus(200);
        $analysts = collect($resp->json('data'))
            ->firstWhere('name', 'analysts');

        $this->assertSame(1, $analysts['users_count']);
        $this->assertSame(1, $analysts['access_lists_count']);
    }

    public function test_access_lists_endpoint_eager_loads_roles(): void
    {
        $role = Role::where('name', 'admin')->firstOrFail();
        $access = AccessList::where('name', 'admin')->firstOrFail();
        $access->roles()->sync([$role->id]);

        $resp = $this->getJson('/acl/access_list')->assertStatus(200);
        $first = collect($resp->json('data'))
            ->firstWhere('name', 'admin');

        $this->assertArrayHasKey('roles', $first);
        $this->assertNotEmpty($first['roles']);
        $this->assertSame('admin', $first['roles'][0]['name']);
    }
}
