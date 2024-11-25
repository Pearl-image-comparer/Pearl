/*
WARNING: This file is an internal component and should not be imported
outside of the `components/map` -folder. Use `Map.tsx` instead.

Note: The filename must include "client" for the Leaflet map to work
correctly because Remix uses server-side rendering. This requires the
component to be rendered on the client side so that Leaflet can access
the window object and DOM elements.
*/

import {
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
import ReportDialog from "~/components/observations/ReportDialog";
import { memo, useState } from "react";
import dayjs from "dayjs";
import ReportCreator from "../observations/ReportCreator";
import type { LatLng } from "leaflet";
import { Backdrop, Typography } from "@mui/material";
import { Sighting } from "~/routes/lajidata";
import { LayerKey } from "../controls/layerControl/LayerControl";

export default function MapComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [period, setPeriod] = useState({
    start: dayjs("2015-10-10"),
    end: dayjs(),
  });
  const [startDate, setStartDate] = useState(period.start);
  const [endDate, setEndDate] = useState(period.end);
  const [satelliteViewOpen, setSatelliteViewOpen] = useState(false);
  const [comparisonViewOpen, setComparisonViewOpen] = useState(false);
  const [reportLocation, setReportLocation] = useState<LatLng | null>(null);
  const [selectLocation, setSelectLocation] = useState(false);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [overlayVisibility, setOverlayVisibility] = useState<
    Record<LayerKey, boolean>
  >({
    sightings: true,
    observations: false,
    conservation: false,
  });

  interface WMSParams {
    attribution: string;
    url: string;
    layers: string;
    time: string;
  }

  // eslint-disable-next-line react/display-name
  const MemoizedWMSTileLayer = memo((wmsParams: WMSParams) => (
    <WMSTileLayer
      attribution={wmsParams.attribution}
      url={wmsParams.url}
      layers={wmsParams.layers}
      // @ts-expect-error Time is valid but not included in the type definition.
      time={wmsParams.time}
    />
  ));

  const center: L.LatLngExpression = [61.4978, 23.761];
  return (
    <div className="map" style={{ width: "100%", height: "100%" }}>
      <ReportDialog
        isOpen={reportLocation !== null}
        location={reportLocation}
        onClose={() => setReportLocation(null)}
        onSubmit={console.log}
      />
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        <ReportCreator
          onCreateReport={(location) => {
            setSelectLocation(false);
            setReportLocation(location);
          }}
          singleClickSelect={selectLocation}
        />
        <MapBounds setSightings={setSightings} />
        {satelliteViewOpen ? (
          comparisonViewOpen ? (
            <SideBySide
              leftDate={startDate.toISOString().split("T")[0]}
              rightDate={endDate.toISOString().split("T")[0]}
              opacity={1}
              onTop="left"
            />
          ) : (
            <MemoizedWMSTileLayer
              attribution='&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>'
              url="/wms"
              layers="TRUE_COLOR"
              time={endDate.toISOString().split("T")[0]}
            />
          )
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        {overlayVisibility.sightings && <SpeciesLayer data={sightings} />}
        {overlayVisibility.observations && <ReportLayer />}
        {overlayVisibility.conservation && <ConservationLayer />}
        <Controls
          satelliteViewOpen={satelliteViewOpen}
          setSatelliteViewOpen={setSatelliteViewOpen}
          comparisonViewOpen={comparisonViewOpen}
          setComparisonViewOpen={setComparisonViewOpen}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onAddClick={() => setSelectLocation((prev) => !prev)}
          startDate={startDate}
          endDate={endDate}
          overlayVisibility={overlayVisibility}
          setOverlayVisibility={setOverlayVisibility}
        />
      </MapContainer>
      <Backdrop
        open={selectLocation}
        sx={{ zIndex: 100, pointerEvents: "none" }}
      >
        <Typography color="white">Klikkaa sijaintia kartalta</Typography>
      </Backdrop>
    </div>
  );
}
