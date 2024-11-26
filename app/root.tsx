import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "~/main.css";
import { lightTheme } from "./theme";
import { useEffect, useState } from "react";

function Layout() {
  const [isClient, setIsClient] = useState(false);

  // Ensure rendering only in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Due to Material UI and Emotion we can't render anything on the server.
  if (!isClient) return <p>Loading...</p>;

  return <Outlet />;
}

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="data:image/x-icon;base64,AA" />
          <Meta />
          <Links />
          <CssBaseline />
        </head>
        <body>
          <Layout />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}
