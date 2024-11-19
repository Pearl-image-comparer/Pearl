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
import type { FormEvent } from "react";

export default function ReportDialog(props: {
  open: boolean;
  onClose: () => void;
}) {
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

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      scroll="body"
      PaperProps={{
        component: "form",
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          console.log(event);
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
              />
            </Button>
          </Grid>
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
              name="lat"
              label="Leveyspiiri"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: -90, max: 90, step: 0.0001 } }}
            />
          </Grid>
          <Grid size={1}>
            <TextField
              required
              margin="dense"
              name="lon"
              label="Pituuspiiri"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: -180, max: 180, step: 0.0001 } }}
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
