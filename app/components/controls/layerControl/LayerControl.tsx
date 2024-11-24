import { useState } from "react";
import { List, ListItem, Checkbox, Box, Typography } from "@mui/material";

// Mock data: array of layer options
const layerOptions = [
  { key: "sightings", name: "Uhanalaislajihavainnot" },
  { key: "observations", name: "Käyttäjähavainnot" },
  { key: "conservation", name: "Suojelualueet" },
] as const;

type LayerKey = (typeof layerOptions)[number]["key"];

export default function LayerControl() {
  //TODO move this to the map component
  const [overlayVisibility, setOverlayVisibility] = useState<
    Record<LayerKey, boolean>
  >({
    sightings: false,
    observations: false,
    conservation: false,
  });

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
