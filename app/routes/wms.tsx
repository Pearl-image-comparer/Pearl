import type { LoaderFunctionArgs } from "@remix-run/node";
import cache from "~/utils/cache.server";
import crypto from "crypto";

export async function loader(params: LoaderFunctionArgs) {
  const url = new URL(params.request.url);

  // By default the search parameters are too long to work as a key so we hash them.
  const key = crypto.hash("sha256", url.search, "hex");

  // Return cached data if available.
  const cached: Buffer | undefined = await cache.get(key);
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  }

  const instanceId = process.env.COPERNICUS_INSTANCE_ID;
  const apiURL = `https://sh.dataspace.copernicus.eu/ogc/wms/${instanceId}${url.search}`;
  const response = await fetch(apiURL);

  // Only cache images.
  if (response.ok && response.headers.get("Content-Type") === "image/jpeg") {
    const data = Buffer.from(await (await response.blob()).arrayBuffer());
    // Cached response expires in 30 days.
    await cache.set(key, data, 30 * 24 * 60 * 60 * 1000);

    return new Response(data, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  }

  return response;
}
