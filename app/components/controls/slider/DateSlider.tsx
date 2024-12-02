import { Container, Slider, styled, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface DateSliderProps {
  value: number | number[];
  onChange: (e: Event, value: number | number[]) => void;
  min: number;
  max: number;
}

/**
 * Renders a slider based on the `value` prop.
 *
 * - If the `value` prop holds a single number, a basic slider (one handle) is rendered.
 * - If the `value` prop holds an array of two numbers, a range slider (two handles) is rendered.
 *
 * @param {DateSliderProps} props - The properties passed to the `DateSlider` component.
 * @returns {JSX.Element} The rendered slider component.
 */
export default function DateSlider({
  value,
  onChange,
  min,
  max,
}: DateSliderProps) {
  const map = useMap();

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

  const RowContainer = styled(Container)({
    display: "flex",
    justifyContent: "space-between",
  });

  const StyledSlider = styled(Slider)({
    width: "80%",
    pointerEvents: "auto",
  });

  return (
    <StyledContainer>
      <RowContainer>
        <Typography color="white" variant="h6">
          {typeof value === "number"
            ? dayjs(min).format("DD-MM-YYYY")
            : dayjs(value[0]).format("DD-MM-YYYY")}
        </Typography>
        <Typography color="white" variant="h6">
          {typeof value === "number"
            ? dayjs(value).format("DD-MM-YYYY")
            : dayjs(value[1]).format("DD-MM-YYYY")}
        </Typography>
      </RowContainer>
      <StyledSlider
        value={value}
        onChange={onChange}
        onMouseDown={stopMapDrag}
        onMouseUp={startMapDrag}
        onTouchStart={stopMapDrag}
        onTouchEnd={startMapDrag}
        step={dayInMs}
        min={min}
        max={max}
      />
      ;
    </StyledContainer>
  );
}
