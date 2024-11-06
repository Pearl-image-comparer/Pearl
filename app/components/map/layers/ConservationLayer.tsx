import { LayersControl, WMSTileLayer } from "react-leaflet";

export default function ConservationLayer() {
  return (
    <LayersControl.Overlay name="Conservation layer">
      <WMSTileLayer
        url="https://paikkatiedot.ymparisto.fi/geoserver/syke_luonnonsuojeluohjelma_alueet/wms"
        layers="Luonnonsuojeluohjelmaalueet"
        format="image/png"
        transparent={true}
        opacity={0.33}
      />
    </LayersControl.Overlay>
  );
}
