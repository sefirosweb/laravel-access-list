import React from 'react';
import { APP_URL } from '@/types/configurationType';
import { ColumnDefinition, Crud, FieldTypes, MultiSelectOptionsColumns, useGetQueryClient } from '@sefirosweb/react-crud'
import { useTranslation } from 'react-i18next';

export const Roles = () => {
    const queryClient = useGetQueryClient();
    const { t } = useTranslation()

    const multiSelectUser: MultiSelectOptionsColumns<User> = {
        primaryKey: 'id',
        sentKeyAs: "user_id",
        url: `${APP_URL}/role/users`,
        getDataUrl: `${APP_URL}/role/users/get_array`,
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
                header: 'Email',
                accessorKey: 'email'
            },
        ],
    }

    const multiSelectAccessList: MultiSelectOptionsColumns<AccessList> = {
        primaryKey: 'id',
        sentKeyAs: 'acl_id',
        url: `${APP_URL}/role/access_lists`,
        getDataUrl: `${APP_URL}/role/access_lists/get_array`,
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


    const columns: Array<ColumnDefinition<Role>> = [
        {
            header: '#',
            accessorKey: 'id',
            enableSorting: true,
            visible: true
        },
        {
            accessorKey: 'name',
            header: t('Name'),
            titleOnCRUD: 'Role Name',
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
            id: 'users',
            titleOnCRUD: t('Users'),
            header: t('Users'),
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectUser
        },
        {
            id: 'access_lists',
            titleOnCRUD: t('AccessList'),
            header: t('AccessList'),
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectAccessList
        },
    ]

    return (
        <>
            <h1>{t('Roles')}</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                createButtonTitle={t('create_role')}
                crudUrl={`${APP_URL}/roles`}
                primaryKey="id"
                sentKeyAs="role_id"
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