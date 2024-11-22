import { Icon, LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";
import observationMarker from "~/assets/observation_pin.png";
import sightingBlackMarker from "~/assets/sighting_pin_black.png";
import sightingRedMarker from "~/assets/sighting_pin_red.png";
import sightingOrangeMarker from "~/assets/sighting_pin_orange.png";
import sightingYellowMarker from "~/assets/sighting_pin_yellow.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import defaultMarker from "leaflet/dist/images/marker-icon.png";

interface CustomMarkerProps {
  position: LatLngExpression;
  endangermentStatus?: string | null;
}

export default function CustomMarker({
  position,
  endangermentStatus = null,
}: CustomMarkerProps) {
  const determineMarker = () => {
    // Default to the observation marker if no endangerment status is provided
    if (!endangermentStatus) return observationMarker;

    // Return markers based on the endangerment status
    if (endangermentStatus.includes("MX.iucnCR")) return sightingBlackMarker;
    if (endangermentStatus.includes("MX.iucnEN")) return sightingRedMarker;
    if (endangermentStatus.includes("MX.iucnVU")) return sightingOrangeMarker;
    if (endangermentStatus.includes("MX.iucnNT")) return sightingYellowMarker;

    // Default to a Leaflet marker if the endangerment status is unrecognized
    return defaultMarker;
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
