import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { Providers } from './context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <Providers>
        <ToastContainer position="top-right" autoClose={3000} />
        <RouterProvider router={router} />
      </Providers>
    </>
  )
}

export default App
