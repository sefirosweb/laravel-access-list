<?php

namespace Sefirosweb\LaravelAccessList;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class LaravelAccessListServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/views', 'acl');
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
        $this->mergeConfigFrom(__DIR__ . '/config/config.php', 'laravel-access-list');
        $this->registerRoutes();

        $this->publishes([
            __DIR__ . '/../public/vendor/laravel-access-list' => public_path('vendor/laravel-access-list'),
        ], 'view');

        $this->publishes([
            __DIR__ . '/config/config.php' => config_path('laravel-access-list.php'),
        ], 'config');

        $this->app['router']->aliasMiddleware('checkAcl', 'Sefirosweb\LaravelAccessList\Http\Middleware\CheckACLMiddleware::class');
    }

    protected function registerRoutes()
    {
        Route::group($this->routeConfiguration(), function () {
            $this->loadRoutesFrom(__DIR__ . '/routes/web.php');
        });
    }
    protected function routeConfiguration()
    {
        return [
            'prefix' => config('laravel-access-list.prefix'),
            'middleware' => config('laravel-access-list.middleware'),
        ];
    }

    public function register()
    {
    }
}
