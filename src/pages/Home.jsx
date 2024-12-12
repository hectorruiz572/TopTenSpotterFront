import React, { useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geojsonData from "../assets/json/es.json";
import "./Home.css";
import "./Tittle.css";

const normalizeName = (name) => {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ñ/g, "n");
};

const Home = () => {
  const mapRef = useRef();
  const geojsonRef = useRef();
  const navigate = useNavigate();

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: false,
        direction: "center",
        className: "region-tooltip",
      });
    }

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#ffffff",
          dashArray: "",
          fillOpacity: 0.3,
          fillColor: "#ffffff",
        });
      },
      mouseout: (e) => {
        if (geojsonRef.current) {
          geojsonRef.current.resetStyle(e.target);
        }
      },
      click: () => {
        if (feature.properties && feature.properties.name) {
          const comunidad = normalizeName(feature.properties.name);
          navigate(`/${comunidad}`);
        }
      },
    });
  };

  const geojsonStyle = () => {
    return {
      fillColor: "transparent",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0,
    };
  };

  React.useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMaxBounds(mapRef.current.getBounds());
      mapRef.current.setMinZoom(mapRef.current.getZoom());
      mapRef.current.setMaxZoom(mapRef.current.getZoom());
    }
  }, []);

  return (
    <div className="home-container">
      <h1 className="comunidad-title">
        Mapa de Comunidades Autónomas de España
      </h1>
      <MapContainer
        bounds={L.latLngBounds(L.latLng(35.7, -9.3), L.latLng(43.8, 4.3))}
        style={{ height: "80vh", width: "100%" }}
        className="map-container"
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          noWrap={true}
        />
        <GeoJSON
          data={geojsonData}
          style={geojsonStyle}
          onEachFeature={onEachFeature}
          ref={geojsonRef}
        />
      </MapContainer>
    </div>
  );
};

export default Home;
