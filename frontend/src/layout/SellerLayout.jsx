import React from 'react'
import { Outlet } from 'react-router'
import SellerNavbar from '../features/products/UI/components/SellerNavbar'
import SellerBottomNav from '../features/products/UI/components/SellerBottomNav'

const SellerLayout = () => {
    return (
        <>
            <SellerNavbar />
            <Outlet />
            <SellerBottomNav />
        </>
    )
}

export default SellerLayout