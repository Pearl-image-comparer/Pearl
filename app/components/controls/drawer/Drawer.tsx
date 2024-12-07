import {
  Drawer,
  SwipeableDrawer,
  styled,
  Box,
  IconButton,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";
import { useMap } from "react-leaflet";
import LayerControl, { LayerKey } from "../layerControl/LayerControl";
import DatePickers from "../datePickers/DatePickers";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Period } from "../Controls";
import { LoadingState } from "~/components/map/_MapComponent.client";
import L from "leaflet";
import { DRAWER_BLEEDING, DRAWER_WIDTH } from "~/constants";

//mobile drawer
const SwipeableDrawerStyled = styled(SwipeableDrawer)(() => ({
  "& .MuiDrawer-paper": {
    overflowY: "visible",
  },
}));

// desktop drawer
const SwipeableDrawerStyledDesktop = styled(Drawer)(() => ({
  "& .MuiDrawer-paper": {
    overflowY: "visible",
  },
}));

interface MenuDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  setStartDate: Dispatch<SetStateAction<Dayjs | null>>;
  setEndDate: Dispatch<SetStateAction<Dayjs | null>>;
  setPeriod: Dispatch<SetStateAction<Period>>;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  overlayVisibility: Record<LayerKey, boolean>;
  setOverlayVisibility: Dispatch<SetStateAction<Record<LayerKey, boolean>>>;
  setSliderValue: Dispatch<SetStateAction<number | number[]>>;
  setFetchingEnabled: Dispatch<SetStateAction<LoadingState>>;
  setFetchingError: Dispatch<SetStateAction<string | null>>;
}

export default function MenuDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  isMobile,
  setPeriod,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  overlayVisibility,
  setOverlayVisibility,
  setSliderValue,
  setFetchingEnabled,
  setFetchingError,
}: MenuDrawerProps) {
  // Toggle function to open/close the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  });

  // Handling the map drag when menu open
  const map = useMap();
  const stopMapDrag = () => map.dragging.disable();
  const startMapDrag = () => map.dragging.enable();

  return (
    <Box
      onMouseDown={stopMapDrag}
      onMouseUp={startMapDrag}
      onTouchStart={stopMapDrag}
      onTouchEnd={startMapDrag}
      sx={{ display: "contents" }}
    >
      {isMobile ? (
        <SwipeableDrawerStyled
          anchor="bottom"
          open={isDrawerOpen}
          onClose={() => toggleDrawer()}
          onOpen={() => toggleDrawer()}
          swipeAreaWidth={DRAWER_BLEEDING}
          disableSwipeToOpen={false}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              height: "50%",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -DRAWER_BLEEDING / 2,
              right: 0,
              left: 0,
              height: DRAWER_BLEEDING,
              backgroundColor: "background.paper",
              textAlign: "center",
              visibility: "visible",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            {" "}
            <IconButton onClick={toggleDrawer}>
              <DragHandleRoundedIcon />
            </IconButton>
          </Box>
          <Box
            ref={containerRef}
            sx={{ padding: 2, height: "100%", overflowY: "auto" }}
          >
            <DatePickers
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
              setPeriod={setPeriod}
              setSliderValue={setSliderValue}
            />
            <LayerControl
              overlayVisibility={overlayVisibility}
              setOverlayVisibility={setOverlayVisibility}
              setFetchingEnabled={setFetchingEnabled}
              setFetchingError={setFetchingError}
            />
          </Box>
        </SwipeableDrawerStyled>
      ) : (
        <SwipeableDrawerStyledDesktop
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              height: "100vh",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: -40,
              width: 40,
              height: "20%",
              backgroundColor: "background.paper",
              visibility: "visible",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              transform: "translateY(-50%)",
              boxShadow: "0.5px 0px 0px 0.5px rgba(0,0,0,0.25)",
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <DragIndicatorIcon />
            </IconButton>
          </Box>

          <Box
            ref={containerRef}
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              overflowY: "auto",
            }}
          >
            <DatePickers
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
              setPeriod={setPeriod}
              setSliderValue={setSliderValue}
            />
            <LayerControl
              overlayVisibility={overlayVisibility}
              setOverlayVisibility={setOverlayVisibility}
              setFetchingEnabled={setFetchingEnabled}
              setFetchingError={setFetchingError}
            />
          </Box>
        </SwipeableDrawerStyledDesktop>
      )}
    </Box>
  );
}
