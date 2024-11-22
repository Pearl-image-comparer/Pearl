import { json } from "@remix-run/node";
import { createObservation } from "~/utils/db.server";

type Location = { x: number; y: number };

export let action = async ({ request }: { request: Request }) => {
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
    picture: string | null;
  } = formData;

  if (!title || !description || !location) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const newObservation = await createObservation(
      title,
      description,
      location,
      picture
    );

    return json(newObservation, { status: 201 });
  } catch (error) {
    return json({ error: "Failed to create observation" }, { status: 500 });
  }
};
