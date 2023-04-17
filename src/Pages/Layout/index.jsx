import React from 'react'
import Menu from '../../Components/Menu'
import { Outlet } from 'react-router-dom'
import Footer from '../../Components/Footer'

export default function Layout() {
    return (
        <>
            <Menu />
            <Outlet/>
            <Footer />
        </>
    )
}
