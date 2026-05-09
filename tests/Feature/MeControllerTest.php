<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Tests\TestCase;

class MeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_null_data_when_unauthenticated(): void
    {
        $this->getJson('/acl/me')
            ->assertStatus(200)
            ->assertExactJson(['data' => null]);
    }

    public function test_returns_authenticated_user_public_fields(): void
    {
        $user = User::forceCreate([
            'name' => 'Jane',
            'email' => 'jane@test.local',
            'password' => bcrypt('secret'),
        ]);

        $this->actingAs($user)
            ->getJson('/acl/me')
            ->assertStatus(200)
            ->assertExactJson([
                'data' => [
                    'id' => $user->id,
                    'name' => 'Jane',
                    'email' => 'jane@test.local',
                ],
            ]);
    }
}
