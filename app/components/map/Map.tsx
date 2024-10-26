import { lazy, Suspense } from "react";

// Lazy loading to ensure the browser environment is available before render.
const LazyMap = lazy(() => import("./_MapComponent.client"));

export default function Map(): JSX.Element {
  return (
    //TODO: Add proper fallback
    <Suspense fallback={<p>Lazy loading...</p>}>
      <LazyMap />
    </Suspense>
  );
}
