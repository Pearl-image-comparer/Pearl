import { useMap } from "react-leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sighting } from "~/routes/lajidata";
import { debounce } from "@mui/material";
import { LoadingState } from "./_MapComponent.client";
import { Observation } from "~/routes/observations";

interface MapBoundsProps {
  setSightings: (v: Sighting[]) => void;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  setObservations: (v: Observation[]) => void;
}
export default function MapBounds({
  setSightings,
  setLoading,
  setObservations,
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
      const observationBounds = `startLongitude=${westLng}&startLatitude=${southLat}&endLongitude=${eastLng}&endLatitude=${northLat}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok: " + response.statusText,
            );
          }
          return response.json();
        })
        .then((sightingsdata) => {
          setSightings(sightingsdata);
          setLoading((prev) => ({
            ...prev,
            sightings: false,
          }));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      const observationsUrl = `/observations?${decodeURIComponent(observationBounds)}`;

      fetch(observationsUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok: " + response.statusText,
            );
          }
          return response.json();
        })
        .then((observationdata) => {
          setObservations(observationdata);
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
  }, [map, hasFetchedInitially, setSightings, setLoading, setObservations]);

  return null;
}
