import { Alert, Box, CircularProgress, styled } from "@mui/material";
import { useEffect, useRef } from "react";
import L from "leaflet";

type InfoBoxType = "loading" | "error";

export interface InfoBoxProps {
  text: string;
  type?: InfoBoxType;
}

export default function InfoBox({ text, type = "loading" }: InfoBoxProps) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) L.DomEvent.disableClickPropagation(boxRef.current);
  });

  const StyledBox = styled(Box)({
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "end",
    paddingRight: "0.9rem",
    width: "100%",
    top: "4rem",
    zIndex: 1000,
    left: 0,
  });

  return (
    <StyledBox ref={boxRef}>
      {type === "loading" ? (
        <Alert
          severity="info"
          icon={<CircularProgress size={20} />}
          sx={{ bgcolor: "background.paper", color: "text.primary" }}
        >
          {text}
        </Alert>
      ) : (
        <Alert severity="error">{text}</Alert>
      )}
    </StyledBox>
  );
}
