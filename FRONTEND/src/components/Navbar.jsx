import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/path";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify"; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isUser = user?.roles?.includes("ROLE_USER");

  // Estado para controlar si el dropdown del usuario está abierto o cerrado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Función para alternar el dropdown del usuario (abrir/cerrar)
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  // Función para alternar el menú móvil (abrir/cerrar)
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Cierra el dropdown cuando se hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    // Añade el event listener al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    // Limpia el event listener al desmontar el componente
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función que maneja el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      toast.info("👋 Has cerrado sesión.");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error("❌ Error al cerrar sesión.", error);
    } finally {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Clases comunes para los enlaces del menú en desktop
  const LinkClasses =
    "hidden md:inline-block font-bold px-6 py-2 border-2 border-black rounded-full bg-[#FF4F78] hover:bg-[#D6406D] text-white";

  // Clases comunes para los enlaces del menú en móvil
  const LinkClassesMobile =
    "md:hidden block w-full text-left px-4 py-3 text-white bg-[#FF4F78] border-b border-pink-200";

  return (
    <nav className="bg-[#FF7BAB] px-4 py-4 md:px-6">
      <div className="flex justify-between items-center">
        {/* Logo de la página */}
        <span className="font-bold text-white text-xl">DELLAFUNDAS</span>

        {/* Botón hamburguesa para menú móvil */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              // Icono "X" para cerrar menú móvil abierto
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Icono hamburguesa para abrir menú móvil cerrado
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menú de navegación para escritorio */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink to={ROUTES.HOME} className={LinkClasses}>
            HOME
          </NavLink>
          <NavLink to={ROUTES.PRODUCTS} className={LinkClasses}>
            PRODUCTS
          </NavLink>

          {!user ? (
            // Si no hay usuario logueado, mostrar enlaces para login y registro
            <>
              <NavLink to={ROUTES.LOGIN} className={LinkClasses}>
                SIGN IN
              </NavLink>
              <NavLink to={ROUTES.REGISTER} className={LinkClasses}>
                REGISTER
              </NavLink>
            </>
          ) : (
            // Si hay usuario logueado mostrar opciones según rol
            <>
              {isAdmin && (
                <NavLink to={ROUTES.FILTERS} className={LinkClasses}>
                  FILTERS
                </NavLink>
              )}
              {isUser && !isAdmin && (
                <NavLink to={ROUTES.CART} className={LinkClasses}>
                  CART
                </NavLink>
              )}
              {/* Dropdown con opciones del usuario */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="font-bold px-6 py-2 border-2 border-black rounded-full bg-[#FF4F78] text-white flex items-center gap-2"
                >
                  {/* Mostrar parte del email o "Usuario" */}
                  {user?.email ? user.email.split("@")[0] : "Usuario"} ▼
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <NavLink
                      to={ROUTES.PROFILE}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {/* Cambia texto según si es admin o no */}
                      {!isAdmin ? "Mi Perfil" : "Gestion de Usuarios"}
                    </NavLink>
                    <NavLink
                      to={ROUTES.ORDERS}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {!isAdmin ? "Mis Pedidos" : "Pedidos de Usuarios"}
                    </NavLink>
                    {/* Botón para cerrar sesión */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="flex flex-col mt-4 rounded-lg overflow-hidden shadow-md bg-[#FF7BAB]">
          <NavLink to={ROUTES.HOME} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
            HOME
          </NavLink>
          <NavLink to={ROUTES.PRODUCTS} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
            PRODUCTS
          </NavLink>

          {!user ? (
            <>
              <NavLink to={ROUTES.LOGIN} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
                SIGN IN
              </NavLink>
              <NavLink to={ROUTES.REGISTER} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
                REGISTER
              </NavLink>
            </>
          ) : (
            <>
              {isAdmin && (
                <NavLink to={ROUTES.FILTERS} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
                  FILTERS
                </NavLink>
              )}
              {isUser && !isAdmin && (
                <NavLink to={ROUTES.CART} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
                  CART
                </NavLink>
              )}
              <NavLink to={ROUTES.PROFILE} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
                {!isAdmin ? "MI PERFIL" : "GESTIÓN DE USUARIOS"}
              </NavLink>
              <NavLink to={ROUTES.ORDERS} className={LinkClassesMobile} onClick={() => setIsMobileMenuOpen(false)}>
                {!isAdmin ? "MIS PEDIDOS" : "PEDIDOS DE USUARIOS"}
              </NavLink>
              {/* Botón cerrar sesión en menú móvil */}
              <button
                onClick={handleLogout}
                className="md:hidden block w-full text-left px-4 py-3 text-white bg-[#FF4F78] hover:bg-[#D6406D] border-b border-pink-200"
              >
                CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
