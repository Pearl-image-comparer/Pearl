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
import LayerControl from "../layerControl/LayerControl";

const DrawerWidth = 250;
const drawerBleeding = 60;

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
  setIsDrawerOpen: (open: boolean) => void;
  isMobile: boolean;
}

export default function MenuDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  isMobile,
}: MenuDrawerProps) {
  // Toggle function to open/close the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Handling the map drag when menu open
  const map = useMap();
  const stopMapDrag = () => map.dragging.disable();
  const startMapDrag = () => map.dragging.enable();

  return (
    <>
      {isMobile ? (
        <SwipeableDrawerStyled
          anchor="bottom"
          open={isDrawerOpen}
          onClose={() => toggleDrawer()}
          onOpen={() => toggleDrawer()}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{ keepMounted: true }}
          onMouseDown={stopMapDrag}
          onMouseUp={startMapDrag}
          onTouchStart={stopMapDrag}
          onTouchEnd={startMapDrag}
          sx={{
            "& .MuiDrawer-paper": {
              height: "50%",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -drawerBleeding / 2,
              right: 0,
              left: 0,
              height: drawerBleeding,
              backgroundColor: "background.paper",
              textAlign: "center",
              visibility: "visible",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <DragHandleRoundedIcon />
          </Box>
          <Box sx={{ padding: 2, height: "100%" }}>
            <LayerControl />
          </Box>
        </SwipeableDrawerStyled>
      ) : (
        <SwipeableDrawerStyledDesktop
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
            "& .MuiDrawer-paper": {
              width: DrawerWidth,
              height: "100vh",
            },
          }}
          onMouseDown={stopMapDrag}
          onMouseUp={startMapDrag}
          onTouchStart={stopMapDrag}
          onTouchEnd={startMapDrag}
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
            }}
          >
            <IconButton onClick={() => toggleDrawer()}>
              <DragIndicatorIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <LayerControl />
          </Box>
        </SwipeableDrawerStyledDesktop>
      )}
    </>
  );
}
