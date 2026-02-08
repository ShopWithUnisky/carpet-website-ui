import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const position: [number, number] = [latitude, longitude];

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
        <Marker position={position}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
