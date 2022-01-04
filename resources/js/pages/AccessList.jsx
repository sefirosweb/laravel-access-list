import { Crud } from '@sefirosweb/react-crud'

const AccessList = () => {
    return (
        <>
            <h1>Access List</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                canSearch
                createButtonTitle="Create Access List"
                crudUrl={`${APP_URL}/access_list`}
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
                        titleOnCRUD: 'ACL Name',
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
                        accessor: 'roles',
                        titleOnCRUD: 'Roles',
                        Header: 'Roles',
                        editable: true,
                        type: 'multiselect',
                        multiSelectOptionsPrimaryKey: 'id',
                        multiSelectOptionsUrl: `${APP_URL}/access_list/roles`,
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
                ]}
            />
        </>
    );
}

export default AccessList;