import { Table } from "@mui/material";
import {
  type LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import sessions from "~/utils/sessions.server";

export const meta: MetaFunction = () => [{ title: "Admin" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (session.get("ok")) return null;
  return redirect("/admin/login");
}

export default function Admin() {
  return <Table></Table>;
}
