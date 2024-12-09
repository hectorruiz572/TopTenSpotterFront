import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { getPlaceByName } from "../services/api";
import { setRatingPlace } from "../services/api";
import { getRatingByUserAndPlace } from "../services/api";
import { useUserContext } from "../providers/UserProvider";
import { usePopupContext } from "../providers/PopUpProvider";
import { setCommentPlace } from "../services/api";
import { getCommentsByPlace } from "../services/api";
import "./PlaceDetails.css"; // Aquí puedes agregar tu archivo de estilo

const PlaceDetails = () => {
  const { placeName } = useParams();
  const { user } = useUserContext();
  const { triggerPopup } = usePopupContext();
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
  }, [placeName, user]);

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

  return (
    <div className="place-details-container">
      <div className="place-details-header">
        <h1 className="place-name">{place.name}</h1>
      </div>

      <div className="place-details-body">
        <div className="place-media-container">
          <div className="place-image-container">
            <img
              src={`http://localhost:8080/images/${place.imagePath}`}
              alt={place.name}
              className="place-image"
            />
          </div>
        </div>

        {/* Descripción */}
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

        {/* Formulario de comentarios */}
        <div className="comment-section">
          <input
            type="text"
            placeholder="Añadir comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
          />
          <button className="submit-button" onClick={handleComment}>
            Enviar
          </button>
        </div>

        {/* Lista de comentarios */}
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
    </div>
  );
};

export default PlaceDetails;
