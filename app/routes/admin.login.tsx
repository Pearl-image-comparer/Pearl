import { Box, Button, Card, TextField, Typography } from "@mui/material";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import argon2 from "argon2";
import sessions from "~/utils/sessions.server";

export const meta: MetaFunction = () => [{ title: "Admin Kirjautuminen" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessions.getSession(request.headers.get("Cookie"));
  if (session.get("ok")) return redirect("/admin");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, { status: 405 });

  const data = await request.formData();
  const password = data.get("password");

  if (typeof password !== "string" || !password) {
    return json({ error: "Password not provided" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD)
    return json({ error: "Admin password missing" }, { status: 500 });

  if (await argon2.verify(process.env.ADMIN_PASSWORD, password)) {
    const session = await sessions.getSession(request.headers.get("Cookie"));
    session.set("ok", true);
    return json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": await sessions.commitSession(session),
        },
      },
    );
  }

  return json({ error: "Invalid password" }, { status: 401 });
}

export default function AdminLogin() {
  const data = useActionData<typeof action>();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{ flex: 1, maxWidth: "450px", pt: 4, px: 4 }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight="bold"
          textAlign="center"
        >
          Admin
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            my: 4,
          }}
        >
          <Form method="POST" style={{ display: "contents" }}>
            <TextField
              required
              name="password"
              label="Salasana"
              type="password"
              fullWidth
              autoComplete="current-password"
              color={!data || "error" in data || !data.ok ? "error" : "primary"}
            />
            <Button type="submit" variant="contained">
              Kirjaudu sisään
            </Button>
          </Form>
        </Box>
      </Card>
    </Box>
  );
}
