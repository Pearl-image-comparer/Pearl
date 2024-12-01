import { useMap } from "react-leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sighting } from "~/routes/lajidata";
import { debounce } from "@mui/material";
import { LoadingState } from "./_MapComponent.client";

interface MapBoundsProps {
  setSightings: (v: Sighting[]) => void;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
}

export default function MapBounds({
  setSightings,
  setLoading,
}: MapBoundsProps) {
  const map = useMap();
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);

  useEffect(() => {
    const fetchSightings = () => {
      setLoading((prev) => ({
        ...prev,
        sightings: true,
      }));

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
          setSightings(data);
          setLoading((prev) => ({
            ...prev,
            sightings: false,
          }));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    // Debounce to delay fetching data after map movement to avoid too many request
    const debouncedFetch = debounce(fetchSightings, 600);

    map.on("moveend", debouncedFetch);

    if (!hasFetchedInitially) {
      fetchSightings(); // Call immediately for initial fetch
      setHasFetchedInitially(true);
    }

    return () => {
      map.off("moveend", debouncedFetch);
      debouncedFetch.clear();
    };
  }, [map, hasFetchedInitially, setSightings, setLoading]);

  return null;
}
