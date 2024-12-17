import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  getAutonomyByName,
  getPlacesByAutonomyAndCategory,
} from "../services/api";
import StarRating from "../components/StarRating";
import "./Comunidad.css";

const CATEGORIES = [
  "Comida",
  "Restaurantes",
  "Sitio Histórico",
  "Naturaleza y Aire Libre",
  "Vida Nocturna y Entretenimiento",
  "Hoteles",
  "Mercados y Compras",
];

const DEFAULT_COORDINATES = {
  latitude: 40.4168,
  longitude: -3.7034,
};

const normalizeName = (name) => {
  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const Comunidad = () => {
  const { comunidad } = useParams();
  const navigate = useNavigate();
  const [comunidadData, setComunidadData] = useState({});
  const [selectedButton, setSelectedButton] = useState("Comida");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!comunidad) {
      console.error("El parámetro 'comunidad' no está presente en la URL.");
      return;
    }

    const fetchData = async () => {
      try {
        const normalizedComunidad = normalizeName(comunidad);
        const data = await getAutonomyByName(normalizedComunidad);
        if (data) {
          setComunidadData(data);
        } else {
          console.error("No se encontró la comunidad autónoma.");
        }
      } catch (error) {
        console.error("Error fetching autonomy data:", error);
      }
    };

    fetchData();
  }, [comunidad]);

  useEffect(() => {
    if (!comunidadData.id) return;

    const fetchPlaces = async () => {
      try {
        const placesData = await getPlacesByAutonomyAndCategory(
          comunidadData.id,
          selectedButton
        );
        setPlaces(placesData || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, [comunidadData.id, selectedButton]);

  const handlePlaceClick = (place) => {
    navigate(`/${normalizeName(comunidadData.name)}/${place.placeName}`);
  };

  const renderPlaceCards = () => {
    if (!places.length) {
      return (
        <p className="no-places">
          No hay lugares disponibles para esta categoría.
        </p>
      );
    }

    return places.map((place, index) => (
      <div
        key={index}
        className="place-card"
        onClick={() => handlePlaceClick(place)}
      >
        <img
          src={place.imagePath}
          alt={place.placeName}
          className="place-image"
        />
        <div className="place-content">
          <h3 className="place-name">{place.placeName}</h3>
          <p className="place-description">{place.description}</p>
          <StarRating
            totalStars={5}
            currentRating={place.averageRating}
            isHoverEnabled={true}
          />
        </div>
      </div>
    ));
  };

  const renderMap = () => {
    if (!places.length || selectedButton === "Comida") return null;

    return (
      <div
        className="place-map-container"
        style={{ height: "400px", width: "100%" }}
      >
        <MapContainer
          center={[
            comunidadData.latitude || DEFAULT_COORDINATES.latitude,
            comunidadData.longitude || DEFAULT_COORDINATES.longitude,
          ]}
          zoom={7}
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {places.map((place, index) => {
            if (!place.latitude || !place.longitude) return null;

            return (
              <Marker key={index} position={[place.latitude, place.longitude]}>
                <Popup>
                  <div className="map-marker-popup">
                    <div>
                      <strong>{place.placeName}</strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  };

  return (
    <div className="comunidad-container">
      <h1 className="comunidad-title">{comunidadData.name}</h1>

      <nav className="comunidad-nav">
        {CATEGORIES.map((buttonName) => (
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

      <div className="places-grid">{renderPlaceCards()}</div>

      {renderMap()}
    </div>
  );
};

export default Comunidad;
