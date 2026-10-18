
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "spmb_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET harus diisi minimal 32 karakter.");
  }

  return secret;
}

function sign(value) {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      nama: user.nama,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expected = sign(payload);

    const suppliedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      suppliedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(suppliedBuffer, expectedBuffer)
    ) {
      return null;
    }

    const user = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (!user.id || !user.exp || user.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const user = verifySessionToken(token);

    if (!user || user.role !== "admin") return null;

    return user;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
