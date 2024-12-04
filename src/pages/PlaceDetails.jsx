import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { getPlaceByName } from "../services/api";
import { setRatingPlace } from "../services/api";
import { getRatingByUserAndPlace } from "../services/api";
import { useUserContext } from "../providers/UserProvider"; // Importamos el contexto del usuario
import { usePopupContext } from "../providers/PopUpProvider"; // Importamos el contexto del popup
import "./PlaceDetails.css"; // Aquí puedes agregar tu archivo de estilo

const PlaceDetails = () => {
  const { placeName } = useParams();
  const { user } = useUserContext(); // Usamos el objeto user para verificar si el usuario está logueado
  const { triggerPopup } = usePopupContext(); // Para activar el popup de login
  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const fetchedPlace = await getPlaceByName(placeName);
        setPlace(fetchedPlace);

        // Si el usuario está logueado, obtenemos su calificación para este lugar
        if (user) {
          const userRating = await getRatingByUserAndPlace(fetchedPlace.id);
          if (userRating) {
            console.log("Calificación del usuario:", userRating.rating); // Verificar si la calificación es la correcta
            setRating(userRating.rating); // Establecer la calificación obtenida
          }
        }

        console.log(fetchedPlace);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlace();
  }, [placeName, user]); // Ahora depende de `user` también

  const handleRating = async (rating) => {
    if (!user) {
      // Si no hay usuario logueado, muestra el popup
      triggerPopup("login");
      return;
    }

    console.log(`El usuario seleccionó ${rating} estrellas`);
    await setRatingPlace(place.id, rating); // Establecer la calificación del lugar en la base de datos
    setRating(rating); // Actualizar el estado con la nueva calificación
  };

  if (!place) {
    return <p>Cargando información...</p>;
  }

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
            isHoverEnabled={true} // Habilitar hover
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
