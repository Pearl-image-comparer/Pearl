import type { MetaFunction } from "@remix-run/node";
import Map from "~/components/map/Map";

export const meta: MetaFunction = () => [{ title: "Pearl" }];

export default function Index() {
  return <Map />;
}
