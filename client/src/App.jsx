import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RegisterUser } from './components/RegisterUser'

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={ <RegisterUser/> }/>
      </Routes>
    </>
  )
}

export default App
