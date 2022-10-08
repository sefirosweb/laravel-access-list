import React from 'react'
import { ColumnDefinition, Crud, FieldTypes, MultiSelectOptionsColumns } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';

export default () => {

    const multiSelectRole: MultiSelectOptionsColumns<Role> = {
        primaryKey: 'id',
        url: `${APP_URL}/user/roles`,
        getDataUrl: `${APP_URL}/user/roles/get_array`,
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

    const columns: Array<ColumnDefinition<User>> = [
        {
            accessorKey: 'id',
            header: '#',
            enableSorting: true,
            visible: true
        },
        {
            accessorKey: 'name',
            header: 'Name',
            titleOnCRUD: 'Name',
            editable: true,
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            titleOnCRUD: 'Email',
            header: 'Email',
            editable: true,
            enableSorting: true,
        },
        {
            accessorKey: 'deleted_at',
            titleOnCRUD: 'Deleted At',
            header: 'Deleted At',
            editable: false,
            enableSorting: true,
        },
        {
            id: 'roles',
            titleOnCRUD: 'Roles',
            header: 'Roles',
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectRole
        },
        {
            accessorKey: 'password',
            titleOnCRUD: 'Password',
            header: 'Password',
            visible: false,
            editable: true,
            fieldType: FieldTypes.PASSWORD
        },
    ]

    return (
        <>
            <h1>Users</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                createButtonTitle="Create User"
                crudUrl={`${APP_URL}/users`}
                primaryKey="id"
                titleOnDelete="email"
                columns={columns}
            />
        </>
    );
}