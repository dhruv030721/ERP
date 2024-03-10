import React from 'react'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
        <Header dropdown={true}/> 
        <Outlet />
    </>
  )
}

export default Layout
