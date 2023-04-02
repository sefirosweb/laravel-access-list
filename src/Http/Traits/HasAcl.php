<?php

namespace Sefirosweb\LaravelAccessList\Http\Traits;

trait HasAcl
{
    public function getAclList()
    {
        return array_unique($this->roles->reduce(function ($carry, $role) {
            return array_merge($carry, array_column($role->access_lists->toArray(), 'name'));
        }, []));
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
