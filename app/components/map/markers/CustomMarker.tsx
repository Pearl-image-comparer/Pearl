import { Icon, LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";
import observationMarker from "~/assets/observation_pin.png";
import sightingBlackMarker from "~/assets/sighting_pin_black.png";
import sightingRedMarker from "~/assets/sighting_pin_red.png";
import sightingOrangeMarker from "~/assets/sighting_pin_orange.png";
import sightingYellowMarker from "~/assets/sighting_pin_yellow.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface CustomMarkerProps {
  position: LatLngExpression;
  variant?: "observation" | "black" | "red" | "orange" | "yellow";
}

export default function CustomMarker({
  position,
  variant = "observation",
}: CustomMarkerProps) {
  const determineMarker = () => {
    switch (variant) {
      case "black":
        return sightingBlackMarker;
      case "red":
        return sightingRedMarker;
      case "orange":
        return sightingOrangeMarker;
      case "yellow":
        return sightingYellowMarker;
      default:
        return observationMarker
    }
  };

  return (
    <Marker
      position={position}
      icon={
        new Icon({
          iconUrl: determineMarker(),
          iconSize: [41, 41],
          iconAnchor: [20.5, 41],
          shadowUrl: markerShadow,
          shadowRetinaUrl: markerShadow,
          shadowSize: [41, 41],
          shadowAnchor: [14, 41],
        })
      }
    />
  );
}
