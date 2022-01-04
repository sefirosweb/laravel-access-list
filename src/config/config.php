<?php

return [
    'prefix' => 'acl',
    'middleware' => ['web', 'auth', 'checkAcl:acl_edit']
];
