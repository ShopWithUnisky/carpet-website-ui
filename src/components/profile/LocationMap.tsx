import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

type LocationMapProps = {
  latitude: number;
  longitude: number;
  label?: string;
  className?: string;
  height?: string;
};

export function LocationMap({
  latitude,
  longitude,
  label,
  className,
  height = "160px",
}: LocationMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const position: [number, number] = [latitude, longitude];

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 text-sm text-muted-foreground ${className ?? ""}`}
        style={{ height }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-border bg-muted/20 ${className ?? ""}`}
      style={{ height }}
    >
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full"
        zoomControl={true}
        dragging={true}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
