import { Stack, Typography } from "@mui/material";
import { Popup } from "react-leaflet";
import { Sighting } from "~/routes/lajidata";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import { useTranslation } from "react-i18next";

interface SightingPopupProps {
  sighting: Sighting;
}

export default function SightingPopup({ sighting }: SightingPopupProps) {
  const { t } = useTranslation();
  const capitalizeName = (name: string) => {
    if (name) {
      return name[0].toUpperCase() + name.slice(1, name.length);
    }
    return name;
  };

  const generateReadableEndangerment = (endangerment: string) => {
    if (endangerment.includes("MX.iucnCR")) return t("extremelyEndangered");
    if (endangerment.includes("MX.iucnEN")) return t("highlyEndangered");
    if (endangerment.includes("MX.iucnVU")) return t("vulnerable");
    if (endangerment.includes("MX.iucnNT")) return t("nearThreatened");
    return t("unknown");
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
