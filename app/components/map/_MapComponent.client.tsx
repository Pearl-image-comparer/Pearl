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
import MapBounds from "./MapBounds";
import SideBySide from "./comparison/SideBySide";
import { useState } from "react";
import dayjs from "dayjs";

export default function MapComponent() {
  const [period, setPeriod] = useState({
    start: dayjs("2015-10-10"),
    end: dayjs(),
  });
  const [startDate, setStartDate] = useState(period.start);
  const [endDate, setEndDate] = useState(period.end);
  const [satelliteViewOpen, setSatelliteViewOpen] = useState(false);
  const [comparisonViewOpen, setComparisonViewOpen] = useState(false);

  const center: L.LatLngExpression = [61.4978, 23.761];
  return (
    <div className="map" style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        <MapBounds />
        {satelliteViewOpen ? (
          comparisonViewOpen ? (
            <SideBySide
              leftDate={startDate.toISOString().split("T")[0]}
              rightDate={endDate.toISOString().split("T")[0]}
              opacity={1}
              onTop="left"
            />
          ) : (
            <WMSTileLayer
              attribution='&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>'
              url="/wms"
              layers="TRUE_COLOR"
              // @ts-expect-error Time is valid but not included in the type definition.
              time={endDate.toISOString().split("T")[0]}
            />
          )
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        <LayersControl position="topright">
          <SpeciesLayer />
          <ReportLayer />
          <ConservationLayer />
        </LayersControl>
        <Controls
          satelliteViewOpen={satelliteViewOpen}
          setSatelliteViewOpen={setSatelliteViewOpen}
          comparisonViewOpen={comparisonViewOpen}
          setComparisonViewOpen={setComparisonViewOpen}
          period={period}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </MapContainer>
    </div>
  );
}
