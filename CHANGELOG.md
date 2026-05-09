# Changelog

All notable changes to `sefirosweb/laravel-access-list` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [13.0.2] - 2026-05-09

### Added
- Keyboard accessibility on dialogs: `ConfirmModal` and `Drawer` now trap focus and restore it on close.
  - Focus moves to the first focusable element when the dialog opens (Cancel button on confirms).
  - `Tab` / `Shift+Tab` cycles within the dialog; the user can no longer tab into the underlying page.
  - Closing the dialog restores focus to whatever was focused before it opened.
  - `Escape` continues to close the dialog (skipped while a mutation is in flight, so users don't abort half-way).
- New `useFocusTrap` hook in `resources/js/lib/` powering the trap. Reused 1:1 in `laravel-mailing` and `laravel-cronjobs`.

## [13.0.1] - 2026-05-09

This release pairs a long list of backend hardening fixes with a complete rewrite of the bundled admin UI. The package surface is unchanged, so upgrading is just a `composer update` + republish of `acl-assets`. Hosts that copy or extend `Sefirosweb\…\Http\Models\User` should re-read the *Customizing the User model* section of the README — the package model now ships `getRules()`, `changeRules()`, `$fillable` and `$hidden` directly.

### Added
- **New admin UI** at `/acl`. Rewritten on React 19 + TypeScript 5.7 + Vite 6 + TanStack Query 5 + i18next. The dependency on `react-bootstrap` and `@sefirosweb/react-crud` is gone, the bundle is fully self-contained, and the design is mobile-responsive.
  - Self-hosted Geist + Geist Mono fonts (no CDN, no external network calls).
  - i18n with browser language detection + persisted user choice (ES / EN), with a manual switcher in the top nav.
  - Optimistic toggles with rollback for user↔group, group↔user, group↔access and access↔group attachments — the UI no longer flickers between "mutation done" and "refetch done".
  - Sort toggle in every relations drawer (Name / Assigned), so on a 100-user group you can pin all assignees to the top.
  - Per-row spinner during in-flight toggle mutations.
  - Debounced search (200 ms) on the Users / Groups / Accesses listings to keep input responsive on 10k+-row tables.
  - Soft-delete UI: when the configured `User` uses `Illuminate\Database\Eloquent\SoftDeletes`, the listing exposes an *Active / All / Deleted* segmented filter and trashed rows show a "Deleted" badge plus a Restore action (the `DELETE /acl/users` endpoint already toggled delete/restore — only the UI was missing).
  - Dynamic user form: the Edit/New drawer renders inputs from the `$fillable` of the configured `User` model (`GET /acl/get_user_fillable_data` returns the schema), so hosts can add custom columns like `position` and the form picks them up automatically. Hidden fields render as password inputs; aggressive autofill blockers (`autoComplete="new-password"`, randomized `name`, `data-lpignore`, `data-1p-ignore`) keep browsers from filling the admin's password into a row they're editing.
- `MeController` + `GET /acl/me` returning the authenticated user's `id / name / email`, or `{ data: null }` when anonymous. Used by the top nav to render the current admin's chip.
- `Sefirosweb\LaravelAccessList\Seeders\AclDemoSeeder`: production-safe demo seeder (100 users, 15 roles, 50 access lists, random many-to-many wiring). Idempotent on roles/access lists via `firstOrCreate`; users gated by a `count >= 100` check. Resolves models via `config(...)` so it works against any host override.
- `MeControllerTest`, `EagerLoadingTest` (regression for the N+1 fixes below), `AclDemoSeederTest` (volume + idempotency). Suite is now **32 tests / 91 assertions**.
- `useDebouncedValue` hook + `IconRefresh` icon (used by the Restore action).

### Changed
- **Eager loading on listing endpoints** — closes a real N+1 the smoke test surfaced (one extra request per row to fetch the row's relations):
  - `GET /acl/users` now `with('roles:id,name,description')`.
  - `GET /acl/roles` now `withCount(['users', 'access_lists'])`.
  - `GET /acl/access_list` now `with('roles:id,name')`.
  Frontend reads these directly instead of issuing per-row follow-up requests.
- **Backend nomenclature aligned with Laravel/Eloquent conventions**: every `acl_id` request input was renamed to `access_list_id` (controllers, requests, seed data) so payloads match the resource's actual table/column names. The package frontend translates the UI names ("Grupos", "Accesos") at the i18n layer; backend stays idiomatic Laravel.
- `Http\Requests\RoleRequest` and `AccessListRequest` now read the row id from `role_id` / `access_list_id` (matching what the bundled UI sends) when building the unique-name rule, instead of `$this->id`. Description is now nullable. This fixes editing a row to keep its current name (was failing the unique constraint).
- `RoleController::get_acl_array` renamed to `get_access_lists_array` (the route alias `roles/access_lists/get_array` is unchanged, only the public PHP method name moved). External callers using the route are unaffected.
- README rewritten — new screenshots of the bundled UI, updated *Customizing the User model* section reflecting the new bundled `User` model defaults, soft-delete UI section, demo seeder section.

### Fixed
- `UserController::store/update/destroy` now tolerate `User` models that don't define `getRules()` / `changeRules()` (guarded with `method_exists`). Previously a custom `App\Models\User` without these methods caused `Call to undefined method` fatals on the CRUD endpoints.
- `UserController::enabledSoftDelete()` and `get_fillable_data()` no longer hard-reference `App\Models\User`. They now resolve the model from `config('laravel-access-list.User')`, removing the implicit dependency on the host's `App\Models\User` class existing.
- `getRules()` excludes the row being updated from the unique-email rule by reading `user_id` from the request (the field the package frontend sends), in addition to `id`.
- Toast was rendering bottom-right on top of the drawer's confirm button. Moved to top-right with `z-index: 80` (above drawer 51 / modal 60).

### Added (model)
- `Sefirosweb\LaravelAccessList\Http\Models\User` now ships with `getRules()` and `changeRules()` defined directly. The model is usable as the package default without requiring the host to override the config or add a trait.
- `$fillable = ['name', 'email', 'password']` and `$hidden = ['password', 'remember_token']` on the package `User` so mass assignment and JSON serialization behave correctly out of the box.

### Deprecated
- `Sefirosweb\LaravelAccessList\Http\Traits\SelfModelValidator`: the trait's `saving`/`creating` hooks validate via `$model->toArray()`, which silently drops `$hidden` fields like `password` and produces false "required" failures. The trait is unused inside the package and will be removed in v14.0.0. Apps that adopted it should move `getRules()`/`changeRules()` directly onto their model.

### Removed
- `react-bootstrap`, `@sefirosweb/react-crud`, the legacy `how_to.gif` and the old Webpack/Mix-style asset pipeline. Asset publishing target (`public/vendor/laravel-access-list`) is unchanged — `php artisan vendor:publish --tag=acl-assets --force` still works and overwrites cleanly.

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
