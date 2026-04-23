<?php

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Sefirosweb\LaravelAccessList\Http\Middleware\CheckACLMiddleware;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

class ServiceProviderBootTest extends TestCase
{
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    public function test_config_is_merged(): void
    {
        $this->assertSame('acl', config('laravel-access-list.prefix'));
        $this->assertSame(Role::class, config('laravel-access-list.Role'));
        $this->assertSame(AccessList::class, config('laravel-access-list.AccessList'));
    }

    public function test_migrations_create_expected_tables(): void
    {
        $this->assertTrue(Schema::hasTable('roles'));
        $this->assertTrue(Schema::hasTable('access_lists'));
        $this->assertTrue(Schema::hasTable('user_has_role'));
        $this->assertTrue(Schema::hasTable('role_has_acl'));
    }

    public function test_seed_data_inserted_by_migrations(): void
    {
        $this->assertSame(2, Role::count());
        $this->assertSame(3, AccessList::count());
        $this->assertTrue(Role::where('name', 'admin')->exists());
        $this->assertTrue(AccessList::where('name', 'acl_view')->exists());
    }

    public function test_middleware_alias_is_registered(): void
    {
        $middlewares = app('router')->getMiddleware();

        $this->assertArrayHasKey('checkAcl', $middlewares);
        $this->assertSame(CheckACLMiddleware::class, $middlewares['checkAcl']);
    }

    public function test_routes_are_registered_with_prefix(): void
    {
        $aclRoutes = collect(Route::getRoutes()->getRoutes())
            ->filter(fn ($r) => str_starts_with($r->uri(), 'acl'));

        $this->assertGreaterThan(0, $aclRoutes->count());
    }
}
