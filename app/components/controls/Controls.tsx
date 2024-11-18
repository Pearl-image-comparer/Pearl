import { Container, debounce, styled } from "@mui/material";
import SearchBar from "./searchbar/SearchBar";
import Fabs from "./fabs/Fabs";
import DateSlider from "./slider/DateSlider";
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface Period {
  start: Dayjs;
  end: Dayjs;
}

interface ControlsProps {
  satelliteViewOpen: boolean;
  setSatelliteViewOpen: (v: boolean) => void;
  comparisonViewOpen: boolean;
  setComparisonViewOpen: (v: boolean) => void;
  period: Period;
  setStartDate: (v: Dayjs) => void;
  setEndDate: (v: Dayjs) => void;
}

export default function Controls({
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
  period,
  setStartDate,
  setEndDate,
}: ControlsProps) {
  // Uses current day by default
  const [sliderValue, setSliderValue] = useState<number | number[]>(
    dayjs().valueOf(),
  );

  const StyledContainer = styled(Container)({
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "2rem 2rem",
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
      <SearchBar />
      <StyledContainer maxWidth={false}>
        <Fabs
          satelliteViewOpen={satelliteViewOpen}
          comparisonViewOpen={comparisonViewOpen}
          setSatelliteViewOpen={setSatelliteViewOpen}
          setComparisonViewOpen={setComparisonViewOpen}
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
