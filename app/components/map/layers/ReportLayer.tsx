import { Icon, LatLngExpression } from "leaflet";
import { LayerGroup, LayersControl, Marker } from "react-leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

export default function ReportLayer() {
  // Note: Temporary hardcoded list of species locations
  const reports: LatLngExpression[] = [
    [61.5004, 23.8214],
    [61.4482, 23.857],
    [61.5, 23.7641],
    [61.4971, 23.756],
    [61.4973, 23.7569],
  ];

  return (
    <LayersControl.Overlay name="Reports layer">
      <LayerGroup>
        {reports.map((r, index) => (
          <Marker
            key={index}
            position={r}
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
        ))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
