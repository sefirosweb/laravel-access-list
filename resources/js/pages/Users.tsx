import React, { useEffect, useRef, useState } from 'react'
import { Crud, CrudPropsRef, useGetQueryClient } from '@sefirosweb/react-crud'
import { APP_URL } from '@/types/configurationType';
import { Col, Form, Row } from 'react-bootstrap';
import { useGetUserColumns } from '@/hooks/useGetUserColumns';

export const Users = () => {
    const crudRef = useRef<CrudPropsRef>(null);
    const [filters, setFilters] = useState("active");
    const [primaryId, tableColumns, isSoftDelete] = useGetUserColumns();
    const queryClient = useGetQueryClient();

    useEffect(() => {
        crudRef.current.setLazyilters({ status: filters });
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
                handleSuccess={() => {
                    queryClient.removeQueries({
                        queryKey: [`${APP_URL}/role/users/get_array`]
                    })
                }}
            />
        </>
    );
}