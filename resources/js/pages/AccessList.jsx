import { Crud } from '@sefirosweb/react-crud'

const AccessList = () => {
    const url = `${APP_URL}/acl/access_list`

    return (
        <>
            <h1>AccessList</h1>
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
                    }
                ]}
            />
        </>
    );
}

export default AccessList;