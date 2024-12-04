import { useMap } from "react-leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sighting } from "~/routes/lajidata";
import { debounce } from "@mui/material";
import { LoadingState } from "./_MapComponent.client";
import { Observation } from "~/routes/observations";

interface MapBoundsProps {
  setSightings: Dispatch<SetStateAction<Sighting[]>>;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  setObservations: (v: Observation[]) => void;
  fetchingEnabled: LoadingState;
}

export default function MapBounds({
  setSightings,
  setLoading,
  setObservations,
  fetchingEnabled,
}: MapBoundsProps) {
  const map = useMap();
  const [hasFetchedInitially, setHasFetchedInitially] = useState<LoadingState>({
    sightings: false,
    observations: false,
  });

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

    // Manage event listeners based on overlays visibilities
    if (fetchingEnabled.sightings) {
      // Fetch sightings straight away if the layer is toggled on
      if (!hasFetchedInitially.sightings) fetchSightings();

      setHasFetchedInitially((prev) => ({ ...prev, sightings: true }));
      map.on("moveend", debouncedSightings);
    } else {
      setHasFetchedInitially((prev) => ({ ...prev, sightings: false }));
      map.off("moveend", debouncedSightings);
    }

    if (fetchingEnabled.observations) {
      // Fetch sightings straight away if the layer is toggled on
      if (!hasFetchedInitially.observations) fetchObservations();

      setHasFetchedInitially((prev) => ({ ...prev, observations: true }));
      map.on("moveend", debouncedObservations);
    } else {
      setHasFetchedInitially((prev) => ({ ...prev, observations: false }));
      map.off("moveend", debouncedObservations);
    }

    // Clearing listeners and debounce effect when unmounted.
    return () => {
      map.off("moveend", debouncedSightings);
      map.off("moveend", debouncedObservations);
      debouncedSightings.clear();
      debouncedObservations.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, setSightings, setLoading, setObservations, fetchingEnabled]);

  return null;
}
