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
              src={place.imagePath}
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
        <div className="comment-header">
          <h2 className="comment-main-title">DÉJANOS SABER TU OPINIÓN </h2>
          <p className="comment-description">
            <i>Tu opinión ayuda a mejorar nuestra plataforma.</i>
          </p>
          <p className="comment-description">
            <i>Comparta su experiencia y ayude a otros viajeros!!</i>
          </p>
        </div>
        <input
          type="text"
          placeholder="Escriba su opinión aquí..."
          value={comment}
          style={{ marginLeft: "290px" }}
          onChange={(e) => setComment(e.target.value)}
          className="comment-input"
        />
        <button
          className="submit-button"
          style={{ marginLeft: "520px", marginRight: "520px" }}
          onClick={handleComment}
        >
          Enviar
        </button>
        {/* Lista de comentarios */}
        <div className="place-comments">
          <h2 className="place-comments-title" style={{ marginLeft: "30px" }}>
            COMENTARIOS:
          </h2>
          <ul className="comments-list">
            {commentsPlace.map((comment, index) => (
              <li
                key={index}
                className="comment-item"
                style={{ marginLeft: "12px", marginRight: "16px" }}
              >
                <p>
                  <i>
                    <strong>{comment.user.username}</strong>: {comment.mensaje}
                  </i>
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
