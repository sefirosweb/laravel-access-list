# Changelog

All notable changes to `sefirosweb/laravel-access-list` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [13.0.1] - 2026-05-09

### Fixed
- `UserController::store/update/destroy` now tolerate `User` models that don't define `getRules()` / `changeRules()` (guarded with `method_exists`). Previously a custom `App\Models\User` without these methods caused `Call to undefined method` fatals on the CRUD endpoints.
- `UserController::enabledSoftDelete()` and `get_fillable_data()` no longer hard-reference `App\Models\User`. They now resolve the model from `config('laravel-access-list.User')`, removing the implicit dependency on the host's `App\Models\User` class existing.
- `getRules()` excludes the row being updated from the unique-email rule by reading `user_id` from the request (the field the package frontend sends), in addition to `id`.

### Added
- `Sefirosweb\LaravelAccessList\Http\Models\User` now ships with `getRules()` and `changeRules()` defined directly. The model is usable as the package default without requiring the host to override the config or add a trait.
- `$fillable = ['name', 'email', 'password']` and `$hidden = ['password', 'remember_token']` on the package `User` so `mass assignment` and JSON serialization behave correctly out of the box.
- 8 new feature tests covering store/update/destroy flows including the tolerance case for hosts that override `User` without `getRules()` (suite is now 25 tests / 65 assertions).

### Deprecated
- `Sefirosweb\LaravelAccessList\Http\Traits\SelfModelValidator`: the trait's `saving`/`creating` hooks validate via `$model->toArray()`, which silently drops `$hidden` fields like `password` and produces false "required" failures. The trait is unused inside the package and will be removed in v14.0.0. Apps that adopted it should move `getRules()`/`changeRules()` directly onto their model.

## [13.0.0] - 2026-05-09

### Changed
- Bumped `laravel/framework` to `^13.0`, `php` to `^8.3`, `phpunit/phpunit` to `^12.0`, `orchestra/testbench` to `^11.0`. CI matrix now PHP 8.3 / 8.4. Branch policy: `13.x` is the new default, `12.x` frozen for fix-only.

## [12.0.3] - 2026-04-23

### Changed
- Added native return types to `SelfModelValidator::bootSelfModelValidator(): void`, `changeRules(array $rules): void` and `getRules(?Request $request = null): array`.

## [12.0.2] - 2026-04-23

### Changed
- Enabled `declare(strict_types=1);` on every PHP file under `src/`. The whole package now runs under strict type coercion rules. Test suite (17 tests, 40 assertions) passes unchanged, so no runtime coercion was hiding bugs.

## [12.0.1] - 2026-04-23

### Changed
- `CheckACLMiddleware` now guards against null authenticated users and missing DB rows for the authenticated user, returning a 401 (JSON) or redirect (non-JSON) instead of throwing a `Null` dereference.
- Rewritten `README.md` documenting installation, configuration, middleware usage, programmatic role/ACL management and testing workflow.

### Added
- Orchestra Testbench integration test suite covering `CheckACLMiddleware` (guest denial, missing-ACL denial, admin superuser grant, stale-session regression) and `UserController` role management endpoints.
- `tests/Fixtures/AppController.php` + `tests/Fixtures/AppUser.php` stubs so the suite runs without a host Laravel application.
- `strict_types=1` declared on all test files.

## [12.0.0] - 2026-04-23

### Added
- Initial Laravel 12 release. Requires PHP `^8.2` and `laravel/framework ^12.0`.
- Orchestra Testbench baseline suite (service provider boot, middleware alias registration, migrations and seeded roles / access lists).

### Changed
- Migrated all package routes from the legacy `'Controller@method'` string syntax to the FQCN array form `[Controller::class, 'method']`.
- Converted the four class-based migrations to anonymous-class syntax (standard since Laravel 9).
- Fixed middleware alias registration: the service provider used to pass a string literal `'Sefirosweb\…\CheckACLMiddleware::class'` (which does not interpolate `::class`). Now uses the actual class constant.

### Removed
- Support for Laravel `< 12` on this branch. Older majors live on the `9.x` branch with their legacy tag lineage.
