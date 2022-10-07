import React from 'react';
import { APP_URL } from '@/types/configurationType';
import { Crud, FieldTypes, MultiSelectOptionsColumns } from '@sefirosweb/react-crud'

export default () => {

    const multiSelectUser: MultiSelectOptionsColumns<any> = {
        primaryKey: 'id',
        url: `${APP_URL}/role/users`,
        getDataUrl: `${APP_URL}/role/users/get_array`,
        columns: [
            {
                header: '#',
                accessorKey: 'id'
            },
            {
                header: 'Name',
                accessorKey: 'name'
            },
            {
                header: 'Email',
                accessorKey: 'email'
            },
        ],
    }

    const multiSelectAccessList: MultiSelectOptionsColumns<any> = {
        primaryKey: 'id',
        url: `${APP_URL}/role/access_lists`,
        getDataUrl: `${APP_URL}/role/access_lists/get_array`,
        columns: [
            {
                header: '#',
                accessorKey: 'id'
            },
            {
                header: 'Name',
                accessorKey: 'name'
            },
            {
                header: 'Description',
                accessorKey: 'description'
            },
        ],
    }

    return (
        <>
            <h1>Roles</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                createButtonTitle="Create Role"
                crudUrl={`${APP_URL}/roles`}
                primaryKey="id"
                titleOnDelete="name"
                columns={[
                    {
                        header: '#',
                        accessorKey: 'id',
                        enableSorting: true,
                        visible: true
                    },
                    {
                        accessorKey: 'name',
                        header: 'Name',
                        titleOnCRUD: 'Role Name',
                        editable: true,
                        enableSorting: true,
                    },
                    {
                        accessorKey: 'description',
                        titleOnCRUD: 'Description',
                        header: 'Description',
                        editable: true,
                        enableSorting: true,
                    },
                    {
                        accessorKey: 'users',
                        titleOnCRUD: 'Users',
                        header: 'Users',
                        editable: true,
                        fieldType: FieldTypes.MULTISELECT,
                        multiSelectOptions: multiSelectUser
                    },
                    {
                        accessorKey: 'access_lists',
                        titleOnCRUD: 'Access Lists',
                        header: 'Access Lists',
                        editable: true,
                        fieldType: FieldTypes.MULTISELECT,
                        multiSelectOptions: multiSelectAccessList
                    },
                ]}
            />
        </>
    );
}