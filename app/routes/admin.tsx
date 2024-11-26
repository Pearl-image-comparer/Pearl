import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, { status: 405 });

  const data = await request.formData();
  const password = data.get("password");

  if (typeof password !== "string" || !password) {
    return json({ error: "Password not provided" }, { status: 400 });
  }

  if (password !== "demo")
    return json({ error: "Wrong password" }, { status: 401 });

  return json({ ok: true });
}

function LoginPage(props: { hasError: boolean }) {
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
              color={props.hasError ? "error" : "primary"}
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

export default function Admin() {
  const result = useActionData<typeof action>();

  if (!result || "error" in result || !result.ok)
    return (
      <LoginPage
        hasError={typeof result !== "undefined" && "error" in result}
      />
    );

  return <>Success</>;
}
