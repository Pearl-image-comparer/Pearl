import { json, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getObservation } from "~/utils/s3.server";
import sessions from "~/utils/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (!session.get("ok")) return redirect("/admin/login");

  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key || typeof key !== "string")
    throw json("Picture key not provided", { status: 400 });

  return json({ url: await getObservation(key) });
}
