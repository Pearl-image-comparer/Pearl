import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from "@remix-run/node";
import {
  getObservations,
  createObservation,
  type Location,
} from "~/utils/db.server";
import { createObservation as uploadToS3 } from "~/utils/s3.server";

export async function loader({ request }: LoaderFunctionArgs) {
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

  return getObservations(area);
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "POST") {
    const formData = await request.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const location = formData.get("location") as Location | null;
    const picture = formData.get("picture") as File | null;

    if (!title || !description || !location) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    let pictureKey: string | undefined;

    if (picture) {
      try {
        const ext = picture.name.split(".").pop();
        if (!ext) {
          throw new Error("Unknown file extension");
        }

        const imageData = new Uint8Array(await picture.arrayBuffer());

        pictureKey = await uploadToS3(imageData, ext);
      } catch (error) {
        console.error("Failed to upload picture", error);
        return json({ error: "Failed to upload picture" }, { status: 500 });
      }
    }

    try {
      const newObservation = await createObservation(
        title,
        description,
        location,
        pictureKey,
      );

      return json(newObservation, { status: 201 });
    } catch (error) {
      console.error("Failed to create observation:", error);
      return json({ error: "Failed to create observation" }, { status: 500 });
    }
  }
}
