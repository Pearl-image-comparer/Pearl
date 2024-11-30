import { Icon, LatLng } from "leaflet";
import { Marker } from "react-leaflet";
import userMarker from "~/assets/user_marker.png";

interface UserMarkerProps {
  location: LatLng | null;
  handleClick: () => void;
}

export default function UserMarker({ location, handleClick }: UserMarkerProps) {
  if (!location) return null;

  return (
    <Marker
      eventHandlers={{ click: handleClick }}
      position={location}
      icon={
        new Icon({
          iconUrl: userMarker,
          iconSize: [35, 35],
          iconAnchor: [17.2, 17.2],
        })
      }
    />
  );
}
