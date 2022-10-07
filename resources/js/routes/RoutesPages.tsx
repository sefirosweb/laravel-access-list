import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

/* Pages */
import { APP_PREFIX } from "@/types/configurationType";
import NotFound from "@/pages/NotFound";
import Layout from '@/pages/layout/Layout';
import Users from '@/pages/Users';
import Roles from '@/pages/Roles';
import AccessList from '@/pages/AccessList';

function RoutesPages() {
    return (
        <Routes>
            <Route path={`${APP_PREFIX}/`} element={<Layout />}>
                <Route index element={<Navigate replace to={`view/users`} />} />
                <Route path={`view/users`} element={<Users />} />
                <Route path={`view/roles`} element={<Roles />} />
                <Route path={`view/access_list`} element={<AccessList />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default RoutesPages;


