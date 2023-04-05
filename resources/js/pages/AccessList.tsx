import React from 'react';
import { ColumnDefinition, Crud, FieldTypes, MultiSelectOptionsColumns, useGetQueryClient } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';
import { useTranslation } from 'react-i18next';

export const AccessList = () => {
    const queryClient = useGetQueryClient();
    const { t } = useTranslation()

    const multiSelectRole: MultiSelectOptionsColumns<any> = {
        primaryKey: 'id',
        sentKeyAs: 'role_id',
        url: `${APP_URL}/access_list/roles`,
        getDataUrl: `${APP_URL}/access_list/roles/get_array`,
        columns: [
            {
                header: '#',
                accessorKey: 'id'
            },
            {
                header: t('Name'),
                accessorKey: 'name'
            },
            {
                header: t('Description'),
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
            header: t('Name'),
            titleOnCRUD: t('Name'),
            editable: true,
            enableSorting: true,
        },
        {
            accessorKey: 'description',
            titleOnCRUD: t('Description'),
            header: t('Description'),
            editable: true,
            enableSorting: true,
        },
        {
            id: 'roles',
            titleOnCRUD: t('Roles'),
            header: t('Roles'),
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectRole
        },
    ]

    return (
        <>
            <h1>{t('AccessList')}</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                createButtonTitle={t('create_acl')}
                crudUrl={`${APP_URL}/access_list`}
                primaryKey="id"
                sentKeyAs='acl_id'
                titleOnDelete="name"
                columns={columns}
                handleSuccess={() => {
                    queryClient.removeQueries({
                        queryKey: [`${APP_URL}/role/access_lists/get_array`]
                    })
                }}
            />
        </>
    );
}