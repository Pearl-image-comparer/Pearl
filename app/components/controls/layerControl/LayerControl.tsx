import { useState } from "react";
import { List, ListItem, Checkbox, Box, Typography } from "@mui/material";

// Mock data: array of layer options
const layerOptions = [
    { key: "conservation", name: "Conservation Layer" },
    { key: "reports", name: "Reports Layer" },
    { key: "species", name: "Species Layer" },
] as const;

type LayerKey = (typeof layerOptions)[number]["key"];

export default function LayerControl() {
    const [checkedLayers, setCheckedLayers] = useState<
        Record<LayerKey, boolean>
    >({
        conservation: false,
        reports: false,
        species: false,
    });

    // Toggle layer
    const handleCheckboxChange = (key: LayerKey) => {
        setCheckedLayers((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <Box
            sx={{
                width: 200,
                padding: 1,
                borderRadius: 2,
            }}
        >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Layers
            </Typography>
            <List sx={{ padding: 0 }}>
                {layerOptions.map((layer) => (
                    <ListItem
                        key={layer.key}
                        sx={{
                            padding: "4px 8px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Checkbox
                            size="small"
                            checked={checkedLayers[layer.key]}
                            onChange={() => handleCheckboxChange(layer.key)}
                        />
                        <Typography variant="body2">{layer.name}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
