import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import App from './app.jsx'
import { Dashboard, Admission, Switchboard, Login, AddStudent, MarkAttendance } from './pages/index.js'
import { AdminProtected } from './components/index.js'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<AdminProtected authentication><Switchboard /></AdminProtected>}></Route>
      <Route path='/academics' element={<AdminProtected authentication><App /></AdminProtected>}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='mark_attendance' element={<MarkAttendance />} />
        <Route path='add_student' element={<AddStudent />} />
      </Route>
      <Route path='/login' element={<Login />}>
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
)
