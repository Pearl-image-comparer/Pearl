import { Stack, styled, Typography } from "@mui/material";
import { Popup } from "react-leaflet";
import { Observation } from "./ReportDialog";
import { useEffect, useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";

interface ObservationPopupProps {
  observation: Observation;
}

export default function ObservationPopup({
  observation,
}: ObservationPopupProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (observation.picture) {
      const url = URL.createObjectURL(observation.picture);
      setImageUrl(url);

      // Clearing to avoid memory leak
      return () => URL.revokeObjectURL(url);
    }
  }, [observation.picture]);

  const StyledImage = styled("img")({
    width: "100%",
    borderRadius: "0.5rem",
    marginTop: "1rem",
  });

  return (
    <Popup>
      <Typography variant="h5">{observation.title}</Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <PlaceIcon />
        <Typography>{`${observation.longitude}, ${observation.latitude}`}</Typography>
      </Stack>
      {imageUrl && <StyledImage src={imageUrl} alt={observation.title} />}
      <Typography>{observation.description}</Typography>
    </Popup>
  );
}
