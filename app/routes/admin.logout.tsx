import { type ActionFunctionArgs, redirect, json } from "@remix-run/node";
import sessions from "~/utils/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "DELETE")
    return json({ error: "Method not allowed" }, { status: 405 });

  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (!session.get("ok")) return json({ error: "Forbidden" }, { status: 403 });

  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await sessions.destroySession(session),
    },
  });
}
