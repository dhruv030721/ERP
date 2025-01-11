import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import App from './App'
import { Dashboard, Switchboard, Login, AddStudent, MarkAttendance, AttendanceReport, Subject, AddFaculty, GeneratePassword, AssignSubject, ManageTimetable, ForgotPassword,  } from './pages'
import { AuthProtected, ComingSoon } from './components'
import { Toaster } from 'react-hot-toast'
import store from './slices/store'
import { Provider } from 'react-redux'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<AuthProtected authentication><App /></AuthProtected>} />
      <Route path='/academics' element={<AuthProtected authentication><Switchboard /> </AuthProtected>}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='mark_attendance' element={<MarkAttendance />} />
        <Route path='add_student' element={<AddStudent />} />
        <Route path='add_faculty' element={<AddFaculty />} />
        <Route path='attendance_report' element={<AttendanceReport />} />
        <Route path='add_subject' element={<Subject />} />
        <Route path='assign_subject' element={<AssignSubject />} />
        <Route path='manage_timetable' element={<ManageTimetable />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/generate_password/:token' element={<GeneratePassword />} />
      <Route path='*' element={<ComingSoon />} />
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
