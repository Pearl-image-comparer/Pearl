import { LayerGroup } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import ObservationPopup from "~/components/observations/ObservationPopup";
import { Observation } from "~/components/observations/ReportDialog";

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

  return (
    <LayerGroup>
      <MarkerClusterGroup>
        {reports.map((r, index) => (
          <CustomMarker key={index} position={[r.longitude, r.latitude]}>
            <ObservationPopup observation={r} />
          </CustomMarker>
        ))}
      </MarkerClusterGroup>
    </LayerGroup>
  );
}
