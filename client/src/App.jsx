import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RegisterUser } from './components/RegisterUser'
import { Dashboard } from './components/Dashboard'
import { LoginUser } from './components/LoginUser'
import {PrivateRoute} from './context/PrivateRoute'
import { AddProduct } from './components/AddProduct'
import './App.css'
import { Header } from './components/Header'
import { PublicRoute } from './context/PublicRoute'


function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>}/>
        <Route element={<PublicRoute/>}>
          <Route path='/register' element={ <RegisterUser/> }/>
          <Route path='/login' element={ <LoginUser/> }/>
        </Route>
        <Route element={<PrivateRoute/>}>
          <Route path='/product/add' element={ <AddProduct/> }/>
          <Route path='/dashboard' element={ <Dashboard/> }/>
          <Route path='/product/update/:productId' element={ <AddProduct/> }/>
        </Route>
      </Routes>
    </>
  )
}

export default App
