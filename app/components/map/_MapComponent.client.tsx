/*
WARNING: This file is an internal component and should not be imported
outside of the `components/map` -folder. Use `Map.tsx` instead.

Note: The filename must include "client" for the Leaflet map to work
correctly because Remix uses server-side rendering. This requires the
component to be rendered on the client side so that Leaflet can access
the window object and DOM elements.
*/

import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  const center: L.LatLngExpression = [61.4978, 23.761];

  return (
    <div className="map" style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        <LayersControl>
          <LayersControl.BaseLayer checked name="Base layer">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite images">
            <TileLayer
              attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Marker position={center} />
      </MapContainer>
    </div>
  );
}
