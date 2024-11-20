import { useMapEvent } from "react-leaflet";
import type { LatLng } from "leaflet";

export default function ReportCreator(props: {
  onCreateReport: (latlng: LatLng) => void;
}) {
  useMapEvent("contextmenu", (event) => props.onCreateReport(event.latlng));

  return null;
}
