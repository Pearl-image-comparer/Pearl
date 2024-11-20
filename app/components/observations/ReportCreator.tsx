import { useMapEvents } from "react-leaflet";
import type { LatLng } from "leaflet";

export default function ReportCreator(props: {
  onCreateReport: (latlng: LatLng) => void;
  singleClickSelect: boolean;
}) {
  useMapEvents({
    contextmenu: (event) =>
      props.singleClickSelect || props.onCreateReport(event.latlng),
    click: (event) =>
      props.singleClickSelect && props.onCreateReport(event.latlng),
  });

  return null;
}
