/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Verifica si el usuario está logueado

  if (!isLoggedIn) {
    return <Navigate to="/error" />; // Si no está logueado, redirige a la página de error
  }

  return children; // Si está logueado, renderiza la ruta protegida
};

export default PrivateRoute;
