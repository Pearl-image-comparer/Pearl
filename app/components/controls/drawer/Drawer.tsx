import {
    Drawer,
    styled,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import { useState } from "react";

const DrawerContainer = styled("div")(({ theme }) => ({
    position: "absolute",
    zIndex: 1000,
    [theme.breakpoints.down("sm")]: {
        left: "50%",
        bottom: theme.spacing(2),
        transform: "translateX(-50%)",
    },
    [theme.breakpoints.up("md")]: {
        left: theme.spacing(2),
        top: "50%",
        transform: "translateY(-50%)",
    },
}));

const ButtonContainer = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

export default function MenuDrawer() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };
    return (
        <DrawerContainer>
            {/* TODO remove this demo button that opens the drawer */}
            <ButtonContainer>
                <IconButton
                    onClick={toggleDrawer(true)}
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
                anchor={isMobile ? "bottom" : "left"}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <div style={{ width: isMobile ? "100%" : 250, padding: 16 }}>
                    <h3>Menu</h3>
                    <p>Drawer Content</p>
                </div>
            </Drawer>
        </DrawerContainer>
    );
}
