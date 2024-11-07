import { LatLngExpression } from "leaflet";
import { LayersControl } from "react-leaflet";
import CustomMarker from "~/components/map/markers/CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";

export default function ReportLayer() {
  // Note: Temporary hardcoded list of report locations
  const reports: LatLngExpression[] = [
    [61.5004, 23.8214],
    [61.4482, 23.857],
    [61.5, 23.7641],
    [61.4971, 23.756],
    [61.4973, 23.7569],
  ];

  return (
    <LayersControl.Overlay name="Reports layer">
      <MarkerClusterGroup>
        {reports.map((r, index) => (
          <CustomMarker key={index} position={r} />
        ))}
      </MarkerClusterGroup>
    </LayersControl.Overlay>
  );
}
