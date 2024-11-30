import {
  Container,
  debounce,
  styled,
  useTheme,
  useMediaQuery,
  Paper
} from "@mui/material";
import SearchBar from "./searchbar/SearchBar";
import Fabs, { type FabsProps } from "./fabs/Fabs";
import DateSlider from "./slider/DateSlider";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import MenuDrawer from "./drawer/Drawer";
import { LayerKey } from "./layerControl/LayerControl";

export interface Period {
  start: Dayjs;
  end: Dayjs;
}

export interface ControlsProps {
  period: Period;
  setPeriod: Dispatch<SetStateAction<Period>>;
  setStartDate: (v: Dayjs | null) => void;
  setEndDate: (v: Dayjs | null) => void;
  isDrawerOpen: boolean;
  startDate: Dayjs;
  endDate: Dayjs;
  overlayVisibility: Record<LayerKey, boolean>;
  setOverlayVisibility: Dispatch<SetStateAction<Record<LayerKey, boolean>>>;
}

export default function Controls({
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
  period,
  setPeriod,
  setStartDate,
  setEndDate,
  onAddClick,
  startDate,
  endDate,
  overlayVisibility,
  setOverlayVisibility,
  setUserLocation,
}: FabsProps & ControlsProps) {
  // Uses current day by default
  const [sliderValue, setSliderValue] = useState<number | number[]>(
    dayjs().valueOf(),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const StyledContainer = styled(Container)({
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "2rem 2rem",
    pointerEvents: "none",
  });

  // Debounce wms tile fetching on slider change
  const debounceSliderInput = useMemo(
    () =>
      debounce((value: number | number[]) => {
        if (Array.isArray(value)) {
          setStartDate(dayjs(value[0]));
          setEndDate(dayjs(value[1]));
        } else {
          setEndDate(dayjs(value));
        }
      }, 400),
    [setEndDate, setStartDate],
  );

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setSliderValue(value);
    debounceSliderInput(value);
  };

  return (
    <Container>
      <MenuDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        isMobile={isMobile}
        setPeriod={setPeriod}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
        overlayVisibility={overlayVisibility}
        setOverlayVisibility={setOverlayVisibility}
      />
      <SearchBar isDrawerOpen={isDrawerOpen} isMobile={isMobile} />

      <StyledContainer maxWidth={false}>
      <Paper
          sx={{
            position: "absolute",
            backgroundColor: "transparent",
            boxShadow: "none",
            bottom: "2rem",
            left: isMobile || !isDrawerOpen ? "0.7rem" : `${300 + theme.spacing(1)}px`, // 300 + 50 = drawer+bleeding width
            width: isMobile || !isDrawerOpen ? "calc(100% - 1.4rem)" : `calc(100% - ${300 + 20}px)`, // Subtract drawer width + margins
            right: "0.7rem",
            zIndex: 1000,
          }}
        >
        <Fabs
          satelliteViewOpen={satelliteViewOpen}
          comparisonViewOpen={comparisonViewOpen}
          setSatelliteViewOpen={setSatelliteViewOpen}
          setComparisonViewOpen={setComparisonViewOpen}
          onAddClick={onAddClick}
          setUserLocation={setUserLocation}
        />
        {satelliteViewOpen && (
          
          <DateSlider
            value={sliderValue}
            onChange={handleSliderChange}
            min={period.start.valueOf()}
            max={period.end.valueOf()}
          />
        )}</Paper>
      </StyledContainer>
    </Container>
  );
}
