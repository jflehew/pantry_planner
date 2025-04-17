import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RegisterUser } from './components/RegisterUser'
import { Dashboard } from './components/Dashboard'
import { LoginUser } from './components/LoginUser'
import {PrivateRoute} from './context/PrivateRoute'
import './App.css'
import { Header } from './components/Header'
import { PublicRoute } from './context/PublicRoute'


function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path='/register' element={ <RegisterUser/> }/>
          <Route path='/login' element={ <LoginUser/> }/>
        </Route>
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={ <Dashboard/> }/>
        </Route>
      </Routes>
    </>
  )
}

export default App
