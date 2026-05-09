<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Http\Models;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;

class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    /**
     * Validation rules used by the package's UserController. Apps that
     * override the model in config('laravel-access-list.User') may redefine
     * getRules() to fit their schema. The controller also tolerates models
     * that don't implement this method (no validation is applied then).
     */
    protected array $rules = [];

    public static function getRules(?Request $request = null): array
    {
        // The frontend posts `user_id` on update and nothing on create; accept
        // either `id` or `user_id` so the unique-email rule excludes the row
        // being updated.
        $id = $request?->input('user_id') ?? $request?->input('id');

        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email' . ($id ? ",$id" : ''),
            'password' => $id ? 'sometimes|min:6' : 'required|min:6',
        ];
    }

    public function changeRules(array $rules): void
    {
        $this->rules = $rules;
    }

    public function getDeletedAtAttribute($date)
    {
        if (!$date) return null;
        $time = new DateTime($date);
        return $time->format('Y-m-d H:i:s');
    }

    public function roles(): BelongsToMany
    {
        $Role = config('laravel-access-list.Role');
        return $this->belongsToMany($Role, 'user_has_role');
    }

    public function getAclList()
    {
        return array_values(array_unique($this->roles->reduce(function ($carry, $role) {
            return array_merge($carry, array_column($role->access_lists->toArray(), 'name'));
        }, [])));
    }

    public function hasAcl($acl)
    {
        $acl_list = $this->getAclList();

        if (in_array('admin', $acl_list)) {
            return true;
        }

        if (in_array($acl, $acl_list)) {
            return true;
        }

        return false;
    }
}
