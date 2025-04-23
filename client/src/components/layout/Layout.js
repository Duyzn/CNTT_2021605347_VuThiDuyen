import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SearchArea from '../common/SearchArea';

function Layout() {
    return (
        <div className="content-wrapper">
            <Header />
            <SearchArea />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;