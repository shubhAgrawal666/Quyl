import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './Index.js';
export default function Layout() {
    return(
        <div className='min-h-screen bg-gradient-to-b from-blue-200 via-purple-400 to-purple-300'>
        <Header />
        <Outlet />
        <Footer />
    </div>
    )
}