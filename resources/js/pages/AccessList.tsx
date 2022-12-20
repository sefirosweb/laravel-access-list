import React from 'react';
import { ColumnDefinition, Crud, FieldTypes, MultiSelectOptionsColumns } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';

export default () => {
    const multiSelectRole: MultiSelectOptionsColumns<any> = {
        primaryKey: 'id',
        sentKeyAs: 'access_list_id',
        url: `${APP_URL}/access_list/roles`,
        getDataUrl: `${APP_URL}/access_list/roles/get_array`,
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
                header: 'Descripcion',
                accessorKey: 'description'
            },
        ],
    }

    const columns: Array<ColumnDefinition<AccessList>> = [
        {
            accessorKey: 'id',
            header: '#',
            enableSorting: true,
            visible: true
        },
        {
            accessorKey: 'name',
            header: 'Name',
            titleOnCRUD: 'ACL Name',
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
            id: 'roles',
            titleOnCRUD: 'Roles',
            header: 'Roles',
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectRole
        },
    ]

    return (
        <>
            <h1>Access List</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                createButtonTitle="Create Access List"
                crudUrl={`${APP_URL}/access_list`}
                primaryKey="id"
                titleOnDelete="name"
                columns={columns}
            />
        </>
    );
}