/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

// PrivateRoute para manejar rutas protegidas
const PrivateRoute = ({ children }) => {
  // Verifica si el usuario está autenticado usando localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Verifica si el usuario está logueado

  if (!isLoggedIn) {
    // Si no está logueado, redirige a la página de error
    return <Navigate to="/error" />;
  }

  // Si está logueado, renderiza la ruta protegida
  return children;
};

export default PrivateRoute;
