import { Icon, LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

interface CustomMarkerProps {
  position: LatLngExpression;
}

// TODO: Render different markers based on props
export default function CustomMarker({ position }: CustomMarkerProps) {
  return (
    <Marker
      position={position}
      icon={
        new Icon({
          iconUrl: markerIcon,
          iconRetinaUrl: markerIcon2x,
          iconSize: [25, 41],
          iconAnchor: [12.5, 41],
          shadowUrl: markerShadow,
          shadowRetinaUrl: markerShadow,
          shadowSize: [41, 41],
          shadowAnchor: [12.5, 41],
        })
      }
    />
  );
}
