import { json, LoaderFunction } from "@remix-run/node";

interface Sighting {
  finnishName: string;
  latinName: string;
  sightingTime: Date;
  coordinates: string;
  endangerment: string;
}
interface LajiApiResponse {
  results: Array<{
    unit: {
      linkings: {
        taxon: {
          nameFinnish: string;
          scientificName: string;
          latestRedListStatusFinland: string;
        };
        originalTaxon: {
          latestRedListStatusFinland: string;
        };
      };
    };
    gathering: {
      displayDateTime: Date;
    };
    document: {
      namedPlace: {
        wgs84CenterPoint: string;
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
    wgs84CenterPoint: `${encodeURIComponent(southLat)}:${encodeURIComponent(northLat)}:${encodeURIComponent(westLng)}:${encodeURIComponent(eastLng)}:WGS84`,
    redListStatusId: "MX.iucnEN,MX.iucnCR,MX.iucnVU,MX.iucnNT",
    pageSize: "1000",
    access_token: accessToken,
  });

  const api = `https://api.laji.fi/v0/warehouse/query/unit/list?selected=document.namedPlace.wgs84CenterPoint.lat%2Cdocument.namedPlace.wgs84CenterPoint.lon%2Cgathering.displayDateTime%2Cunit.identifications.linkings.taxon.latestRedListStatusFinland.status%2Cunit.identifications.linkings.taxon.latestRedListStatusFinland.year%2Cunit.identifications.linkings.taxon.nameFinnish%2Cunit.linkings.originalTaxon.latestRedListStatusFinland.status%2Cunit.linkings.originalTaxon.latestRedListStatusFinland.year%2Cunit.linkings.taxon.latestRedListStatusFinland.status%2Cunit.linkings.taxon.latestRedListStatusFinland.year%2Cunit.linkings.taxon.nameFinnish%2Cunit.linkings.taxon.scientificName&includeSubTaxa=true&includeNonValidTaxa=true&time=-3653%2F0&${queryParams}`;

  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch data from Laji API");
    }
    const data: LajiApiResponse = await response.json();
    const sightings: Sighting[] = data.results.map((item) => ({
      finnishName: item.unit?.linkings?.taxon.nameFinnish,
      latinName: item.unit?.linkings?.taxon?.scientificName,
      sightingTime: item.gathering?.displayDateTime,
      coordinates: item.document?.namedPlace.wgs84CenterPoint,
      endangerment:
        item.unit?.linkings.originalTaxon.latestRedListStatusFinland,
    }));
    return json({ data: sightings });
  } catch (error) {
    console.error(error);
    return json(
      { data: [], message: "An error occurred while processing the data" },
      { status: 500 },
    );
  }
};
