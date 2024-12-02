import { Fab, Stack, ToggleButton, styled } from "@mui/material";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import AddIcon from "@mui/icons-material/Add";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { useTheme, Theme } from "@mui/material/styles";
import { useMapEvent } from "react-leaflet";
import CompareIcon from "@mui/icons-material/Compare";
import { Dispatch, SetStateAction } from "react";
import { LatLng } from "leaflet";

export interface FabsProps {
  satelliteViewOpen: boolean;
  setSatelliteViewOpen: Dispatch<SetStateAction<boolean>>;
  comparisonViewOpen: boolean;
  setComparisonViewOpen: Dispatch<SetStateAction<boolean>>;
  onAddClick: () => void;
  setUserLocation: Dispatch<SetStateAction<LatLng | null>>;
}

export default function Fabs({
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
  onAddClick,
  setUserLocation,
}: FabsProps) {
  const theme: Theme = useTheme();

  const StyledStack = styled(Stack)({
    display: "flex",
    alignItems: "flex-end",
    gap: "0.5rem",
    pointerEvents: "none",
  });

  const StyledAddFab = styled(Fab)({
    width: "4.3rem",
    height: "4.3rem",
    pointerEvents: "auto",
  });

  const StyledAddIcon = styled(AddIcon)({
    fontSize: "2rem",
  });

  const StyledToggleButton = styled(ToggleButton)({
    pointerEvents: "auto",
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

  const map = useMapEvent("locationfound", (event) => {
    map.flyTo(event.latlng, 16);
    setUserLocation(event.latlng);
  });

  return (
    <StyledStack direction="column">
      <StyledToggleButton value="button" onChange={() => map.locate()}>
        {<LocationSearchingIcon />}
      </StyledToggleButton>
      {satelliteViewOpen && (
        <StyledToggleButton
          value="check"
          selected={comparisonViewOpen}
          onChange={() => setComparisonViewOpen(!comparisonViewOpen)}
        >
          <CompareIcon />
        </StyledToggleButton>
      )}
      <StyledToggleButton
        value="check"
        selected={satelliteViewOpen}
        onChange={() => setSatelliteViewOpen(!satelliteViewOpen)}
      >
        <SatelliteAltIcon />
      </StyledToggleButton>
      <StyledAddFab color="primary" aria-label="add" onClick={onAddClick}>
        <StyledAddIcon />
      </StyledAddFab>
    </StyledStack>
  );
}
