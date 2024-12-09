import { useMap } from "react-leaflet";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Sighting } from "~/routes/lajidata";
import { debounce } from "@mui/material";
import { LoadingState } from "./_MapComponent.client";
import { Observation } from "~/routes/observations";

interface MapBoundsProps {
  setSightings: Dispatch<SetStateAction<Sighting[]>>;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  setObservations: (v: Observation[]) => void;
  fetchingEnabled: LoadingState;
  isFetchPaused: boolean;
}

export default function MapBounds({
  setSightings,
  setLoading,
  setObservations,
  fetchingEnabled,
  isFetchPaused,
}: MapBoundsProps) {
  const map = useMap();
  const [hasFetchedInitially, setHasFetchedInitially] = useState<LoadingState>({
    sightings: false,
    observations: false,
  });

  // Ref to keep track of the current fetch pause state
  const isFetchPausedRef = useRef(isFetchPaused);

  useEffect(() => {
    isFetchPausedRef.current = isFetchPaused;
  }, [isFetchPaused]);

  useEffect(() => {
    // Returns the bounds for both sightings and observations fetch
    const calculateBounds = () => {
      const newBounds = map.getBounds();
      const { lat: northLat, lng: eastLng } = newBounds.getNorthEast();
      const { lat: southLat, lng: westLng } = newBounds.getSouthWest();

      const bounds = `${southLat}:${northLat}:${westLng}:${eastLng}`;
      const observationBounds = `startLongitude=${westLng}&startLatitude=${southLat}&endLongitude=${eastLng}&endLatitude=${northLat}`;

      return { bounds, observationBounds };
    };

    // Fetch sightings data and update sightings and it's loading state
    const fetchSightings = () => {
      const { bounds } = calculateBounds();
      setLoading((prev) => ({ ...prev, sightings: true }));

      fetch(`/lajidata?bounds=${encodeURIComponent(bounds)}`)
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
          setLoading((prev) => ({ ...prev, sightings: false }));
        })
        .catch((error) => {
          console.error("Error fetching sighting data:", error);
        });
    };

    // Fetch observations data and update observations and it's loading state
    const fetchObservations = () => {
      const { observationBounds } = calculateBounds();
      setLoading((prev) => ({ ...prev, observations: true }));

      fetch(`/observations?${decodeURIComponent(observationBounds)}`)
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
          setLoading((prev) => ({ ...prev, observations: false }));
        })
        .catch((error) => {
          console.error("Error fetching observation data:", error);
        });
    };

    // Debounce to delay fetching data after map movement to avoid too many request
    const debouncedSightings = debounce(fetchSightings, 600);
    const debouncedObservations = debounce(fetchObservations, 600);

    const handleMoveEnd = () => {
      if (isFetchPausedRef.current) return;
      if (fetchingEnabled.sightings) debouncedSightings();
      if (fetchingEnabled.observations) debouncedObservations();
    };

    if (fetchingEnabled.sightings || fetchingEnabled.observations) {
      map.on("moveend", handleMoveEnd);
    }

    // Handling initial fetch for sightings and observations
    if (fetchingEnabled.sightings) {
      if (!hasFetchedInitially.sightings) fetchSightings();
      setHasFetchedInitially((prev) => ({ ...prev, sightings: true }));
    } else {
      setHasFetchedInitially((prev) => ({ ...prev, sightings: false }));
    }
    if (fetchingEnabled.observations) {
      if (!hasFetchedInitially.observations) fetchObservations();
      setHasFetchedInitially((prev) => ({ ...prev, observations: true }));
    } else {
      setHasFetchedInitially((prev) => ({ ...prev, observations: false }));
    }

    // Clearing listeners and debounce effect when unmounted.
    return () => {
      map.off("moveend", handleMoveEnd);
      debouncedSightings.clear();
      debouncedObservations.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fetchingEnabled, isFetchPaused]);

  return null;
}
