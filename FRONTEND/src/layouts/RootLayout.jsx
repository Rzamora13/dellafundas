import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Componente RoutLayout que actúa como layout general para rutas protegidas o públicas
const RoutLayout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-[#EBBDCA]'>
        {/* Encabezado de la página, normalmente contiene navegación */}
        <Navbar />
        {/* Área principal donde se renderizarán las rutas hijas */}
        <main className='flex-grow flex justify-center items-center'>
          {/* Outlet es el espacio reservado para las rutas hijas definidas con react-router */}
          <Outlet />
        </main>
        {/* Pie de página */}
        <Footer />
    </div>
  )
}

export default RoutLayout
