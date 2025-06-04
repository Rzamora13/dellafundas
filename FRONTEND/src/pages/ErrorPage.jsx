import React from "react";

const ErrorPage = () => {
  // Función que redirige al usuario a la página principal "/"
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    // Contenedor principal centrado vertical y horizontalmente con estilos de fondo y padding
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <button
          onClick={goHome}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
