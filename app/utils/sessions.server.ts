import { createCookieSessionStorage } from "@remix-run/node";
import crypto from "crypto";

export default createCookieSessionStorage<{ ok: true }>({
  cookie: {
    name: "__session",
    secrets: [
      process.env.COOKIE_SECRET || crypto.randomBytes(16).toString("hex"),
    ],
    sameSite: "strict",
    httpOnly: true,
    maxAge: 60 * 15, // 15 minutes TTL.
    secure: true,
    path: "/admin",
  },
});
