import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../features/auth/UI/components/Navbar'
import Footer from '../features/auth/UI/components/Navbar'

const AuthLayout = () => {
  return (
    <>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default AuthLayout