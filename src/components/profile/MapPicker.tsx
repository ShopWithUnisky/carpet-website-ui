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

/** Street-level zoom (e.g. after "Use current location"). */
const STREET_ZOOM = 17;

type MapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
  /** When set, fly to position with this zoom (e.g. 17 for street level). */
  flyToZoom?: number | null;
};

function MapClickHandler({
  latitude,
  longitude,
  onLocationChange,
  flyToZoom,
}: {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  flyToZoom?: number | null;
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });

  // When lat/lng change from outside, fly to the new position (use flyToZoom for street-level)
  useEffect(() => {
    if (latitude != null && longitude != null) {
      const zoom = flyToZoom ?? map.getZoom();
      map.flyTo([latitude, longitude], zoom);
    }
  }, [latitude, longitude, flyToZoom, map]);

  return null;
}

export function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  height = "280px",
  flyToZoom = null,
}: MapPickerProps) {
  const position: [number, number] =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : DEFAULT_CENTER;
  const hasMarker = latitude != null && longitude != null;
  const zoom = hasMarker ? (flyToZoom ?? 15) : 5;

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/30" style={{ height }}>
      <MapContainer
        center={position}
        zoom={zoom}
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
          flyToZoom={flyToZoom}
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

export { STREET_ZOOM };
