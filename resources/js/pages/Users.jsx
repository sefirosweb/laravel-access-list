import { Crud } from '@sefirosweb/react-crud'

const Users = () => {
    return (
        <>
            <h1>Users</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                canSearch
                createButtonTitle="Create User"
                crudUrl={`${APP_URL}/acl/users`}
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
                        titleOnCRUD: 'Name',
                        editable: true,
                        sortable: true,
                    },
                    {
                        accessor: 'email',
                        titleOnCRUD: 'Email',
                        Header: 'Email',
                        editable: true,
                        sortable: true,
                        type: 'text'
                    },
                    {
                        accessor: 'roles',
                        titleOnCRUD: 'Roles',
                        Header: 'Roles',
                        editable: true,
                        type: 'multiselect',
                        multiSelectOptionsPrimaryKey: 'id',
                        multiSelectOptionsUrl: `${APP_URL}/acl/user/roles`,
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
                                Header: 'Descripcion',
                                accessor: 'description'
                            }
                        ],
                    },
                    {
                        accessor: 'password',
                        titleOnCRUD: 'Password',
                        Header: 'Password',
                        visible: false,
                        editable: true,
                        type: 'password'
                    },
                    {
                        accessor: 'is_active',
                        Header: 'Active',
                        editable: false,
                        type: 'text'
                    }
                ]}
            />
        </>
    );
}

export default Users;