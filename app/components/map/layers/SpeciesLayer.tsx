import { LayerGroup } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Sighting } from "~/routes/lajidata";
import SightingPopup from "~/components/sightings/SightingPopup";
import L from "leaflet";
import { useTheme } from "@mui/material";

interface SpeciesLayerProps {
  data: Sighting[];
}

export default function SpeciesLayer({ data }: SpeciesLayerProps) {
  const theme = useTheme();

  const createClusterCustomIcon = function (cluster: {
    getChildCount: () => number;
  }) {
    return L.divIcon({
      html: `<span style="
        background-color: ${theme.palette.common.white};
        color: ${theme.palette.primary.main};
        border-radius: 50%;
        height: 2rem;
        width: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 90%;
        border: 0.15rem solid ${theme.palette.primary.main};
        font-weight: bold;">
        ${cluster.getChildCount()}
      </span>`,
      className: "custom-marker-cluster",
      iconSize: L.point(33, 33, true),
    });
  };

  return (
    <LayerGroup>
      <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
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
