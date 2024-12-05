import { Box, Slider, styled, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { SyntheticEvent, useEffect } from "react";
import { useMap } from "react-leaflet";
import { WINDOW_HEIGHT_MIN_THRESHOLD } from "~/constants";

interface DateSliderProps {
  value: number | number[];
  onChange: (
    event: Event | SyntheticEvent<Element, Event>,
    value: number | number[],
  ) => void;
  min: number;
  max: number;
  windowHeight: number;
  isMobile: boolean;
}

/**
 * Renders a slider based on the `value` prop.
 *
 * - If the `value` prop holds a single number, a basic slider (one handle) is rendered.
 * - If the `value` prop holds an array of two numbers, a range slider (two handles) is rendered.
 *
 * @param props - The properties passed to the `DateSlider` component.
 * @returns The rendered slider component.
 */
export default function DateSlider({
  value,
  onChange,
  min,
  max,
  windowHeight,
  isMobile,
}: DateSliderProps) {
  const map = useMap();
  const theme = useTheme();

  // empty useEffect to update the component when the value changes
  useEffect(() => {}, [value]);

  // Handling the map drag when slider is dragged
  const stopMapDrag = () => map.dragging.disable();
  const startMapDrag = () => map.dragging.enable();

  // Calculating one day for the slider step
  const dayInMs = 24 * 60 * 60 * 1000;

  const StyledContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "0 1rem",
    paddingRight: windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD ? 0 : "1rem",
    width: "100%"
  });

  const StyledSlider = styled(Slider)({
    width: "80%",
    pointerEvents: "auto",
    "& .MuiSlider-markLabel": {
      color: theme.palette.common.white,
    },
    "& .MuiSlider-thumb": {
      height:
        windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD || isMobile
          ? "1.1rem"
          : "1.25rem",
      width:
        windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD || isMobile
          ? "1.1rem"
          : "1.25rem",
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize:
        windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD || isMobile ? 18 : 20,
      fontWeight: 500,
      background: "unset",
      padding: 0,
      width: 120,
      height: 32,
      top: windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD || isMobile ? 0 : -4,
    },
  });

  return (
    <StyledContainer>
      <StyledSlider
        defaultValue={value}
        onChangeCommitted={onChange}
        onMouseDown={stopMapDrag}
        onMouseUp={startMapDrag}
        onTouchStart={stopMapDrag}
        onTouchEnd={startMapDrag}
        step={dayInMs}
        min={min}
        max={max}
        valueLabelDisplay="on"
        valueLabelFormat={(v) => dayjs(v).format("DD/MM/YYYY")}
        marks={[
          { value: min, label: dayjs(min).format("DD/MM/YYYY") },
          { value: max, label: dayjs(max).format("DD/MM/YYYY") },
        ]}
      />
    </StyledContainer>
  );
}
