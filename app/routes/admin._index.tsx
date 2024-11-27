import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  type LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { getObservations } from "~/utils/db.server";
import sessions from "~/utils/sessions.server";

export const meta: MetaFunction = () => [{ title: "Admin" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (!session.get("ok")) return redirect("/admin/login");
  return getObservations();
}

export default function Admin() {
  const observations = useLoaderData<typeof loader>();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Otsikko" },
    { field: "description", headerName: "Kuvaus", flex: 1 },
    {
      field: "location",
      headerName: "Sijainti",
      valueGetter: (_, row) => `${row.location.y}, ${row.location.x}`,
    },
    {
      field: "date",
      headerName: "Aika",
      width: 200,
      valueGetter: (value) => dayjs(value).toISOString(),
    },
  ];

  return (
    <DataGrid
      rows={observations}
      columns={columns}
      checkboxSelection
      sx={{ border: 0 }}
    />
  );
}
