<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Demo seeder: creates 100 users, 15 roles and 50 access lists, then wires
 * random many-to-many relationships.
 *
 * Idempotent on roles/access lists thanks to firstOrCreate; users are always
 * appended (no email collisions because they use the row index).
 *
 * Resolves models via config('laravel-access-list.{User,Role,AccessList}')
 * so it works with any host that overrides those — including hosts that add
 * extra columns like `position`. This seeder does not touch host-specific
 * columns; if the host wants demo values for them, layer another seeder on
 * top.
 *
 * Run with:
 *   php artisan db:seed --class="Sefirosweb\\LaravelAccessList\\Seeders\\AclDemoSeeder"
 */
class AclDemoSeeder extends Seeder
{
    public function run(): void
    {
        $User = config('laravel-access-list.User');
        $Role = config('laravel-access-list.Role');
        $AccessList = config('laravel-access-list.AccessList');

        // ---- 100 users (skip if the table already has >= 100 rows) ----
        $existing = $User::query()->count();
        if ($existing < 100) {
            $needed = 100 - $existing;
            $now = now();
            $rows = [];
            for ($i = 1; $i <= $needed; $i++) {
                $n = $existing + $i;
                $rows[] = [
                    'name' => 'Demo User ' . $n,
                    'email' => 'demo' . $n . '@example.test',
                    'password' => Hash::make('password'),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            // Use insert() to avoid firing model events (faster + plays well
            // with the saving/creating hooks the package once shipped).
            DB::table((new $User)->getTable())->insert($rows);
        }

        // ---- 15 roles ----
        $roleNames = [
            'sales-team', 'warehouse', 'it-admins', 'finance', 'production',
            'hr', 'logistics', 'marketing', 'design', 'purchasing',
            'support', 'qa', 'managers', 'directors', 'interns',
        ];

        $roles = collect($roleNames)->map(fn (string $name) => $Role::firstOrCreate(
            ['name' => $name],
            ['description' => Str::title(str_replace('-', ' ', $name)) . ' team'],
        ));

        // ---- 50 access lists (10 resources × 5 actions) ----
        $resources = [
            'user', 'invoice', 'order', 'product', 'report',
            'dashboard', 'settings', 'audit', 'ticket', 'contract',
        ];
        $actions = ['view', 'create', 'edit', 'delete', 'export'];

        $accesses = collect();
        foreach ($resources as $res) {
            foreach ($actions as $act) {
                $name = "{$res}_{$act}";
                $accesses->push($AccessList::firstOrCreate(
                    ['name' => $name],
                    ['description' => Str::title(str_replace('_', ' ', $name))],
                ));
            }
        }

        // ---- Wire user ↔ role: each user joins 1-3 random roles ----
        $User::query()->get()->each(function ($user) use ($roles): void {
            $ids = $roles->random(random_int(1, 3))->pluck('id')->all();
            $user->roles()->syncWithoutDetaching($ids);
        });

        // ---- Wire role ↔ access: each role grants 3-15 random accesses ----
        $roles->each(function ($role) use ($accesses): void {
            $ids = $accesses->random(random_int(3, 15))->pluck('id')->all();
            $role->access_lists()->syncWithoutDetaching($ids);
        });

        $this->command?->info('AclDemoSeeder finished.');
        $this->command?->info('  users        = ' . $User::query()->count());
        $this->command?->info('  roles        = ' . $Role::query()->count());
        $this->command?->info('  access lists = ' . $AccessList::query()->count());
        $this->command?->info('  user_has_role rows = ' . DB::table('user_has_role')->count());
        $this->command?->info('  role_has_acl rows  = ' . DB::table('role_has_acl')->count());
    }
}
