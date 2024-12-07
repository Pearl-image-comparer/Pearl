import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import "~/main.css";
import { lightTheme } from "./theme";
import { useEffect, useState } from "react";

import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "~/utils/i18next.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  let locale = await i18next.getLocale(request);
  return json({ locale });
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "translation",
};

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
  // Get the locale from the loader
  let { locale } = useLoaderData<typeof loader>();

  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);
  return (
    <ThemeProvider theme={lightTheme}>
      <html lang={locale} dir={i18n.dir()}>
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
