import { Stack, Typography } from "@mui/material";
import { Popup } from "react-leaflet";
import { Sighting } from "~/routes/lajidata";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";

interface SightingPopupProps {
  sighting: Sighting;
}

export default function SightingPopup({ sighting }: SightingPopupProps) {
  const capitalizeName = (name: string) => {
    if (name) {
      return name[0].toUpperCase() + name.slice(1, name.length);
    }
    return name;
  };

  const generateReadableEndangerment = (endangerment: string) => {
    if (endangerment.includes("MX.iucnCR")) return "Äärimmäisen uhanalaiset";
    if (endangerment.includes("MX.iucnEN")) return "Erittäin uhanalaiset";
    if (endangerment.includes("MX.iucnVU")) return "Vaarantuneet";
    if (endangerment.includes("MX.iucnNT")) return "Silmälläpidettävät";
    return "Ei tiedossa";
  };

  return (
    <Popup>
      <Typography variant="h5">
        {capitalizeName(sighting.finnishName)}
      </Typography>
      <Typography variant="h6">{sighting.latinName}</Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ marginTop: "0.5rem" }}
      >
        <PlaceIcon />
        <Typography>{sighting.coordinates.toString()}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ReportProblemIcon />
        <Typography>
          {generateReadableEndangerment(sighting.endangerment)}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <CalendarMonthIcon />
        <Typography>{sighting.sightingTime}</Typography>
      </Stack>
    </Popup>
  );
}
