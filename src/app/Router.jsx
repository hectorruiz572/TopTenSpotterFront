import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil";
import Layout from "../Layout/Layout";
import ErrorPage from "../pages/ErrorPage";
import Comunidad from "../pages/Comunidad";
import PlaceDetails from "../pages/PlaceDetails";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Eliminar PrivateRoute: cualquier usuario puede acceder a la ruta de perfil */}
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/:comunidad" element={<Comunidad />} />
          <Route path="/:comunidad/:placeName" element={<PlaceDetails />} />
          <Route path="/error" element={<ErrorPage />} /> {/* Ruta de error */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
