import { Fab, Stack, ToggleButton, styled } from "@mui/material";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import AddIcon from "@mui/icons-material/Add";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { useTheme, Theme } from "@mui/material/styles";
import { useMap } from "react-leaflet";
import CompareIcon from "@mui/icons-material/Compare";

interface FabsProps {
  satelliteViewOpen: boolean;
  setSatelliteViewOpen: (v: boolean) => void;
  comparisonViewOpen: boolean;
  setComparisonViewOpen: (v: boolean) => void;
}

export default function Fabs({
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
}: FabsProps) {
  const theme: Theme = useTheme();
  const map = useMap();

  const StyledStack = styled(Stack)({
    display: "flex",
    alignItems: "flex-end",
    gap: "0.5rem",
    pointerEvents: "auto",
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

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 16);
        },
        (err) => {
          console.error(err.message);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <StyledStack direction="column">
      <StyledToggleButton
        value="button"
        onChange={() => {
          getLocation();
        }}
      >
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
      <StyledAddFab color="primary" aria-label="add">
        <StyledAddIcon />
      </StyledAddFab>
    </StyledStack>
  );
}
