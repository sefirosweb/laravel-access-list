import React from 'react';
import { APP_URL } from '@/types/configurationType';
import { ColumnDefinition, Crud, FieldTypes, MultiSelectOptionsColumns, useGetQueryClient } from '@sefirosweb/react-crud'

export default () => {
    const queryClient = useGetQueryClient();

    const multiSelectUser: MultiSelectOptionsColumns<User> = {
        primaryKey: 'id',
        sentKeyAs: "role_id",
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

    const multiSelectAccessList: MultiSelectOptionsColumns<AccessList> = {
        primaryKey: 'id',
        sentKeyAs: 'role_id',
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


    const columns: Array<ColumnDefinition<Role>> = [
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
            id: 'users',
            titleOnCRUD: 'Users',
            header: 'Users',
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectUser
        },
        {
            id: 'access_lists',
            titleOnCRUD: 'Access Lists',
            header: 'Access Lists',
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectAccessList
        },
    ]

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
                columns={columns}
                handleSuccess={() => {
                    queryClient.removeQueries({
                        queryKey: [`${APP_URL}/user/roles/get_array`]
                    })
                    queryClient.removeQueries({
                        queryKey: [`${APP_URL}/access_list/roles/get_array`]
                    })
                }}
            />
        </>
    );
}