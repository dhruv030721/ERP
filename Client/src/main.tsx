import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import App from './App'
import { Dashboard, Switchboard, Login, AddStudent, MarkAttendance, AttendanceReport, Subject } from './pages'
import { AdminProtected } from './components'
import { Toaster } from 'react-hot-toast'
import store from './slices/store'
import { Provider } from 'react-redux'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<AdminProtected authentication><Switchboard /></AdminProtected>} />
      <Route path='/academics' element={<AdminProtected authentication><App /> </AdminProtected>}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='mark_attendance' element={<MarkAttendance />} />
        <Route path='add_student' element={<AddStudent />} />
        <Route path='attendance_report' element={<AttendanceReport />} />
        <Route path='add_subject' element={<Subject />} />
      </Route>
      <Route path='/login' element={<Login />} />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </React.StrictMode>,
)
