// ✅ MapComponent.js (fixed)
import React, { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 8.7139, // Tirunelveli default
  lng: 77.7567,
};

export default function MapComponent({ formData, setFormData }) {
  const [position, setPosition] = useState({
    lat: formData.latitude || defaultCenter.lat,
    lng: formData.longitude || defaultCenter.lng,
  });

  const GOOGLE_MAPS_API_KEY = "AIzaSyBRe6Z60Br7Q-VbSRrnMqB1ymz531yIl2E";

  const handleMapClick = useCallback(
    async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setPosition({ lat, lng });
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const addressComponents = result.address_components;

          let street = "";
          let town = "";
          let pincode = "";

          addressComponents.forEach((comp) => {
            if (comp.types.includes("route")) street = comp.long_name;
            if (comp.types.includes("locality")) town = comp.long_name;
            if (comp.types.includes("postal_code")) pincode = comp.long_name;
          });

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            street,
            town, // ✅ now matches RegisterComplaint
            pincode,
          }));

          console.log("📍 Selected:", { street, town, pincode });
        } else {
          console.warn("No address found for this location.");
        }
      } catch (err) {
        console.error("Reverse Geocoding failed:", err);
      }
    },
    [setFormData]
  );

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        onClick={handleMapClick}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
}
