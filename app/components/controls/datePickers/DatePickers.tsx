import { Box, Typography } from "@mui/material";
import { useState, Dispatch, SetStateAction } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { fiFI } from "@mui/x-date-pickers/locales";
import "dayjs/locale/fi";
import { Period } from "../Controls";

interface DatePickersProps {
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setPeriod: Dispatch<SetStateAction<Period>>;
  setSliderValue: Dispatch<SetStateAction<number | number[]>>;
}

export default function DatePickers({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  setPeriod,
  setSliderValue,
}: DatePickersProps) {
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (newValue && endDate && newValue.isAfter(endDate)) {
      setStartDateError(
        "Aloituspäivä ei voi olla myöhemmin kuin vertailtava päivä",
      );
    } else {
      setStartDateError(null);
      setEndDateError(null);
    }

    // If the value is not null, set the period state.
    if (newValue) {
      setPeriod((prev) => ({ ...prev, start: newValue }));
      //setSliderValue(newValue.valueOf());
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);

    if (startDate && newValue && newValue.isBefore(startDate)) {
      setEndDateError(
        "Vertailtava päivä ei voi olla aikaisemmin kuin aloitupäivä",
      );
    } else {
      setStartDateError(null);
      setEndDateError(null);
    }

    if (startDate && newValue) {
      setSliderValue([startDate.valueOf(), newValue.valueOf()]);
    }
    // If the value is not null, set the period state.
    if (newValue) {
      setPeriod((prev) => ({ ...prev, end: newValue }));
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="fi"
      localeText={
        fiFI.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          margin: "5% auto",
        }}
      >
        <Typography variant="h6">Kuvien vertailu</Typography>
        <DatePicker
          value={startDate}
          label="Ensimmäinen päivämäärä"
          onChange={handleStartDateChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!startDateError,
              helperText: startDateError,
            },
          }}
        />
        <DatePicker
          value={endDate}
          label="Toinen päivämäärä"
          onChange={handleEndDateChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!endDateError,
              helperText: endDateError,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
