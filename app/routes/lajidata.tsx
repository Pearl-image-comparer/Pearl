import { json, LoaderFunction } from "@remix-run/node";
import { LatLngExpression } from "leaflet";

export interface Sighting {
  finnishName: string;
  latinName: string;
  sightingTime: string;
  coordinates: LatLngExpression;
  endangerment: string;
}
interface LajiApiResponse {
  results: Array<{
    gathering: {
      conversions: {
        wgs84CenterPoint: {
          lat: number;
          lon: number;
        };
      };
      displayDateTime: string;
    };
    unit: {
      linkings: {
        taxon: {
          latestRedListStatusFinland: {
            status: string;
          };
          scientificName: string;
          nameFinnish: string;
        };
      };
    };
  }>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const bounds = url.searchParams.get("bounds");
  const accessToken = process.env.LAJI_ACCESS_TOKEN;

  if (!bounds) {
    console.error("Missing bounds");
    return json(
      { data: [], message: "Missing required bounds" },
      { status: 400 },
    );
  }
  if (!accessToken) {
    console.error("Missing access token");
    return json({ data: [], message: "Missing access token" }, { status: 500 });
  }

  const [southLat, northLat, westLng, eastLng] = bounds.split(":");

  function isValidLatitude(lat: string) {
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
  }

  function isValidLongitude(lng: string) {
    const num = parseFloat(lng);
    return !isNaN(num) && num >= -180 && num <= 180;
  }

  if (
    !isValidLatitude(southLat) ||
    !isValidLatitude(northLat) ||
    !isValidLongitude(westLng) ||
    !isValidLongitude(eastLng)
  ) {
    throw new Error("Invalid bounds provided");
  }

  const queryParams = new URLSearchParams({
    selected:
      "gathering.conversions.wgs84CenterPoint.lat,gathering.conversions.wgs84CenterPoint.lon,gathering.displayDateTime,unit.linkings.taxon.scientificName,unit.linkings.taxon.nameFinnish,unit.linkings.taxon.latestRedListStatusFinland.status",
    wgs84CenterPoint: `${encodeURIComponent(southLat)}:${encodeURIComponent(northLat)}:${encodeURIComponent(westLng)}:${encodeURIComponent(eastLng)}:WGS84`,
    redListStatusId: "MX.iucnEN,MX.iucnCR,MX.iucnVU,MX.iucnNT",
    pageSize: "1000",
    access_token: accessToken,
  });

  const api = `https://api.laji.fi/v0/warehouse/query/unit/list?includeSubTaxa=true&includeNonValidTaxa=true&time=-3653%2F0&${queryParams}`;

  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch data from Laji API");
    }
    const data: LajiApiResponse = await response.json();
    // Filtering out incomplete data
    const sightings: Sighting[] = data.results
      .filter((item) => item.unit && item.gathering)
      .map((item) => ({
        finnishName: item.unit.linkings.taxon.nameFinnish,
        latinName: item.unit.linkings.taxon.scientificName,
        sightingTime: item.gathering.displayDateTime,
        coordinates: [
          item.gathering.conversions.wgs84CenterPoint.lat,
          item.gathering.conversions.wgs84CenterPoint.lon,
        ],
        endangerment: item.unit.linkings.taxon.latestRedListStatusFinland.status
      })
    );
    return json(sightings);
  } catch (error) {
    console.error(error);
    return json(
      { data: [], message: "An error occurred while processing the data" },
      { status: 500 },
    );
  }
};
