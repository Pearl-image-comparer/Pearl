import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { List, ListItem, Checkbox, Box, Typography } from "@mui/material";
import { useMap } from "react-leaflet";
import { LoadingState } from "~/components/map/_MapComponent.client";

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
}

export default function LayerControl({
  overlayVisibility,
  setOverlayVisibility,
  setFetchingEnabled,
}: LayerControlProps) {
  const [zoomLevel, setZoomLevel] = useState(0);
  const zoomThreshold = 13;
  const map = useMap();

  useEffect(() => {
    const checkZoomLevel = () => setZoomLevel(map.getZoom());
    map.on("moveend", checkZoomLevel);
    return () => {
      map.off("moveend", checkZoomLevel);
    };
  }, [map, setOverlayVisibility]);

  useEffect(() => {
    setFetchingEnabled(() => ({
      sightings: overlayVisibility.sightings && zoomLevel >= zoomThreshold,
      observations:
        overlayVisibility.observations && zoomLevel >= zoomThreshold,
    }));
  }, [overlayVisibility, setFetchingEnabled, zoomLevel]);

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
        Kartan tasot
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
            <Typography variant="body2">{layer.name}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
