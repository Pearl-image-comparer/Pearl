import { LayerGroup } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Sighting } from "~/routes/lajidata";
import SightingPopup from "~/components/sightings/SightingPopup";

interface SpeciesLayerProps {
  data: Sighting[];
}

export default function SpeciesLayer({ data }: SpeciesLayerProps) {
  return (
    <LayerGroup>
      <MarkerClusterGroup>
        {data &&
          data.map((s, index) => (
            <CustomMarker
              key={index}
              position={s.coordinates}
              endangermentStatus={s.endangerment}
            >
              <SightingPopup sighting={s} />
            </CustomMarker>
          ))}
      </MarkerClusterGroup>
    </LayerGroup>
  );
}
