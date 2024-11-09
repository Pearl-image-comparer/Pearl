import { Fab, Stack, ToggleButton, styled } from "@mui/material";
import { useState } from "react";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import AddIcon from "@mui/icons-material/Add";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { useTheme, Theme } from "@mui/material/styles";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useMap } from "react-leaflet";

export default function Fabs() {
  const [viewCentered, setViewCentered] = useState(false);
  const [satelliteViewOpen, setSatelliteViewOpen] = useState(false);
  const theme: Theme = useTheme();
  const map = useMap();

  const StyledStack = styled(Stack)({
    display: "flex",
    alignItems: "flex-end",
    gap: "0.5rem",
    right: "1.25rem",
    bottom: "2.5rem",
    pointerEvents: "auto",
    position: "absolute",
    zIndex: 1000,
  });

  const StyledAddFab = styled(Fab)({
    width: "4.3rem",
    height: "4.3rem",
  });

  const StyledAddIcon = styled(AddIcon)({
    fontSize: "2rem",
  });

  const StyledToggleButton = styled(ToggleButton)({
    backgroundColor: theme.palette.background.default,
    borderRadius: "50%",
    "&.Mui-selected": {
      backgroundColor: theme.palette.success.light,
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.background.default,
      },
    },
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    },
  });
    
  const handleSatelliteView = () => {
    setSatelliteViewOpen(!satelliteViewOpen); 
  }; 
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( 
        (position) => {
           const { latitude, longitude } = position.coords; 
           map.flyTo([latitude, longitude], 16);
           map 
           }, (err) => { console.error(err.message); }
           ); 
          } else { 
            console.error("Geolocation is not supported by this browser."); } };

  return (
    <StyledStack direction="column">
      <StyledToggleButton
        value="check"
        selected={viewCentered}
        onChange={() => {
          getLocation();
        }}
      >
        {viewCentered ? <MyLocationIcon /> : <LocationSearchingIcon />}
      </StyledToggleButton>
      <StyledToggleButton
        value="check"
        selected={satelliteViewOpen}
        onChange={handleSatelliteView}
      >
        <SatelliteAltIcon />
      </StyledToggleButton>
      <StyledAddFab color="primary" aria-label="add">
        <StyledAddIcon />
      </StyledAddFab>
    </StyledStack>
  );
}
