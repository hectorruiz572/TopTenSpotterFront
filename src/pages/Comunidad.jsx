import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAutonomyByName,
  getPlacesByAutonomyAndCategory,
} from "../services/api";
import "./Comunidad.css";
import StarRating from "../components/StarRating"; // Asegúrate de que este componente exista
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const normalizeName = (name) => {
  return name
    .replace(/-/g, " ") // Reemplazar guiones por espacios
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar la primera letra de cada palabra
};

const Comunidad = () => {
  const { comunidad } = useParams();
  const [comunidadData, setComunidadData] = useState({});
  const [selectedButton, setSelectedButton] = useState("Comida");
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!comunidad) {
      console.error("El parámetro 'comunidad' no está presente en la URL.");
      return;
    }

    const fetchData = async () => {
      const normalizedComunidad = normalizeName(comunidad);
      const data = await getAutonomyByName(normalizedComunidad);
      if (data) {
        setComunidadData(data);
      } else {
        console.error("No se encontró la comunidad autónoma.");
      }
    };
    fetchData();
  }, [comunidad]);

  useEffect(() => {
    if (comunidadData && comunidadData.id) {
      const fetchPlaces = async () => {
        const placesData = await getPlacesByAutonomyAndCategory(
          comunidadData.id,
          selectedButton
        );
        setPlaces(placesData || []);
        console.log(placesData);
      };
      fetchPlaces();
    }
  }, [comunidadData, selectedButton]);

  const handlePlaceClick = (place) => {
    navigate(`/${normalizeName(comunidadData.name)}/${place.placeName}`);
  };

  const categories = [
    "Comida",
    "Restaurantes",
    "Sitio Histórico",
    "Naturaleza y Aire Libre",
    "Vida Nocturna y Entretenimiento",
    "Hoteles",
    "Mercados y Compras",
  ];

  return (
    <div className="comunidad-container">
      <h1 className="comunidad-title">{comunidadData.name}</h1>
      <nav className="comunidad-nav">
        {categories.map((buttonName) => (
          <button
            key={buttonName}
            className={`comunidad-btn ${
              selectedButton === buttonName ? "active" : ""
            }`}
            onClick={() => setSelectedButton(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </nav>

      <div className="places-grid">
        {places && places.length > 0 ? (
          places.map((place, index) => (
            <div
              key={index}
              className="place-card"
              onClick={() => handlePlaceClick(place)}
            >
              <img
                src={`http://localhost:8080/images/${place.imagePath}`}
                alt={place.placeName}
                className="place-image"
              />
              <div className="place-content">
                <h3 className="place-name">{place.placeName}</h3>
                <p className="place-description">{place.description}</p>
                <StarRating
                  totalStars={5}
                  currentRating={place.averageRating}
                  isHoverEnabled={true} // Habilitar hover
                />
              </div>
            </div>
          ))
        ) : (
          <p className="no-places">
            No hay lugares disponibles para esta categoría.
          </p>
        )}
      </div>

      {/* Condición para no mostrar el mapa si la categoría es "Comida" */}
      {places.length > 0 && selectedButton !== "Comida" && (
        <div
          className="place-map-container"
          style={{ height: "400px", width: "100%" }}
        >
          <MapContainer
            center={[
              comunidadData.latitude || 40.4168,
              comunidadData.longitude || -3.7034,
            ]} // Coordenadas predeterminadas
            zoom={7}
            style={{ width: "100%", height: "100%", borderRadius: "8px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {places.map((place, index) =>
              place.latitude && place.longitude ? (
                <Marker
                  key={index}
                  position={[place.latitude, place.longitude]}
                >
                  <Popup>{place.placeName}</Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Comunidad;
