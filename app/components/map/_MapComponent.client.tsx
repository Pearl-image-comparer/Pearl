/*
WARNING: This file is an internal component and should not be imported
outside of the `components/map` -folder. Use `Map.tsx` instead.

Note: The filename must include "client" for the Leaflet map to work
correctly because Remix uses server-side rendering. This requires the
component to be rendered on the client side so that Leaflet can access
the window object and DOM elements.
*/

import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Controls from "~/components/controls/Controls";
import SpeciesLayer from "./layers/SpeciesLayer";
import ReportLayer from "./layers/ReportLayer";
import ConservationLayer from "./layers/ConservationLayer";
import Fabs from '../controls/fabs/Fabs'

export default function MapComponent() {
  const center: L.LatLngExpression = [61.4978, 23.761];

  return (
    <div className="map" style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Base layer">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite images">
            <WMSTileLayer
              attribution='&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>'
              url="/wms"
              layers="TRUE_COLOR"
              // @ts-expect-error Time is valid but not included in the type definition.
              time={new Date().toISOString().slice(0, 10)}
            />
          </LayersControl.BaseLayer>
          <SpeciesLayer />
          <ReportLayer />
          <ConservationLayer />
        </LayersControl>
        <Controls />
        <Fabs />
      </MapContainer>
    </div>
  );
}
