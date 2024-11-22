import { LayersControl } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Sighting } from "~/routes/lajidata";

interface SpeciesLayerProps {
  data: Sighting[];
}

export default function SpeciesLayer({ data }: SpeciesLayerProps) {
  return (
    <LayersControl.Overlay name="Species layer">
      <MarkerClusterGroup>
        {data && data.map((s, index) => (
          <CustomMarker key={index} position={s.coordinates} endangermentStatus={s.endangerment} />
        ))}
      </MarkerClusterGroup>
    </LayersControl.Overlay>
  );
}
