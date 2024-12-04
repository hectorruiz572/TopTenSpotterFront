import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil";
import Layout from "../Layout/Layout";
import PrivateRoute from "../components/PrivateRoute";
import ErrorPage from "../pages/ErrorPage";
import Comunidad from "../pages/Comunidad";
import PlaceDetails from "../pages/PlaceDetails";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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
          <Route path="/error" element={<ErrorPage />} /> {/* Ruta de error */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
