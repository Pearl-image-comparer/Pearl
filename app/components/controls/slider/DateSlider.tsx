import { Container, Slider, styled, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMap } from "react-leaflet";

interface DateSliderProps {
  value: number | number[];
  onChange: (e: Event, value: number | number[]) => void;
  min: number;
  max: number;
}

// Renders a basic slider (one handle) if value prop holds a single number value
// or a range slider (two handles) if value prop holds array of two numbers
export default function DateSlider({
  value,
  onChange,
  min,
  max,
}: DateSliderProps) {
  const map = useMap();

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
            ? dayjs(min).toISOString().split("T")[0]
            : dayjs(value[0]).toISOString().split("T")[0]}
        </Typography>
        <Typography color="white" variant="h6">
          {typeof value === "number"
            ? dayjs(value).toISOString().split("T")[0]
            : dayjs(value[1]).toISOString().split("T")[0]}
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
