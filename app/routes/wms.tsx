import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader(params: LoaderFunctionArgs) {
  const url = new URL(params.request.url);
  const apiURL = `https://sh.dataspace.copernicus.eu/ogc/wms/${process.env.COPERNICUS_INSTANCE_ID}${url.search}`;
  const response = await fetch(apiURL);
  return response;
}
