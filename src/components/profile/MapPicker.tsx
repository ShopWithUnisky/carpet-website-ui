import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Use a simple div icon so we don't depend on external image URLs (avoids 404/hydration issues)
const markerIcon = L.divIcon({
  className: "leaflet-marker-pin",
  html: `<span style="
    display: block;
    width: 24px;
    height: 24px;
    margin-left: -12px;
    margin-top: -24px;
    background: #0ea5e9;
    border: 2px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  "></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const position: [number, number] =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : DEFAULT_CENTER;
  const hasMarker = latitude != null && longitude != null;
  const zoom = hasMarker ? (flyToZoom ?? 15) : 5;

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg border bg-muted/30 text-sm text-muted-foreground"
        style={{ height }}
      >
        Loading map…
      </div>
    );
  }

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
          <Marker position={position} icon={markerIcon}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export { STREET_ZOOM };
