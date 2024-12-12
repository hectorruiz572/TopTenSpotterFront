import { useEffect, useState } from "react";
import { getUserById, savePerfil } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // Estado para la imagen
  const navigate = useNavigate();

  // Cargar el token y userId desde localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      getUserById(userId, token)
        .then((response) => {
          setUserData(response);
          console.log(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    } else {
      console.log("No token or user id found");
    }
  }, [token, userId]);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      setProfileImage(file); // Almacenar el archivo en el estado
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto FormData para enviar el archivo junto con los demás datos
    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("age", userData.age);
    formData.append("location", userData.location);
    if (profileImage) {
      formData.append("photo", profileImage); // Añadir la imagen seleccionada
    }

    try {
      // Aquí debes actualizar el perfil con el FormData
      await savePerfil(formData, userId);
      navigate("/"); // Redirigir después de guardar
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar el perfil", error);
    }
  };

  return (
    <div className="perfil-container">
      <h3 className="perfil-title">Perfil</h3>
      <form className="perfil-form" onSubmit={handleSubmit}>
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

        <div className="perfil-input-group">
          <label className="perfil-label">Foto de Perfil</label>
          <input
            type="file"
            accept="image/*" // Limitar a imágenes
            onChange={handleFileChange} // Manejar el cambio de archivo
            className="perfil-file-input"
          />
        </div>

        {profileImage && (
          <div className="perfil-image-preview">
            <img
              src={URL.createObjectURL(profileImage)} // Mostrar vista previa de la imagen seleccionada
              alt="Vista previa de la foto de perfil"
              className="perfil-preview-image"
            />
          </div>
        )}

        <button type="submit" className="perfil-save-button">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default Perfil;
