import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil";
import Layout from "../Layout/Layout";
import PrivateRoute from "../components/PrivateRoute"; // Importando el componente de ruta privada
import ErrorPage from "../pages/ErrorPage";
import Comunidad from "../pages/Comunidad";
import PlaceDetails from "../pages/PlaceDetails";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Ruta privada, que solo es accesible si el usuario está logueado */}
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          <Route path="/:comunidad" element={<Comunidad />} />
          <Route path="/:comunidad/:placeName" element={<PlaceDetails />} />

          {/* Ruta de error, si el usuario no está autenticado o hay un error */}
          <Route path="/error" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
