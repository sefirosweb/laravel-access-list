<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Seeders\AclDemoSeeder;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

class AclDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeds_expected_volume(): void
    {
        $this->seed(AclDemoSeeder::class);

        $this->assertSame(100, User::query()->count());
        // Service provider seeds 2 base roles (admin, acl). Demo adds 15 new.
        $this->assertGreaterThanOrEqual(15, Role::query()->count());
        // Service provider seeds 3 base access lists; demo adds 50 new.
        $this->assertGreaterThanOrEqual(50, AccessList::query()->count());

        $this->assertGreaterThan(0, DB::table('user_has_role')->count());
        $this->assertGreaterThan(0, DB::table('role_has_acl')->count());
    }

    public function test_is_idempotent_on_roles_and_access_lists(): void
    {
        $this->seed(AclDemoSeeder::class);
        $rolesAfterFirst = Role::query()->count();
        $accessAfterFirst = AccessList::query()->count();

        // Re-running should NOT duplicate roles / access lists thanks to
        // firstOrCreate. Users use insert() and are gated by a >=100 check,
        // so the user count also stays at 100.
        $this->seed(AclDemoSeeder::class);

        $this->assertSame($rolesAfterFirst, Role::query()->count());
        $this->assertSame($accessAfterFirst, AccessList::query()->count());
        $this->assertSame(100, User::query()->count());
    }
}
