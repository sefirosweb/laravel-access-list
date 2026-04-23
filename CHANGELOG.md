# Changelog

All notable changes to `sefirosweb/laravel-access-list` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
