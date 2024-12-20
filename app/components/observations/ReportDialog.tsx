import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { LatLng } from "leaflet";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { action } from "~/routes/observations";
import { useTranslation } from "react-i18next";

export interface Observation {
  picture: File | null;
  title: string;
  latitude: number;
  longitude: number;
  description: string;
}

export default function ReportDialog(props: {
  isOpen: boolean;
  location: LatLng | null;
  onClose: () => void;
}) {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation();

  const [picture, setPicture] = useState<File | null>(null);
  const pictureUrl = useMemo(
    () => picture && URL.createObjectURL(picture),
    [picture],
  );

  // Reset picture when dialog is opened again.
  useEffect(() => {
    if (props.isOpen) setPicture(null);
  }, [props.isOpen]);

  const StyledDialogTitle = styled(DialogTitle)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const Picture = styled("img")({
    width: "100%",
    borderRadius: 10,
  });

  // Hide the arrows on number inputs.
  const StyledNumberInput = styled(TextField)({
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
  });

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      scroll="body"
      PaperProps={{
        component: fetcher.Form,
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          if (picture) data.set("picture", picture);
          fetcher.submit(data, {
            method: "POST",
            action: "/observations",
            encType: "multipart/form-data",
          });
          // Close after submission.
          props.onClose();
        },
      }}
    >
      <StyledDialogTitle>
        {t("reportDialogTitle")}
        <IconButton onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          {t("reportLoadImage")}
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            capture="environment"
            name="picture"
            onChange={(event) => {
              const file = event.currentTarget.files?.item(0);
              if (file) setPicture(file);
            }}
          />
        </Button>
        {pictureUrl && (
          <Picture src={pictureUrl} alt="Ladattu kuva" sx={{ mt: 2 }} />
        )}
        <TextField
          required
          margin="dense"
          name="title"
          label={t("reportTitle")}
          fullWidth
          sx={{ mt: 2, mb: 1 }}
        />
        <Stack spacing={1} direction="row" sx={{ my: 1 }}>
          <StyledNumberInput
            required
            margin="dense"
            name="latitude"
            label={t("reportLatitude")}
            type="number"
            fullWidth
            defaultValue={props.location?.lat}
            slotProps={{ htmlInput: { min: -90, max: 90, step: 1e-16 } }}
          />
          <StyledNumberInput
            required
            margin="dense"
            name="longitude"
            label={t("reportLongitude")}
            type="number"
            fullWidth
            defaultValue={props.location?.lng}
            slotProps={{ htmlInput: { min: -180, max: 180, step: 1e-16 } }}
          />
        </Stack>
        <TextField
          required
          margin="dense"
          name="description"
          label={t("reportDescription")}
          fullWidth
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="submit">
          {t("reportSubmit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
