import { useEffect, useState } from "react";
import { getUserById } from "../services/api";
import "./Perfil.css";
import { savePerfil } from "../services/api";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  // Cargar el token y userId desde localStorage
  const token = localStorage.getItem("token"); // Suponiendo que guardaste el token aquí.
  const userId = localStorage.getItem("userId"); // Suponiendo que guardaste el id del usuario aquí.

  useEffect(() => {
    if (token && userId) {
      // Pasar el token en la cabecera de la solicitud
      getUserById(userId, token)
        .then((response) => {
          setUserData(response);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    } else {
      console.log("No token or user id found");
    }
  }, [token, userId]); // Dependencias ahora son token y userId

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  return (
    <div className="perfil-container">
      <h3 className="perfil-title">Perfil</h3>
      <form className="perfil-form">
        <div className="perfil-input-group">
          <label className="perfil-label">Usuario</label>
          <label className="perfil-input">{userData.username}</label>
        </div>

        <div className="perfil-input-group">
          <label className="perfil-label">Nombre</label>
          <input
            type="text"
            className="perfil-input"
            placeholder="Nombre"
            value={userData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>

        <div className="perfil-input-group">
          <label className="perfil-label">Apellido</label>
          <input
            type="text"
            className="perfil-input"
            placeholder="Apellido"
            value={userData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>

        <div className="perfil-input-group">
          <label className="perfil-label">Edad</label>
          <input
            type="number"
            className="perfil-input"
            placeholder="Edad"
            value={userData.age || ""}
            onChange={(e) => handleInputChange("age", e.target.value)}
          />
        </div>

        <div className="perfil-input-group">
          <label className="perfil-label">Localidad</label>
          <input
            type="text"
            className="perfil-input"
            placeholder="Localidad"
            value={userData.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />
        </div>

        <button
          type="button"
          className="perfil-save-button"
          onClick={() => savePerfil(userData).then(() => navigate("/"))}
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default Perfil;
