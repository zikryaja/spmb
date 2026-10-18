import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "spmb_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

const allowedRoles = new Set(["admin", "kepsek"]);

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET harus diisi minimal 32 karakter.");
  }

  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      name: user.nama,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (typeof token !== "string") return null;

  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length > 0) return null;

  const expectedSignature = Buffer.from(sign(payload));
  const actualSignature = Buffer.from(signature);

  if (
    expectedSignature.length !== actualSignature.length ||
    !timingSafeEqual(expectedSignature, actualSignature)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      !session ||
      (typeof session.id !== "number" && typeof session.id !== "string") ||
      typeof session.name !== "string" ||
      !allowedRoles.has(session.role) ||
      !Number.isFinite(session.exp) ||
      session.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      id: session.id,
      name: session.name,
      role: session.role,
    };
  } catch {
    return null;
  }
}
