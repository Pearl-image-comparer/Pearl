import {
    Drawer,
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

//TODO descide the correct width of drawer
const DrawerWidth = 250;

//TODO to be removed once the correct opening logic is implemented
//Button container for the temporary opening logic for the drawer
const ButtonContainer = styled("div")(({ theme }) => ({
    position: "fixed",
    zIndex: 900,
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

export default function MenuDrawer() {
    /**
     * TODO isDrawerOpen and toggleDrawer propably need to be moved to a parent component
     * once additional logic is implemented for drawer opening, like satellite comparison
     */
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // Toggle function to open/close the drawer
    const toggleDrawer = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

                    <h3>Menu</h3>
                    <p>Drawer Content</p>
                </Box>
            </Drawer>
        </>
    );
}
