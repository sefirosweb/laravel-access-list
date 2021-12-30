import { Crud } from '@sefirosweb/react-crud'

const Users = () => {
    const url = `${APP_URL}/acl/users`

    return (
        <>
            <h1>Users</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                canSearch
                createButtonTitle="Create User"
                crudUrl={url}
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
                        accessor: 'password',
                        titleOnCRUD: 'Password',
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