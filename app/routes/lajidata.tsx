import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const bounds = url.searchParams.get("bounds");
  const accessToken = process.env.LAJI_ACCESS_TOKEN;

  if (!bounds || !accessToken) {
    console.error("Missing bounds or access token.");
    return json(
      { data: [], message: "Missing required bounds or access token" },
      { status: 400 }
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
    pageSize: "10",
    access_token: accessToken,
  });

  const api = `https://api.laji.fi/v0/warehouse/query/unit/list?${queryParams.toString()}`;

  const response = await fetch(api);

  if (!response.ok) {
    console.error("Network response was not ok.");
    throw new Error("Failed to fetch data from Laji API");
  }
  const data = await response.json();
  return data;
};
