import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
// import './index.css'
import './main.css'
import Navbar from './Navbar'

import RouteElems from './RouteElems.jsx'
import { AuthContext } from './js/Contexts.js'
import AuthProvider from './AuthProvider.jsx'
import { useState } from 'react'
import React from 'react'

const Main = () => {
  return (
    <>
      
    </>
  )
}




createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      
      <RouteElems/>
    </BrowserRouter>
    </AuthProvider>
  // </StrictMode>,
)
