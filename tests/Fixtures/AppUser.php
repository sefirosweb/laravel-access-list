<?php

declare(strict_types=1);

// Test fixture: stub of App\Models\User expected by the UserController's
// `enabledSoftDelete()` / `get_fillable_data()` introspection. In production
// the host Laravel app provides this class; Testbench's skeleton does not.
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $guarded = [];

    protected $table = 'users';
}
