import React, { useEffect, useRef, useState } from 'react'
import { ColumnDefinition, Crud, CrudPropsRef, FieldTypes, MultiSelectOptionsColumns } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

type ModelDefinition = {
    id: string,
    fillable: Array<string>,
    hidden: Array<string>,
    softDelete: boolean
}

export default () => {
    const crudRef = useRef<CrudPropsRef>(null);
    const [filters, setFilters] = useState("active");
    const [columns, setColumns] = useState<Array<ColumnDefinition<any>>>([]);
    const [primaryId, setPrimaryId] = useState("");
    const [isSoftDelete, setIsSoftDelete] = useState(false)

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

    useEffect(() => {
        crudRef.current.setLazyilters({ status: filters });

        axios.get<ModelDefinition>(`${APP_URL}/get_user_fillable_data`)
            .then((response) => {
                const { id, fillable, hidden, softDelete } = response.data

                setPrimaryId(id)
                setIsSoftDelete(softDelete)

                const newColumns = fillable.map<ColumnDefinition<any>>((column) => {
                    return {
                        header: column,
                        accessorKey: column,
                        visible: hidden.findIndex(columnHidden => columnHidden === column) < 0,
                        editable: true
                    }
                })

                newColumns.unshift({
                    accessorKey: id,
                    visible: false
                })

                newColumns.push({
                    id: 'roles',
                    titleOnCRUD: 'Roles',
                    header: 'Roles',
                    editable: true,
                    fieldType: FieldTypes.MULTISELECT,
                    multiSelectOptions: multiSelectRole
                })

                setColumns(newColumns)
            })
    }, [filters])

    const customFilters = isSoftDelete && (
        <Row>
            <Col sm={12} md={'auto'} className='mt-3'>
                <Form.Select
                    value={filters}
                    onChange={(e) => setFilters(e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="all">All</option>
                    <option value="deleted">Deleted</option>
                </Form.Select>
            </Col>
        </Row>
    )

    return (
        <>
            <h1>Users</h1>
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                customButtons={customFilters}
                createButtonTitle="Create User"
                crudUrl={`${APP_URL}/users`}
                primaryKey={primaryId}
                titleOnDelete="email"
                columns={columns}
                ref={crudRef}
            />
        </>
    );
}