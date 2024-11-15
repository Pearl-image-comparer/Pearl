import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const bounds = url.searchParams.get("bounds");
  const accessToken = process.env.LAJI_ACCESS_TOKEN;

  if (!bounds || !accessToken) {
    console.error("Missing bounds or access token.");
    return json(
      { data: [], message: "Missing required bounds or access token" },
      { status: 400 },
    );
  }

  const [southLat, northLat, westLng, eastLng] = bounds.split(":");

  try {
    const response = await fetch(
      `https://api.laji.fi/v0/warehouse/query/unit/list?wgs84CenterPoint=${southLat}:${northLat}:${westLng}:${eastLng}:WGS84&redListStatusId=MX.iucnEN,MX.iucnCR,MX.iucnVU,MX.iucnNT&pageSize=10&access_token=${accessToken}`,
    );

    if (!response.ok) {
      console.error("Network response was not ok.");
      throw new Error("Failed to fetch data from Laji API");
    }

    const data = await response.json();
    return json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return json(
      {
        data: [],
        message: "Error fetching data from API",
      },
      { status: 500 },
    );
  }
};
