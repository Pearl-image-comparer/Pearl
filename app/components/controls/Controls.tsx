import {
  Container,
  debounce,
  styled,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import SearchBar from "./searchbar/SearchBar";
import Fabs, { type ControlsFabsProps } from "./fabs/Fabs";
import DateSlider from "./slider/DateSlider";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs, { Dayjs } from "dayjs";
import MenuDrawer from "./drawer/Drawer";
import { LayerKey } from "./layerControl/LayerControl";
import { LoadingState } from "~/components/map/_MapComponent.client";
import InfoBox from "./indicators/InfoBox";
import { DRAWER_WIDTH, WINDOW_HEIGHT_MIN_THRESHOLD } from "~/constants";

export interface Period {
  start: Dayjs;
  end: Dayjs;
}

export interface ControlsProps {
  period: Period;
  setPeriod: Dispatch<SetStateAction<Period>>;
  setStartDate: Dispatch<SetStateAction<Dayjs | null>>;
  setEndDate: Dispatch<SetStateAction<Dayjs | null>>;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  overlayVisibility: Record<LayerKey, boolean>;
  setOverlayVisibility: Dispatch<SetStateAction<Record<LayerKey, boolean>>>;
  loading: LoadingState;
  setFetchingEnabled: Dispatch<SetStateAction<LoadingState>>;
  satelliteViewOpen: boolean;
  comparisonViewOpen: boolean;
}

export default function Controls({
  satelliteViewOpen,
  setSatelliteViewOpen,
  comparisonViewOpen,
  setComparisonViewOpen,
  period,
  setPeriod,
  setStartDate,
  setEndDate,
  onAddClick,
  startDate,
  endDate,
  overlayVisibility,
  setOverlayVisibility,
  setUserLocation,
  loading,
  setFetchingEnabled,
}: ControlsFabsProps & ControlsProps) {
  // Uses current day by default
  const [sliderValue, setSliderValue] = useState<number | number[]>(
    dayjs().valueOf(),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SharedContainer = styled(Box)({
    position: "absolute",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "0.7rem",
    paddingBottom: isMobile
      ? "2.5rem"
      : satelliteViewOpen || comparisonViewOpen
        ? "1.5rem"
        : "3.8rem",
    right: 0,
    width:
      isMobile || !isDrawerOpen ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`, // Subtract drawer width
    transition: "all 1s",
    pointerEvents: "none",
  });

  const BottomContainer = styled(Box)({
    width: "100%",
    display: "flex",
    justifyContent: "end",
    flexDirection:
      windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD ? "row-reverse" : "column",
    alignItems: "end",
    gap: windowHeight <= WINDOW_HEIGHT_MIN_THRESHOLD ? 0 : "2rem",
  });

  // Debounce wms tile fetching on slider change
  const debounceSliderInput = useMemo(
    () =>
      debounce((value: number | number[]) => {
        if (Array.isArray(value)) {
          setStartDate(dayjs(value[0]));
          setEndDate(dayjs(value[1]));
        } else {
          setEndDate(dayjs(value));
        }
      }, 400),
    [setEndDate, setStartDate],
  );

  const handleSliderChange = (
    event: Event | SyntheticEvent<Element, Event>,
    value: number | number[],
  ) => {
    setSliderValue(value);
    debounceSliderInput(value);
  };

  return (
    <Container>
      <MenuDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        isMobile={isMobile}
        setPeriod={setPeriod}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
        overlayVisibility={overlayVisibility}
        setOverlayVisibility={setOverlayVisibility}
        setSliderValue={setSliderValue}
        setFetchingEnabled={setFetchingEnabled}
        setFetchingError={setFetchingError}
        satelliteViewOpen={satelliteViewOpen}
        setSatelliteViewOpen={setSatelliteViewOpen}
        comparisonViewOpen={comparisonViewOpen}
        setComparisonViewOpen={setComparisonViewOpen}
      />
      <SharedContainer>
        <Box>
          <SearchBar />
          {(loading.sightings || loading.observations) && (
            <InfoBox
              text={
                loading.sightings && loading.observations
                  ? "Loading data"
                  : loading.sightings
                    ? "Loading sighting data"
                    : "Loading observation data"
              }
            />
          )}
          {fetchingError && <InfoBox text={fetchingError} type="error" />}
        </Box>
        <BottomContainer>
          <Fabs
            satelliteViewOpen={satelliteViewOpen}
            comparisonViewOpen={comparisonViewOpen}
            setSatelliteViewOpen={setSatelliteViewOpen}
            setComparisonViewOpen={setComparisonViewOpen}
            onAddClick={onAddClick}
            setUserLocation={setUserLocation}
            windowHeight={windowHeight}
            isMobile={isMobile}
            setEndDate={setEndDate}
            setSliderValue={setSliderValue}
            sliderValue={sliderValue}
          />
          {satelliteViewOpen && (
            <DateSlider
              value={sliderValue}
              onChange={handleSliderChange}
              min={period.start.valueOf()}
              max={period.end.valueOf()}
              windowHeight={windowHeight}
              isMobile={isMobile}
            />
          )}
        </BottomContainer>
      </SharedContainer>
    </Container>
  );
}
