import React from 'react';
import {Outlet} from 'react-router-dom';
import {Header,Footer} from './Index.js';
export default function Layout(){
    return(
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}