import {
  Autocomplete,
  debounce,
  Paper,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-leaflet";

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
                name: properties.name,
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
      noOptionsText="No locations"
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
          placeholder="Search for a place"
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

interface SearchBarProps {
  isDrawerOpen: boolean;
  isMobile: boolean;
}

export default function SearchBar({ isDrawerOpen, isMobile }: SearchBarProps) {
  const theme = useTheme();

  const StyledPaper = styled(Paper)({
    position: "absolute",
    top: "0.7rem",
    left: isMobile || !isDrawerOpen ? "0.7rem" : `${250 + theme.spacing(1)}px`, // 250 + 50 = drawer+bleeding width
    width:
      isMobile || !isDrawerOpen
        ? "calc(100% - 1.4rem)"
        : `calc(100% - ${250 + 16}px)`, // Subtract drawer width + margins
    right: "0.7rem",
    zIndex: 1000,
  });

  return (
    <StyledPaper>
      <LocationSearch />
    </StyledPaper>
  );
}
