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
  useMap,
  WMSTileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Controls from "~/components/controls/Controls";
import SpeciesLayer from "./layers/SpeciesLayer";
import ReportLayer from "./layers/ReportLayer";
import ConservationLayer from "./layers/ConservationLayer";
import { useEffect, useState } from "react";

function MapBounds() {
  const map = useMap();
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);

  useEffect(() => {
    const handleMoveEnd = () => {
      const newBounds = map.getBounds();
      const northEast = newBounds.getNorthEast();
      const southEast = newBounds.getSouthEast();
      const northWest = newBounds.getNorthWest();

      const northLat = northEast.lat;
      const southLat = southEast.lat;
      const eastLng = northEast.lng;
      const westLng = northWest.lng;
      const bounds = `${southLat}:${northLat}:${westLng}:${eastLng}`;

      const url = `/lajidata?bounds=${encodeURIComponent(bounds)}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok: " + response.statusText,
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    map.on("moveend", handleMoveEnd);

    if (!hasFetchedInitially) {
      handleMoveEnd();
      setHasFetchedInitially(true);
    }

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map]);

  return null;
}

export default function MapComponent() {
  const center: L.LatLngExpression = [61.4978, 23.761];

  return (
    <div className="map" style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        <MapBounds />
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
      </MapContainer>
    </div>
  );
}
