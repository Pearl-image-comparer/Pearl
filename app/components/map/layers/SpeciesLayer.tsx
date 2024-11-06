import { Icon, LatLngExpression } from "leaflet";
import { LayerGroup, LayersControl, Marker } from "react-leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

export default function SpeciesLayer() {
  // Note: Temporary hardcoded list of species locations
  const species: LatLngExpression[] = [
    [61.4978, 23.7602],
    [61.493, 23.779],
    [61.5084, 23.7385],
    [61.5101, 23.7365],
    [61.4946, 23.7416],
  ];

  return (
    <LayersControl.Overlay name="Species layer">
      <LayerGroup>
        {species.map((s, index) => (
          <Marker
            key={index}
            position={s}
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
