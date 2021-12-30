<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use App\Models\User as ModelsUser;
use Illuminate\Database\Eloquent\Model;

class User extends ModelsUser
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->mergeFillable(['is_active']);
    }
}
