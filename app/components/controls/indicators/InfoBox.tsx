import { Alert, Box, CircularProgress, styled } from "@mui/material";

type InfoBoxType = "loading" | "error";

export interface InfoBoxProps {
  text: string;
  type?: InfoBoxType;
}

export default function InfoBox({ text, type = "loading" }: InfoBoxProps) {
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
    <StyledBox>
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
