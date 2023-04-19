import React from 'react'
import Menu from './Menu'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import PageTransition from 'Components/PageTransition'

export default function Layout() {

    return (
        <>
            <Menu />

            <PageTransition>
                <Outlet />
            </PageTransition>

            <Footer />
        </>
    )
}
