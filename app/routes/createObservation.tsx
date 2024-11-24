import { json } from "@remix-run/node";
import { createObservation } from "~/utils/db.server";
import { createObservation as uploadToS3, genKey } from "~/utils/s3.server";

type Location = { x: number; y: number };

export const action = async ({ request }: { request: Request }) => {
  if (request.method === "POST") {
    const formData = await request.json();

    const {
      title,
      description,
      location,
      picture,
    }: {
      title: string;
      description: string;
      location: Location;
      picture: { data: string; ext: string } | null;
    } = formData;

    if (!title || !description || !location) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    let pictureKey: string | null = null;

    if (picture && picture.data && picture.ext) {
      try {
        const imageData = Uint8Array.from(atob(picture.data), (char) =>
          char.charCodeAt(0),
        );

        pictureKey = await uploadToS3(imageData, picture.ext);
      } catch (error) {
        console.error("Failed to upload picture to S3:", error);
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
  } else {
    throw new Response("Method Not Allowed", { status: 405 });
  }
};
