import { Box, Button, Dialog, DialogTitle, Paper, styled } from "@mui/material";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  type GridColDef,
  useGridApiContext,
  PropsFromSlot,
  GridSlots,
} from "@mui/x-data-grid";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";
import { deleteObservation, getObservations } from "~/utils/db.server";
import sessions from "~/utils/sessions.server";

export const meta: MetaFunction = () => [{ title: "Admin" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (!session.get("ok")) return redirect("/admin/login");
  return getObservations();
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, { status: 405 });

  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (!session.get("ok")) return json({ error: "Forbidden" }, { status: 403 });

  const data = await request.json();

  const ids = data.ids;
  if (!ids || !Array.isArray(ids) || ids.length === 0)
    return json({ error: "Missing IDs" }, { status: 400 });

  await Promise.all(ids.map((id) => deleteObservation(id)));
  return null;
}

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    loading: boolean;
    onDelete: (ids: number[]) => void;
  }
}

function Toolbar(props: PropsFromSlot<GridSlots["toolbar"]>) {
  const apiRef = useGridApiContext();
  const selectedRows = apiRef.current.getSelectedRows();

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flex: 1 }} />
      <Button
        size="small"
        color="error"
        variant="outlined"
        disabled={props.loading || selectedRows.size === 0}
        onClick={() => props.onDelete([...selectedRows.keys()])}
      >
        Poista
      </Button>
    </GridToolbarContainer>
  );
}

export default function Admin() {
  const observations = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Otsikko" },
    { field: "description", headerName: "Kuvaus", flex: 1 },
    {
      field: "location",
      headerName: "Sijainti",
      width: 200,
      valueGetter: (_, row) =>
        `${row.location.y.toPrecision(10)}, ${row.location.x.toPrecision(10)}`,
    },
    {
      field: "date",
      headerName: "Aika",
      width: 200,
      valueGetter: (value) => dayjs(value).toISOString(),
    },
  ];

  const StyledImage = styled("img")({
    width: "100%",
    borderRadius: "0.5rem",
  });

  return (
    <Paper sx={{ height: "100%" }}>
      <Dialog onClose={() => setPictureUrl(null)} open={pictureUrl !== null}>
        <DialogTitle>Havainto</DialogTitle>
        <Box sx={{ p: 1 }}>
          {pictureUrl && <StyledImage src={pictureUrl} alt="Havainnon kuva" />}
        </Box>
      </Dialog>
      <DataGrid
        rows={observations}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
        slots={{ toolbar: Toolbar }}
        disableRowSelectionOnClick
        loading={fetcher.state !== "idle"}
        onRowClick={async ({ row }) => {
          if (row.picture) {
            const params = new URLSearchParams({ key: row.picture });
            const response = await fetch(`/admin/picture?${params}`);
            const data = await response.json();
            setPictureUrl(data.url);
          }
        }}
        slotProps={{
          toolbar: {
            loading: fetcher.state !== "idle",
            onDelete: (ids) => {
              fetcher.submit(
                { ids },
                { method: "POST", encType: "application/json" },
              );
            },
          },
        }}
      />
    </Paper>
  );
}
