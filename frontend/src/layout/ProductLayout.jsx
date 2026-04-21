import React from 'react'
import { Outlet } from 'react-router'

import CatalogNavbar from '../features/products/UI/components/CatalogNavbar'


const ProductLayout = () => {
    return (
        <>
            <CatalogNavbar />
            <Outlet />
          
        </>
    )
}

export default ProductLayout