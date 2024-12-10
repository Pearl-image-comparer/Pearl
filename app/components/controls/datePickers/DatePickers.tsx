import { Box, Typography } from "@mui/material";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { fiFI } from "@mui/x-date-pickers/locales";
import "dayjs/locale/fi";
import { Period } from "../Controls";
import { useTranslation } from "react-i18next";

interface DatePickersProps {
  setStartDate: Dispatch<SetStateAction<Dayjs | null>>;
  setEndDate: Dispatch<SetStateAction<Dayjs | null>>;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setPeriod: Dispatch<SetStateAction<Period>>;
  setSliderValue: Dispatch<SetStateAction<number | number[]>>;
  satelliteViewOpen: boolean;
  setSatelliteViewOpen: Dispatch<SetStateAction<boolean>>;
  comparisonViewOpen: boolean;
  setComparisonViewOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DatePickers({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  setPeriod,
  setSliderValue,
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
}: DatePickersProps) {
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [localStartDate, setLocalStartDate] = useState<Dayjs | null>(null);
  const [localEndDate, setLocalEndDate] = useState<Dayjs | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (satelliteViewOpen === false) {
      setLocalStartDate(null);
      setLocalEndDate(null);
      setPeriod({ start: dayjs("2015-10-10"), end: dayjs() });
      setStartDateError(null);
      setEndDateError(null);
    }

    if (comparisonViewOpen === true && startDate && endDate) {
      setSliderValue([startDate.valueOf(), endDate.valueOf()]);
    }
  }, [
    satelliteViewOpen,
    comparisonViewOpen,
    endDate,
    startDate,
    setSliderValue,
    setPeriod,
  ]);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    // Set the local state and the start date state.
    setLocalStartDate(newValue);
    setStartDate(newValue);

    // If the end date is set and the new start date is after the end date, set an error.
    if (newValue && endDate && newValue.isAfter(localEndDate)) {
      const error = t("startDateError");
      setStartDateError(error);
    } else {
      setStartDateError(null);
      setEndDateError(null);
    }

    // If the incoming value is not null, set the period state and the slider value.
    if (newValue) {
      setPeriod((prev) => ({ ...prev, start: newValue }));
      setSliderValue(newValue.valueOf());
      setSatelliteViewOpen(true);
      setStartDate(newValue);
    }

    // If the incoming value is null, set the start date state and
    //close the satellite view and comparison view.
    //Update the period state and set the slider value.
    if (newValue == null) {
      setSatelliteViewOpen(false);
      setComparisonViewOpen(false);
      setEndDate(dayjs());
      setLocalEndDate(null);
      setSliderValue(dayjs().valueOf());
      setPeriod((prev) => ({ ...prev, start: dayjs("2015-10-10") }));
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    // Set the local state and the end date state.
    setLocalEndDate(newValue);
    setEndDate(newValue);

    // If the start date is set and the new end date is before the start date,
    //set an error.
    if (startDate && newValue && newValue.isBefore(localStartDate)) {
      const error = t("endDateError");
      setEndDateError(error);
    } else {
      setStartDateError(null);
      setEndDateError(null);
    }

    // If the start date and the new end date are set,
    //set the slider value and open the comparison view.
    if (startDate && newValue) {
      setSliderValue([startDate.valueOf(), newValue.valueOf()]);
      setComparisonViewOpen(true);
    }
    // If the value is not null, set the period state.
    // Update period state and set the slider value.
    if (newValue != null) {
      setPeriod((prev) => ({ ...prev, end: newValue }));
      setEndDate(newValue);
    } else {
      setPeriod((prev) => ({ ...prev, end: dayjs() }));
      setComparisonViewOpen(false);
      setEndDate(dayjs());

      if (startDate) {
        setSliderValue(startDate.valueOf());
      }
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
        <Typography variant="h6">{t("datePickerTitle")}</Typography>
        <DatePicker
          value={localStartDate}
          label={t("datePickerOne")}
          onAccept={handleStartDateChange}
          onChange={() => true}
          minDate={dayjs("2015-10-10")}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!startDateError,
              helperText: startDateError,
            },
            field: {
              clearable: true,
              onClear: () => handleStartDateChange(null),
            },
          }}
        />
        <DatePicker
          value={localEndDate}
          label={t("datePickerTwo")}
          onAccept={handleEndDateChange}
          onChange={() => true}
          minDate={dayjs("2015-10-10")}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!endDateError,
              helperText: endDateError,
            },
            field: {
              clearable: true,
              onClear: () => handleEndDateChange(null),
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
