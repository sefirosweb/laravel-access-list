## Laravel - Access List

A Laravel package for advanced access list aplication

The aim of this library is to be as simple as possible. We won't mess with Laravel users, auth, session...

Just add in the part of code that you need to verify access, be it in the path, controller or view

## Installation - Composer

You can install the package via composer:

```
composer require sefirosweb/laravel-access-list
```

Or manually add this to your composer.json:

**composer.json**

```json
"sefirosweb/laravel-access-list": "*"
```

If you are using Laravel 5.5 and up, the service provider will automatically get registered.

For older versions of Laravel (<5.5), you have to add the service provider:

**config/app.php**

```php
'providers' => [
        ...
    	Sefirosweb\LaravelAccessList\LaravelAccessListServiceProvider::class,
]
```

Install database migrations

```
php artisan migrate
```

Publish React front:

```
php artisan vendor:publish --provider="Sefirosweb\LaravelAccessList\LaravelAccessListServiceProvider"  --tag=acl-assets --force
```

If you need edit prefix of tool or middleware you can publish the config:

```
php artisan vendor:publish --provider="Sefirosweb\LaravelAccessList\LaravelAccessListServiceProvider"  --tag=config --force
```

Add in to routes of web.php or api.php

```php
Route::group(['middleware' => ['checkAcl:foo_role_1']], function () {
    return view('foo_View');
});
```

Add more ACLs for your application:
http://your_app/acl/view/users

![image](https://raw.githubusercontent.com/sefirosweb/laravel-access-list/master/docs/how_to.gif)

# Develop

## Install dependencies:

```
npm install
composer install
```

## Start Frontend

```
npm run watch
```

## Build to production

```
npm run prod
git tag X.X.X
git push --tag
```
