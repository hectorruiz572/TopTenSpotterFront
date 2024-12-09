import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { getPlaceByName } from "../services/api";
import { setRatingPlace } from "../services/api";
import { getRatingByUserAndPlace } from "../services/api";
import { useUserContext } from "../providers/UserProvider"; // Importamos el contexto del usuario
import { usePopupContext } from "../providers/PopUpProvider"; // Importamos el contexto del popup
import { setCommentPlace } from "../services/api";
import { getCommentsByPlace } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./PlaceDetails.css"; // Aquí puedes agregar tu archivo de estilo

const PlaceDetails = () => {
  const { placeName } = useParams();
  const { user } = useUserContext(); // Usamos el objeto user para verificar si el usuario está logueado
  const { triggerPopup } = usePopupContext(); // Para activar el popup de login
  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentsPlace, setCommentsPlace] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const fetchedPlace = await getPlaceByName(placeName);
        setPlace(fetchedPlace);
        console.log(place);
        setCommentsPlace(await getCommentsByPlace(fetchedPlace.id));

        if (user) {
          const userRating = await getRatingByUserAndPlace(fetchedPlace.id);
          if (userRating) {
            setRating(userRating.rating);
          }
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlace();
  }, [placeName, user]); // Ahora depende de `user` también

  const handleRating = async (rating) => {
    if (!user) {
      triggerPopup("login");
      return;
    }

    await setRatingPlace(place.id, rating);
    setRating(rating);
  };

  const handleComment = async () => {
    if (!user) {
      triggerPopup("login");
      return;
    }

    if (comment.trim() === "") {
      alert("Por favor, ingresa un comentario.");
      return;
    }

    try {
      await setCommentPlace(place.id, userId, comment);
      setComment("");
      window.location.reload();
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  if (!place) {
    return <p>Cargando información...</p>;
  }

  // Aquí puedes dejar las coordenadas predeterminadas para probar el mapa
  const { latitude, longitude } = place; // Accedemos a place.latitude y place.longitude
  const mapCenter =
    latitude && longitude ? [latitude, longitude] : [51.505, -0.09]; // Coordenadas de Londres si no hay datos

  return (
    <div className="place-details-container">
      <div className="place-details-header">
        <h1 className="place-name">{place.name}</h1>
      </div>

      <div className="place-details-body">
        <div className="place-image-container">
          <img
            src={`http://localhost:8080/images/${place.imagePath}`}
            alt={place.name}
            className="place-image"
          />
        </div>

        <div className="place-description">
          <h2 className="place-description-title">Descripción</h2>
          <p>{place.description}</p>
          <StarRating
            totalStars={5}
            currentRating={rating}
            onRatingSelect={handleRating}
            isHoverEnabled={true}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Añadir comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleComment}>Enviar</button>

          <div className="place-comments">
            <h2 className="place-comments-title">Comentarios</h2>
            <ul>
              {commentsPlace.map((comment, index) => (
                <li key={index}>
                  <p>
                    <strong>{comment.user.username}</strong>: {comment.mensaje}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mapa - solo se renderiza si latitude y longitude están disponibles */}
        <div className="place-map-container">
          <MapContainer
            center={mapCenter} // Usamos las coordenadas predeterminadas si no hay latitud y longitud
            zoom={13} // Nivel de zoom predeterminado
            style={{ width: "100%", height: "400px", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL de los tiles
            />
            <Marker position={mapCenter}>
              {" "}
              {/* Posición del marcador */}
              <Popup>{place.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
