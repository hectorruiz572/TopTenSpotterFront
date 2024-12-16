import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import {
  getPlaceByName,
  setRatingPlace,
  getRatingByUserAndPlace,
  setCommentPlace,
  getCommentsByPlace,
  deleteComment,
} from "../services/api";
import { useUserContext } from "../providers/UserProvider";
import { usePopupContext } from "../providers/PopUpProvider";
import perfil from "../assets/perfil.png";
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
      setCommentsPlace(await getCommentsByPlace(place.id)); // Actualiza comentarios
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      triggerPopup("login");
      return;
    }

    try {
      await deleteComment(commentId);
      setCommentsPlace((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      ); // Actualiza la lista de comentarios sin recargar
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
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
                style={{
                  marginLeft: "12px",
                  marginRight: "16px",
                  position: "relative",
                }}
              >
                {comment.user.id == userId && (
                  <span
                    className="delete-cross"
                    onClick={() => handleDeleteComment(comment.id)}
                    title="Eliminar comentario"
                  >
                    ×
                  </span>
                )}
                <p>
                  <i>{comment.mensaje}</i>
                </p>
                {/* Mostrar foto de perfil y nombre del usuario */}
                <div className="comment-user-info">
                  <img
                    src={
                      comment.user.photo
                        ? `http://localhost:8080/profileimg/${comment.user.photo}`
                        : perfil
                    }
                    alt={comment.user.username}
                    className="comment-user-photo"
                  />
                  <strong>{comment.user.username}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default PlaceDetails;
