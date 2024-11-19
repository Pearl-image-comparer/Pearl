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
  Grid2 as Grid,
  IconButton,
  styled,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState, type FormEvent } from "react";

export interface Observation {
  picture: File | null;
  title: string;
  latitude: number;
  longitude: number;
  description: string;
}

export default function ReportDialog(props: {
  open: boolean;
  onClose: () => void;
  onSubmit: (observation: Observation) => void;
}) {
  const [picture, setPicture] = useState<File | null>(null);
  const pictureUrl = useMemo(
    () => picture && URL.createObjectURL(picture),
    [picture],
  );

  // Reset picture when dialog is opened again.
  useEffect(() => {
    if (props.open) setPicture(null);
  }, [props.open]);

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

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      scroll="body"
      PaperProps={{
        component: "form",
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          props.onSubmit({
            picture,
            title: data.get("title") as string,
            latitude: Number(data.get("latitude") as string),
            longitude: Number(data.get("longitude") as string),
            description: data.get("description") as string,
          });
          // Close after submission.
          props.onClose();
        },
      }}
    >
      <StyledDialogTitle>
        Raportoi havainnosta
        <IconButton onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <Grid container spacing={2} columns={2}>
          <Grid size={2}>
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Lataa kuva
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
          </Grid>
          {pictureUrl && (
            <Grid size={2}>
              <Picture src={pictureUrl} alt="Ladattu kuva" />
            </Grid>
          )}
          <Grid size={2}>
            <TextField
              required
              margin="dense"
              name="title"
              label="Otsikko"
              fullWidth
            />
          </Grid>
          <Grid size={1}>
            <TextField
              required
              margin="dense"
              name="latitude"
              label="Leveyspiiri"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: -90, max: 90, step: 1e-12 } }}
            />
          </Grid>
          <Grid size={1}>
            <TextField
              required
              margin="dense"
              name="longitude"
              label="Pituuspiiri"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: -180, max: 180, step: 1e-12 } }}
            />
          </Grid>
          <Grid size={2}>
            <TextField
              required
              margin="dense"
              name="description"
              label="Kuvaus"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="submit">
          Lähetä
        </Button>
      </DialogActions>
    </Dialog>
  );
}
