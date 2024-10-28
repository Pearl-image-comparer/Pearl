import Map from "~/components/map/Map";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  // TODO: Is there a better way to do this?
  // If we use the Copernicus API directly, we have to pass the ID to the client.
  return process.env.COPERNICUS_INSTANCE_ID;
}

export default function Index() {
  const instanceId = useLoaderData<typeof loader>();

  return <Map instanceId={instanceId} />;
}
