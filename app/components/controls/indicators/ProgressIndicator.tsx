import { Alert, Box, CircularProgress, styled } from "@mui/material";

interface ProgressIndicatorProps {
  text: string;
}

export default function ProgressIndicator({ text }: ProgressIndicatorProps) {
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
      <Alert
        severity="info"
        icon={<CircularProgress size={20} />}
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        {text}
      </Alert>
    </StyledBox>
  );
}
