import { Fab, Stack, ToggleButton } from "@mui/material";
import { CSSProperties, useState } from "react";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import AddIcon from "@mui/icons-material/Add";
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { useTheme, Theme } from "@mui/material/styles";
import MyLocationIcon from '@mui/icons-material/MyLocation';

export default function Fabs() {
    const [viewCentered, setViewCentered] = useState(false);
    const [satelliteViewOpen, setSatelliteViewOpen] = useState(false);
    const theme: Theme = useTheme();

    const stackStyle: CSSProperties = {
        display: "flex",
        alignItems: "flex-end",
        gap: "0.5rem",
        right: "1.25rem",
        bottom: "2.5rem",
        pointerEvents: "auto",
        position: "absolute",
        zIndex: 1000
    };

    const addStyle: CSSProperties = {
        width: "4.3rem",
        height: "4.3rem"
    };

    const toggleButtonStyle = {
        bgcolor: theme.palette.background.default,
        borderRadius: "50%",
        "&.Mui-selected": {
            bgcolor: theme.palette.success.light,
            color: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: theme.palette.background.default,
            },
        },
        "&:hover": {
            bgcolor: theme.palette.background.paper,
            backgroundColor: theme.palette.background.paper,
        },
    };

    const handleViewCentered = () => {
        setViewCentered(!viewCentered);
    }

    const handleSatelliteView = () => {
        setSatelliteViewOpen(!satelliteViewOpen);
    }

    return (
        <Stack direction="column" style={stackStyle}>
            <ToggleButton value="check" selected={viewCentered} onChange={handleViewCentered} sx={toggleButtonStyle}>
                {viewCentered ? <MyLocationIcon /> : <LocationSearchingIcon />}
            </ToggleButton>
            <ToggleButton value="check" selected={satelliteViewOpen} onChange={handleSatelliteView} sx={toggleButtonStyle}>
                <SatelliteAltIcon />
            </ToggleButton>
            <Fab color="primary" aria-label="add" style={addStyle}>
                <AddIcon style={{ fontSize: "2rem" }} />
            </Fab>
        </Stack>
    );
}