import React from 'react'
import Menu from './Menu'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
    return (
        <>
            <Menu />
            <Outlet/>
            <Footer />
        </>
    )
}
