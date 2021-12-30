<?php

namespace Sefirosweb\LaravelAccessList;

use Illuminate\Support\ServiceProvider;

class LaravelAccessListServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__ . '/routes/web.php');
        $this->loadViewsFrom(__DIR__ . '/views', 'acl');
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
        $this->publishes([
            __DIR__ . '/../public' => public_path('vendor/laravel-access-list'),
        ], 'laravel-access-list-view');
    }

    public function register()
    {
    }
}
