import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon in bundler (webpack/vite) - Leaflet expects images at default path
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // India

type MapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
};

function MapClickHandler({
  latitude,
  longitude,
  onLocationChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });

  // When lat/lng change from outside, fly to the new position
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.flyTo([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map]);

  return null;
}

export function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  height = "280px",
}: MapPickerProps) {
  const position: [number, number] =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : DEFAULT_CENTER;
  const hasMarker = latitude != null && longitude != null;

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/30" style={{ height }}>
      <MapContainer
        center={position}
        zoom={hasMarker ? 15 : 5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
        />
        {hasMarker && (
          <Marker position={position}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
