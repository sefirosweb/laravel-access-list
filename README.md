# Laravel Access List

ACL package for Laravel: roles, access lists, and a route middleware to gate your app by permission name.

The design goal is to stay out of your auth flow — this package does **not** manage users, sessions or authentication. It only answers the question *"does the currently authenticated user have access to ACL `foo`?"*.

## Requirements

- PHP `^8.3`
- Laravel `^13.0`

Older majors of Laravel live on separate branches (`12.x`, `9.x`) and only receive critical fixes.

## Installation

```bash
composer require sefirosweb/laravel-access-list:^13.0
```

The service provider auto-registers via Laravel's package discovery.

Run the migrations:

```bash
php artisan migrate
```

This creates four tables and seeds two roles and three access lists:

| Role  | Seeded access lists |
|-------|---------------------|
| `admin` | `admin` |
| `acl` | `acl_view`, `acl_edit` |

The `admin` access list is a superuser marker: any user whose roles include it passes every `checkAcl:*` check regardless of the ACL name.

## Configuration

Publish the config if you want to change the prefix, middleware stack, or override the user model:

```bash
php artisan vendor:publish --provider="Sefirosweb\LaravelAccessList\LaravelAccessListServiceProvider" --tag=config --force
```

Default `config/laravel-access-list.php`:

```php
return [
    'prefix' => 'acl',
    'middleware' => ['web', 'auth', 'checkAcl:acl_edit'],
    'AccessList' => Sefirosweb\LaravelAccessList\Http\Models\AccessList::class,
    'Role'       => Sefirosweb\LaravelAccessList\Http\Models\Role::class,
    'User'       => Sefirosweb\LaravelAccessList\Http\Models\User::class,
];
```

- `prefix`: the URL prefix for the bundled admin UI (`/acl/...`).
- `middleware`: the middleware stack applied to those routes.
- `AccessList` / `Role` / `User`: model classes the package resolves at runtime. The defaults point to the bundled models so the package works out of the box. See *Customizing the User model* below if you want to use your own.

Publish the admin UI assets:

```bash
php artisan vendor:publish --provider="Sefirosweb\LaravelAccessList\LaravelAccessListServiceProvider" --tag=acl-assets --force
```

## Customizing the User model

The package ships with `Sefirosweb\LaravelAccessList\Http\Models\User`, fully usable out of the box. Most production apps will want to point at their own `App\Models\User` instead (so it carries auth scaffolding, custom columns, casts, etc.). This follows the same pattern as `spatie/laravel-permission`: the config defaults to the package's model, you override it for your app.

### Recommended: extend the package model

This is the simplest and most forward-compatible way — your model inherits `roles()`, `getRules()`, `changeRules()`, `$fillable`, `$hidden` for free, and you only redeclare what you need to customize.

```php
// app/Models/User.php
namespace App\Models;

use Sefirosweb\LaravelAccessList\Http\Models\User as AccessListUser;

class User extends AccessListUser
{
    // Your own casts, fillable, scopes, accessors...
}
```

```php
// config/laravel-access-list.php
'User' => App\Models\User::class,
```

That's it. The bundled `/acl` UI now operates on your `App\Models\User`.

### Alternative: keep your model independent

If you can't extend (e.g. your `App\Models\User` already extends a base class from another package), the bundled `UserController` is **tolerant** — it guards calls to `getRules()` / `changeRules()` with `method_exists()`, so missing those methods just disables the package's input validation (you can plug in your own `FormRequest` instead). The only hard requirement is the `roles()` relation, used by the "Roles del user" modal:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            config('laravel-access-list.Role'),
            'user_has_role'
        );
    }

    // Optional helpers if you want to call $user->hasAcl('foo') from your code:
    public function hasAcl(string $acl): bool { /* ... */ }
}
```

If you also want the package to validate user input on `POST /acl/users` and `PUT /acl/users`, add the static `getRules()` and instance `changeRules()` methods (signatures match the bundled User).

## Usage

### 1. Protect routes with the `checkAcl` middleware

The service provider registers the middleware alias `checkAcl` automatically.

```php
Route::get('/admin/reports', fn () => view('reports'))
    ->middleware(['auth', 'checkAcl:reports_view']);
```

Behaviour when denied:
- JSON / AJAX requests → `401` with `{"message": "You don't have permissions for this site"}`.
- Regular requests → redirect to `/`.

### 2. Manage roles and access lists programmatically

```php
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;

$acl  = AccessList::create(['name' => 'reports_view', 'description' => 'View reports']);
$role = Role::create(['name' => 'analyst',       'description' => 'Analytics staff']);

$role->access_lists()->attach($acl);
$user->roles()->attach($role);

// Now the analyst can access any route protected by `checkAcl:reports_view`.
```

### 3. Manage from the bundled UI

After publishing assets and enabling the package routes, browse to `/acl` to use the bundled admin UI for creating roles, access lists, and assigning them to users.

### 4. Check ACL from your own code

```php
$user = request()->user();

if ($user->hasAcl('reports_view')) {
    // ...
}
```

## Testing

The package ships an Orchestra Testbench suite covering middleware behaviour, migrations, and role management.

```bash
composer install
./vendor/bin/phpunit
```

The full suite uses SQLite `:memory:` and does not need a host Laravel app.

When working from the [laravel-test](https://github.com/sefirosweb/laravel-test) harness with Sail:

```bash
docker exec -w /var/www/html/packages/laravel-access-list laravel-test-laravel.test-1 ./vendor/bin/phpunit
```

## Versioning

Major versions are aligned with Laravel majors (`13.x`, `12.x`, `11.x`, `9.x` …). See the root [CLAUDE.md](https://github.com/sefirosweb/laravel-test/blob/13.0/CLAUDE.md) of the test harness for the full policy.

## License

MIT.
