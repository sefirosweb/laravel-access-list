import { Crud } from '@sefirosweb/react-crud'

const Roles = () => {
    const url = `${APP_URL}/acl/roles`

    return (
        <>
            <h1>Roles</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                canSearch
                createButtonTitle="Create Access List"
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
                        titleOnCRUD: 'ACL Nanme',
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
                    }
                ]}
            />
        </>
    );
}

export default Roles;