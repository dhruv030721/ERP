import React from 'react'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <div className='font-poppins'>
      <Header />
      <Outlet />
    </div>
  )
}

export default App
