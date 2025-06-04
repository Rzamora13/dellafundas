import React, { useEffect } from "react";

const Modal = ({ title, isOpen, onClose, children }) => {
  // Maneja eventos de teclado cuando el modal está abierto
  useEffect(() => {
    // Función que se ejecuta al presionar una tecla
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 p-4">
      
      {/* Contenedor del modal */}
      <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl relative">
        
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Cerrar modal"
        >
          ✖
        </button>

        {/* Título del modal */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        {/* Contenido que se pasa como children al modal */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
