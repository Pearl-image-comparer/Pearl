import { Container, Slider, styled, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { SyntheticEvent, useEffect } from "react";
import { useMap } from "react-leaflet";

interface DateSliderProps {
  value: number | number[];
  onChange: (
    event: Event | SyntheticEvent<Element, Event>,
    value: number | number[],
  ) => void;
  min: number;
  max: number;
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

  const StyledContainer = styled(Container)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  });

  const StyledSlider = styled(Slider)({
    width: "80%",
    pointerEvents: "auto",
    "& .MuiSlider-markLabel": {
      color: theme.palette.common.white,
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 20,
      fontWeight: 500,
      background: "unset",
      padding: 0,
      width: 120,
      height: 32,
      top: -4,
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
