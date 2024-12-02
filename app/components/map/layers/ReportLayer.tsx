import { useState, useEffect } from "react";
import { LayerGroup } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import ObservationPopup from "~/components/observations/ObservationPopup";
import { Observation } from "~/components/observations/ReportDialog";
import L from "leaflet";
import { useTheme } from "@mui/material";

export default function ReportLayer() {
  const [reports, setReports] = useState<Observation[]>([]);

  useEffect(() => {
    async function fetchReports() {
      const response = await fetch("/observations");
      const data = await response.json();
      setReports(data);
    }

    fetchReports();
  }, []);

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
        {reports.map((r, index) => (
          <CustomMarker key={index} position={[r.latitude, r.longitude]}>
            <ObservationPopup observation={r} />
          </CustomMarker>
        ))}
      </MarkerClusterGroup>
    </LayerGroup>
  );
}
