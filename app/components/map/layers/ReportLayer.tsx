import { LayerGroup } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import ObservationPopup from "~/components/observations/ObservationPopup";
import { Observation } from "~/components/observations/ReportDialog";
import L from "leaflet";
import { useTheme } from "@mui/material";

export default function ReportLayer() {
  // Note: Temporary hardcoded list of report locations by ChatGPT
  const reports: Observation[] = [
    {
      picture: null,
      title: "Bird Sighting",
      longitude: 61.5004,
      latitude: 23.8214,
      description: "A rare bird was spotted near the lake.",
    },
    {
      picture: null,
      title: "Beautiful Flower",
      longitude: 61.4482,
      latitude: 23.857,
      description: "A vibrant wildflower growing in the field.",
    },
    {
      picture: null,
      title: "Amazing Sunset",
      longitude: 61.5,
      latitude: 23.7641,
      description: "A stunning sunset over the hills.",
    },
    {
      picture: null,
      title: "Elk Sighting",
      longitude: 61.4971,
      latitude: 23.756,
      description: "An elk was grazing near the forest edge.",
    },
    {
      picture: null,
      title: "Ancient Oak",
      longitude: 61.4973,
      latitude: 23.7569,
      description: "A towering oak tree standing for centuries.",
    },
  ];

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
          <CustomMarker key={index} position={[r.longitude, r.latitude]}>
            <ObservationPopup observation={r} />
          </CustomMarker>
        ))}
      </MarkerClusterGroup>
    </LayerGroup>
  );
}
