/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./StarRating.css"; // Asegúrate de incluir los estilos CSS

const StarRating = ({
  totalStars = 5,
  currentRating,
  disabled,
  onRatingSelect,
  isHoverEnabled = true, // Nueva propiedad para habilitar/deshabilitar hover
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating); // Inicializar con currentRating

  useEffect(() => {
    setSelectedRating(currentRating); // Actualiza selectedRating si currentRating cambia
  }, [currentRating]);

  const handleMouseEnter = (index) => {
    if (isHoverEnabled) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (isHoverEnabled) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    const rating = Math.round((index + 1) * 2) / 2; // Redondear a medio punto
    setSelectedRating(rating);
    if (onRatingSelect) {
      onRatingSelect(rating); // Llama al callback con la calificación seleccionada
    }
  };

  const ratingToUse = disabled ? currentRating : selectedRating || hoverRating;

  const getStarClass = (index) => {
    // Redondear la calificación para las estrellas
    const starIndex = index + 1;
    if (ratingToUse >= starIndex) {
      return "filled";
    }
    if (ratingToUse >= starIndex - 0.5) {
      return "half-filled"; // Media estrella
    }
    return "";
  };

  return (
    <div className="rating">
      {Array.from({ length: totalStars }, (_, index) => (
        <span
          key={index}
          className={`star ${getStarClass(index)}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => !disabled && handleClick(index)} // Solo permite hacer clic si no está deshabilitado
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
