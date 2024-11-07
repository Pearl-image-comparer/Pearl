import { LatLngExpression } from "leaflet";
import { LayersControl } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";

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
      <MarkerClusterGroup>
        {species.map((s, index) => (
          <CustomMarker key={index} position={s} />
        ))}
      </MarkerClusterGroup>
    </LayersControl.Overlay>
  );
}
