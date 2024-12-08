import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { List, ListItem, Checkbox, Box, Typography } from "@mui/material";
import { useMap } from "react-leaflet";
import { LoadingState } from "~/components/map/_MapComponent.client";
import { FETCH_ZOOM_LEVEL_THRESHOLD } from "~/constants";
import { useTranslation } from "react-i18next";

// Mock data: array of layer options
const layerOptions = [
  { key: "sightings", name: "Uhanalaislajihavainnot" },
  { key: "observations", name: "Käyttäjähavainnot" },
  { key: "conservation", name: "Suojelualueet" },
] as const;

export type LayerKey = (typeof layerOptions)[number]["key"];

interface LayerControlProps {
  overlayVisibility: Record<LayerKey, boolean>;
  setOverlayVisibility: Dispatch<SetStateAction<Record<LayerKey, boolean>>>;
  setFetchingEnabled: Dispatch<SetStateAction<LoadingState>>;
  setFetchingError: Dispatch<SetStateAction<string | null>>;
}

export default function LayerControl({
  overlayVisibility,
  setOverlayVisibility,
  setFetchingEnabled,
  setFetchingError,
}: LayerControlProps) {
  const [zoomLevel, setZoomLevel] = useState(0);
  const map = useMap();
  const { t } = useTranslation();

  useEffect(() => {
    const checkZoomLevel = () => setZoomLevel(map.getZoom());
    map.on("moveend", checkZoomLevel);
    return () => {
      map.off("moveend", checkZoomLevel);
    };
  }, [map, setOverlayVisibility]);

  useEffect(() => {
    const sightingsError =
      overlayVisibility.sightings && zoomLevel < FETCH_ZOOM_LEVEL_THRESHOLD;
    const observationsError =
      overlayVisibility.observations && zoomLevel < FETCH_ZOOM_LEVEL_THRESHOLD;

    if (sightingsError && observationsError) {
      const error = t("sightingsObservationsError");
      setFetchingError(error);
    } else if (sightingsError) {
      const error = t("sightingsError");
      setFetchingError(error);
    } else if (observationsError) {
      const error = t("observationsError");
      setFetchingError(error);
    } else {
      setFetchingError(null);
    }

    setFetchingEnabled(() => ({
      sightings:
        overlayVisibility.sightings && zoomLevel >= FETCH_ZOOM_LEVEL_THRESHOLD,
      observations:
        overlayVisibility.observations &&
        zoomLevel >= FETCH_ZOOM_LEVEL_THRESHOLD,
    }));
  }, [overlayVisibility, setFetchingEnabled, setFetchingError, zoomLevel]);

  // Toggle layer
  const handleCheckboxChange = (key: LayerKey) => {
    setOverlayVisibility((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t("mapLayerTitle")}
      </Typography>
      <List sx={{ padding: 0 }}>
        {layerOptions.map((layer) => (
          <ListItem
            key={layer.key}
            sx={{
              padding: "4px 0px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox
              size="small"
              checked={overlayVisibility[layer.key]}
              onChange={() => handleCheckboxChange(layer.key)}
            />
            <Typography variant="body2">{t(layer.name)}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
