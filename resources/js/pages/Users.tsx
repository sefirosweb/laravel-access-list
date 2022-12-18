import React, { useEffect, useRef, useState } from 'react'
import { ColumnDefinition, Crud, CrudPropsRef, FieldTypes, MultiSelectOptionsColumns } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

type ModelDefinition = {
    id: string,
    columns: Array<{
        field: string,
        fieldType: string,
    }>,
    hidden: Array<string>,
    softDelete: boolean
}

const getFieldType = (type: string): FieldTypes => {
    if (type === 'number') return FieldTypes.NUMBER
    if (type === 'datetime') return FieldTypes.DATE
    return FieldTypes.TEXT
}

export default () => {
    const crudRef = useRef<CrudPropsRef>(null);
    const [filters, setFilters] = useState("active");
    const [tableColumns, setTableColumns] = useState<Array<ColumnDefinition<any>>>([]);
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
                const { id, columns, hidden, softDelete } = response.data

                setPrimaryId(id)
                setIsSoftDelete(softDelete)

                // For a now ignore getFieldTypEError
                //@ts-ignore
                const newColumns = columns.map<ColumnDefinition<any>>((column) => {
                    return {
                        header: column.field,
                        accessorKey: column.field,
                        visible: hidden.findIndex(columnHidden => columnHidden === column.field) < 0,
                        fieldType: getFieldType(column.fieldType),
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

                setTableColumns(newColumns)
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
                columns={tableColumns}
                ref={crudRef}
            />
        </>
    );
}