import { lazy, Suspense } from "react";
import LoadingScreen from "./loading/LoadingScreen";

// Lazy loading to ensure the browser environment is available before render.
const LazyMap = lazy(() => import("./_MapComponent.client"));

export default function Map() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LazyMap />
    </Suspense>
  );
}
