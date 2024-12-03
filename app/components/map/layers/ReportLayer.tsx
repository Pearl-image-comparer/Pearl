import { LayerGroup } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import ObservationPopup from "~/components/observations/ObservationPopup";
import { Observation } from "~/routes/observations";
import L from "leaflet";
import { useTheme } from "@mui/material";

interface ReportLayerProps {
  data: Observation[];
}

export default function ReportLayer({ data }: ReportLayerProps) {
  const theme = useTheme();
  const createClusterCustomIcon = function (cluster: {
    getChildCount: () => number;
  }) {
    return L.divIcon({
      html: `<span style="
          background-color: ${theme.palette.primary.main};
          color: ${theme.palette.common.white};
          border-radius: 50%;
          height: 2rem;
          width: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 90%;
          border: 0.15rem solid ${theme.palette.common.white};
          font-weight: bold;
          ">
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
            <CustomMarker key={index} position={[s.latitude, s.longitude]}>
              <ObservationPopup observation={s} />
            </CustomMarker>
          ))}
      </MarkerClusterGroup>
    </LayerGroup>
  );
}
