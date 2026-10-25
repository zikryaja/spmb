
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth/session";

export async function POST(request) {
  try {
    const body = await request.json();

    const loginId =
      typeof body.loginId === "string" ? body.loginId.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!loginId || !password) {
      return Response.json(
        { message: "NISN/ID dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT id, nisn_id, nama, password, role
       FROM users
       WHERE nisn_id = ?
       LIMIT 1`,
      [loginId]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "NISN/ID atau kata sandi salah." },
        { status: 401 }
      );
    }

    const user = rows[0];

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return Response.json(
        { message: "NISN/ID atau kata sandi salah." },
        { status: 401 }
      );
    }

    const response = Response.json({
      message: "Login berhasil!",
      user: {
        id: user.id,
        nama: user.nama,
        nisn_id: user.nisn_id,
        role: user.role,
      },
    });

    if (["admin", "kepsek", "calon_siswa"].includes(user.role)) {
      const token = createSessionToken(user);

      response.headers.append(
        "Set-Cookie",
        `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
      );
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
