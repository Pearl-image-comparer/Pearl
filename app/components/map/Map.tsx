import { lazy, Suspense, useEffect, useState } from "react";
import type { Map } from "./_MapComponent.client";

// Lazy loading to ensure the browser environment is available before render.
const LazyMap = lazy(() => import("./_MapComponent.client"));

export default function Map() {
  const [maps, setMaps] = useState<Map[]>([]);

  useEffect(() => {
    if (maps.length === 0) {
      fetch(
        "https://wayback.maptiles.arcgis.com/ArcGIS/rest/services/World_Imagery/MapServer?f=json",
      )
        .then((response) => response.json())
        .then((data) =>
          setMaps(
            data.Selection.map(
              (selection: { Name: string; M: string; ID: string }) => ({
                name: selection.Name,
                tile: selection.M,
                id: selection.ID,
              }),
            ),
          ),
        );
    }
  }, [maps]);

  return (
    // TODO: Add proper fallback
    <Suspense fallback={<p>Lazy loading...</p>}>
      <LazyMap maps={maps} />
    </Suspense>
  );
}
