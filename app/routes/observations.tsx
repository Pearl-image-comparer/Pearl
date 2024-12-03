import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from "@remix-run/node";
import { getObservations, createObservation } from "~/utils/db.server";
import { createObservation as uploadToS3 } from "~/utils/s3.server";
import { parseLatitude, parseLongitude } from "~/utils/parser";

export interface Observation {
  picture: File | null;
  title: string;
  latitude: number;
  longitude: number;
  description: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const startLongitude = parseLongitude(url.searchParams.get("startLongitude"));
  const startLatitude = parseLatitude(url.searchParams.get("startLatitude"));
  const endLongitude = parseLongitude(url.searchParams.get("endLongitude"));
  const endLatitude = parseLatitude(url.searchParams.get("endLatitude"));

  if (
    startLongitude !== null &&
    startLatitude !== null &&
    endLongitude !== null &&
    endLatitude !== null
  ) {
    const observations = await getObservations({
      topLeft: { x: startLongitude, y: startLatitude },
      bottomRight: { x: endLongitude, y: endLatitude },
    });
    // Map observations to a better format.
    return observations.map((observation) => ({
      id: observation.id,
      title: observation.title,
      description: observation.description,
      data: observation.date,
      longitude: observation.location.x,
      latitude: observation.location.y,
      pictureKey: observation.picture,
    }));
  }

  return json({ error: "Missing required fields" }, { status: 400 });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "POST") {
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const picture = formData.get("picture");

    const longitude = parseLongitude(
      formData.get("longitude") as string | null,
    );
    const latitude = parseLatitude(formData.get("latitude") as string | null);

    if (longitude === null || latitude === null) {
      return json({ error: "Invalid coordinates provided" }, { status: 400 });
    }

    if (
      !title ||
      typeof title !== "string" ||
      !description ||
      typeof description !== "string"
    ) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    let pictureKey: string | undefined;

    if (picture && picture instanceof File && picture.size > 0) {
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
        { x: longitude, y: latitude },
        pictureKey,
      );

      return json(newObservation, { status: 201 });
    } catch (error) {
      console.error("Failed to create observation:", error);
      return json({ error: "Failed to create observation" }, { status: 500 });
    }
  }
}
