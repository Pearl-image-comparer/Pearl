import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";

export default function MapBounds() {
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
  }, [map, hasFetchedInitially]);

  return null;
}
