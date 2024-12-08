import {
  Autocomplete,
  debounce,
  Paper,
  styled,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useTranslation } from "react-i18next";

interface Location {
  id: number;
  name: string;
  lng: number;
  lat: number;
}

// These are the result types for the GISCO API.
interface Geometry {
  coordinates: number[];
  type: string;
}
interface Properties {
  osm_id: number;
  osm_type: string;
  extent: number[];
  country: string;
  osm_key: string;
  city: string;
  countrycode: string;
  osm_value: string;
  name: string;
  county: string;
  state: string;
  type: string;
}
interface Feature {
  geometry: Geometry;
  type: string;
  properties: Properties;
}

// This is required to be it's own component or otherwise the states do some funky stuff.
function LocationSearch() {
  const [value, setValue] = useState<Location | null>(null);
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<readonly Location[]>([]);
  const map = useMap();

  // Limit how quickly requests can be made with debounce.
  const locationFetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly Location[]) => void,
        ) => {
          const params = new URLSearchParams({
            q: request.input,
            limit: "10",
          });
          // Fetch requested locations using the GISCO API.
          fetch(`https://gisco-services.ec.europa.eu/api/?${params}`)
            .then((response) => response.json())
            // Convert to the location format.
            .then((data) =>
              (data.features as Feature[]).map(({ geometry, properties }) => ({
                lng: geometry.coordinates[0],
                lat: geometry.coordinates[1],
                id: properties.osm_id,
                name: [properties.name, properties.city, properties.country]
                  .filter(Boolean)
                  .join(", "),
              })),
            )
            // Filter out duplicate results.
            .then((result) =>
              result.filter(
                ({ id: filterId }, index, arr) =>
                  arr.findIndex(({ id }) => id === filterId) === index,
              ),
            )
            .then(callback);
        },
        400,
      ),
    [],
  );

  const { t } = useTranslation();


  useEffect(() => {
    let active = true;

    if (input.length === 0) {
      setOptions(value ? [value] : []);
      return;
    }

    // Fetch new locations when input changes.
    locationFetch({ input }, (results) => {
      if (active) {
        let newOptions: readonly Location[] = [];

        if (value) newOptions = [value];

        if (results) newOptions = [...newOptions, ...results];

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, input, locationFetch]);

  return (
    <Autocomplete
      id="location-search"
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText={t("searchBarNoOptions")}
      onChange={(_, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue)
          map.panTo(
            { lat: newValue.lat, lng: newValue.lng },
            { animate: true },
          );
      }}
      onInputChange={(_, newInput) => setInput(newInput)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("searchBar")}
          size="small"
          slotProps={{
            input: {
              ...params.InputProps,
              type: "search",
              startAdornment: <SearchIcon />,
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const { ...optionProps } = props;

        // TODO: Make this more robust.
        return (
          <li {...optionProps} key={option.id}>
            {option.name}
          </li>
        );
      }}
    />
  );
}

export default function SearchBar() {
  const paperRef = useRef(null);

  useEffect(() => {
    if (paperRef.current) L.DomEvent.disableClickPropagation(paperRef.current);
  });

  const StyledPaper = styled(Paper)({
    pointerEvents: "auto",
  });

  return (
    <StyledPaper ref={paperRef}>
      <LocationSearch />
    </StyledPaper>
  );
}
