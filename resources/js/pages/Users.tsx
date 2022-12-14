import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ColumnDefinition, Crud, CrudPropsRef, FieldTypes, MultiSelectOptionsColumns } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

export default () => {
    const crudRef = useRef<CrudPropsRef>(null);
    const [filters, setFilters] = useState("active");

    useEffect(() => {
        // crudRef.current.setLazyilters({ status: filters });
        axios.get(`${APP_URL}/get_user_fillable_data`)
    }, [filters])


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

    const columns: Array<ColumnDefinition<User>> = [
        {
            accessorKey: 'id',
            header: '#',
            enableSorting: true,
            visible: true
        },
        {
            accessorKey: 'name',
            header: 'Name',
            titleOnCRUD: 'Name',
            editable: true,
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            titleOnCRUD: 'Email',
            header: 'Email',
            editable: true,
            enableSorting: true,
        },
        {
            accessorKey: 'deleted_at',
            titleOnCRUD: 'Deleted At',
            header: 'Deleted At',
            editable: false,
            enableSorting: true,
        },
        {
            id: 'roles',
            titleOnCRUD: 'Roles',
            header: 'Roles',
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectRole
        },
        {
            accessorKey: 'password',
            titleOnCRUD: 'Password',
            header: 'Password',
            visible: false,
            editable: true,
            fieldType: FieldTypes.PASSWORD
        },
    ]

    const customFilters = (
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
            {customFilters}
            <Crud
                canDelete
                canEdit
                canRefresh
                enableGlobalFilter
                createButtonTitle="Create User"
                crudUrl={`${APP_URL}/users`}
                primaryKey="id"
                titleOnDelete="email"
                columns={columns}
            // ref={crudRef}
            />
        </>
    );
}