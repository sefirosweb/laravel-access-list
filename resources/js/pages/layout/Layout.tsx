import React from 'react'
import Navbar from '@/pages/layout/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="container">
                <>{<Outlet />}</>
            </div>
        </>
    );
}

