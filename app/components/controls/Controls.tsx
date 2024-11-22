import {
  Container,
  debounce,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchBar from "./searchbar/SearchBar";
import Fabs, { type FabsProps } from "./fabs/Fabs";
import DateSlider from "./slider/DateSlider";
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import MenuDrawer from "./drawer/Drawer";

export interface Period {
  start: Dayjs;
  end: Dayjs;
}

export interface ControlsProps {
  period: Period;
  setStartDate: (v: Dayjs) => void;
  setEndDate: (v: Dayjs) => void;
  isDrawerOpen: boolean;
}

export default function Controls({
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
  period,
  setStartDate,
  setEndDate,
  onAddClick,
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
      />
      <SearchBar isDrawerOpen={isDrawerOpen} isMobile={isMobile} />
      <StyledContainer maxWidth={false}>
        <Fabs
          satelliteViewOpen={satelliteViewOpen}
          comparisonViewOpen={comparisonViewOpen}
          setSatelliteViewOpen={setSatelliteViewOpen}
          setComparisonViewOpen={setComparisonViewOpen}
          onAddClick={onAddClick}
        />
        {satelliteViewOpen && (
          <DateSlider
            value={sliderValue}
            onChange={handleSliderChange}
            min={period.start.valueOf()}
            max={period.end.valueOf()}
          />
        )}
      </StyledContainer>
    </Container>
  );
}
