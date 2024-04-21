import React from 'react'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <div className='font-poppins'>
        <Header/> 
        <Outlet />
    </div>
  )
}

export default App
