import { lazy, Suspense, useEffect, useState } from "react";

// Lazy loading to ensure the browser environment is available before render.
const LazyMap = lazy(() => import("./_MapComponent.client"));

export default function Map() {
  const [isClient, setIsClient] = useState(false);

  // Ensure rendering only in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    // TODO: Add proper fallback
    <Suspense fallback={<p>Lazy loading...</p>}>
      <LazyMap />
    </Suspense>
  );
}
