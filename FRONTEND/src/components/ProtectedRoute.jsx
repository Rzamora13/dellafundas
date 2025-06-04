import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/path";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, } = useAuth();



  // Si no hay usuario logueado (no sesión), redirige a la página de login
  // Además pasa un estado con mensaje de error para mostrar aviso al usuario
  if (!user) {
    return <Navigate to={ROUTES.HOME} state={{ error: "Debes iniciar sesión para acceder." }} replace />;
  }

  // Si el usuario no tiene ninguno de los roles permitidos, se deniega el acceso
  // Redirige a la página principal con mensaje de acceso denegado
  if (!allowedRoles.some(role => user.roles.includes(role))) {
    return <Navigate to={ROUTES.HOME} state={{ error: "Acceso denegado. No tienes permisos para ver esta página." }} replace />;
  }

  // Si el usuario está autorizado, renderiza las rutas hijas definidas (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
