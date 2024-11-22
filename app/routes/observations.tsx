import { LoaderFunction } from "@remix-run/node";
import { getObservations } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const topLeftX = parseFloat(url.searchParams.get("topLeftX") || "");
  const topLeftY = parseFloat(url.searchParams.get("topLeftY") || "");
  const bottomRightX = parseFloat(url.searchParams.get("bottomRightX") || "");
  const bottomRightY = parseFloat(url.searchParams.get("bottomRightY") || "");

  let area;
  if (topLeftX && topLeftY && bottomRightX && bottomRightY) {
    area = {
      topLeft: { x: topLeftX, y: topLeftY },
      bottomRight: { x: bottomRightX, y: bottomRightY },
    };
  }

  const observations = await getObservations(area);
  return observations;
};
