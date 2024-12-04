import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaceByName } from "../services/api";
import "./PlaceDetails.css"; // Aquí puedes agregar tu archivo de estilo

const PlaceDetails = () => {
  const { placeName } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const fetchedPlace = await getPlaceByName(placeName);
        setPlace(fetchedPlace);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlace();
  }, [placeName]);

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
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
