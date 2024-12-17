import { useEffect, useRef, useState } from "react";
import { getUserById, savePerfil } from "../services/api";
import "./Perfil.css";
import iconoPerfil from "../assets/iconoPerfil.png";
import Swal from "sweetalert2";

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fileInputRef = useRef(null); // Referencia para el input de tipo file

  useEffect(() => {
    if (token && userId) {
      getUserById(userId, token)
        .then((response) => {
          setUserData(response);
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, [token, userId]);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file); // Guarda el archivo en el estado
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // Simula un clic en el input oculto
  };

  const handleRemoveImage = () => {
    setProfileImage(null); // Elimina la imagen seleccionada localmente
    setUserData({ ...userData, photo: null }); // Opcional: también limpia en los datos de usuario
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("age", userData.age);
    formData.append("location", userData.location);
    if (profileImage) {
      formData.append("photo", profileImage);
    }

    try {
      await savePerfil(formData, userId);
      Swal.fire({
        title: "¡Éxito!",
        text: "Perfil guardado correctamente",
        icon: "success",
        confirmButtonColor: "#4caf50",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al guardar el perfil", error);
    }
  };

  return (
    <div className="perfil-container">
      <h3 className="perfil-title">Perfil</h3>

      <div className="perfil-image-wrapper">
        {/* Imagen de perfil */}
        <img
          src={
            profileImage
              ? URL.createObjectURL(profileImage) // Vista previa
              : userData.photo
              ? `https://toptenspotterbackend.onrender.com/uploads/profileimg/${userData.photo}`
              : iconoPerfil // Imagen por defecto
          }
          alt="Foto de perfil"
          className="perfil-image"
          onClick={handleImageClick} // Click para cambiar imagen
        />

        {/* Botón con cruz para eliminar */}
        {(profileImage || userData.photo) && (
          <button
            type="button"
            className="perfil-remove-cross"
            onClick={handleRemoveImage}
          >
            &times;
          </button>
        )}
      </div>

      {/* Input file oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

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

        <button type="submit" className="perfil-save-button">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default Perfil;
