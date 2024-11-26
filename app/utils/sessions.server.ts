import { createCookieSessionStorage } from "@remix-run/node";

export default createCookieSessionStorage<{ ok: true }>({
  cookie: {
    name: "__session",
    secrets: ["r3m1xr0ck5"],
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 15, // 15 minutes TTL.
    secure: true,
    path: "/",
  },
});
