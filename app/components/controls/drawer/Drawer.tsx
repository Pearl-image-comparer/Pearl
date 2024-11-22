import {
    Drawer,
    SwipeableDrawer,
    styled,
    Box,
    IconButton,
    useMediaQuery,
    useTheme,
    List,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useMap } from "react-leaflet";
import LayerControl from "../layerControl/LayerControl";

//TODO decide the correct width of drawer
const DrawerWidth = 250;

//TODO refactor to a better menu opening button
//Button container for the temporary opening logic for the drawer
const ButtonContainer = styled("div")(({ theme }) => ({
    position: "fixed",
    zIndex: 1200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
        left: "50%",
        bottom: theme.spacing(2),
        transform: "translateX(-50%)",
    },
    [theme.breakpoints.up("sm")]: {
        left: theme.spacing(2),
        top: "50%",
        transform: "translateY(-50%)",
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
    const toggleDrawer = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    // Handling the map drag when menu open
    const map = useMap();
    const stopMapDrag = () => map.dragging.disable();
    const startMapDrag = () => map.dragging.enable();

    return (
        <>
            <ButtonContainer>
                <IconButton
                    onClick={() => toggleDrawer(true)}
                    color="primary"
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        "&:hover": {
                            backgroundColor: "primary.dark",
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </ButtonContainer>

            <Drawer
                variant="persistent"
                anchor={isMobile ? "bottom" : "left"}
                open={isDrawerOpen}
                onMouseDown={stopMapDrag}
                onMouseUp={startMapDrag}
                onTouchStart={stopMapDrag}
                onTouchEnd={startMapDrag}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: isMobile ? "100%" : DrawerWidth,
                        height: isMobile ? "50%" : "100vh", //TODO decide the drawer height on mobile
                        bottom: isMobile ? 0 : "unset",
                        left: isMobile ? "unset" : 0,
                    },
                }}
            >
                <Box
                    sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <IconButton
                        onClick={() => toggleDrawer(false)}
                        sx={{
                            alignSelf: "flex-end",
                            marginBottom: 2,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <LayerControl />
                </Box>
            </Drawer>
        </>
    );
}
