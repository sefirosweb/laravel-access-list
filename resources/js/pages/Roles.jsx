import { Crud } from '@sefirosweb/react-crud'

const Roles = () => {
    return (
        <>
            <h1>Roles</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                canSearch
                createButtonTitle="Create Role"
                crudUrl={`${APP_URL}/roles`}
                primaryKey="id"
                titleOnDelete="name"
                columns={[
                    {
                        Header: '#',
                        accessor: 'id',
                        sortable: true,
                        visible: true
                    },
                    {
                        accessor: 'name',
                        Header: 'Name',
                        titleOnCRUD: 'Role Name',
                        editable: true,
                        sortable: true,
                    },
                    {
                        accessor: 'description',
                        titleOnCRUD: 'Description',
                        Header: 'Description',
                        editable: true,
                        sortable: true,
                        type: 'text'
                    },
                    {
                        accessor: 'users',
                        titleOnCRUD: 'Users',
                        Header: 'Users',
                        editable: true,
                        type: 'multiselect',
                        multiSelectOptionsPrimaryKey: 'id',
                        multiSelectOptionsUrl: `${APP_URL}/role/users`,
                        multiSelectOptionsColumns: [
                            {
                                Header: '#',
                                accessor: 'id'
                            },
                            {
                                Header: 'Name',
                                accessor: 'name'
                            },
                            {
                                Header: 'Email',
                                accessor: 'email'
                            }
                        ],
                    },
                    {
                        accessor: 'access_lists',
                        titleOnCRUD: 'Access Lists',
                        Header: 'Access Lists',
                        editable: true,
                        type: 'multiselect',
                        multiSelectOptionsPrimaryKey: 'id',
                        multiSelectOptionsUrl: `${APP_URL}/role/access_lists`,
                        multiSelectOptionsColumns: [
                            {
                                Header: '#',
                                accessor: 'id'
                            },
                            {
                                Header: 'Name',
                                accessor: 'name'
                            },
                            {
                                Header: 'Description',
                                accessor: 'description'
                            }
                        ],
                    },
                ]}
            />
        </>
    );
}

export default Roles;