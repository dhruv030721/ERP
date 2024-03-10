import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import { Dashboard, Admission, Switchboard, Login} from './pages/index.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='switchboard' element={<Switchboard />}></Route>
      <Route path='academics' element={<Layout />}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='admission' element={<Admission/>}/>
        <Route path='switchboard' element={<Switchboard/>} />
      </Route>,
      <Route path='' element={<Login/>}>
      </Route>,
    </Route> 
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
