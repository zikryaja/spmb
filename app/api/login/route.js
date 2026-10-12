
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

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

    return Response.json({
      message: "Login berhasil!",
      user: {
        id: user.id,
        nama: user.nama,
        nisn_id: user.nisn_id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
