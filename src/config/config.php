<?php

return [
    'prefix' => 'acl',
    'middleware' => ['web', 'auth', 'checkAcl:acl_edit'],
    'AccessList' => Sefirosweb\LaravelAccessList\Http\Models\AccessList::class,
    'Role' => Sefirosweb\LaravelAccessList\Http\Models\Role::class,
    'User' => Sefirosweb\LaravelAccessList\Http\Models\User::class,
];
