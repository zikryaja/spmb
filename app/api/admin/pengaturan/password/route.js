
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = verifySessionToken(token);

  if (!session || session.role !== "admin") {
    return null;
  }

  return session;
}

export async function PUT(request) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        { message: "Sesi admin tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const lama =
      typeof body.lama === "string" ? body.lama : "";
    const baru =
      typeof body.baru === "string" ? body.baru : "";
    const konfirmasi =
      typeof body.konfirmasi === "string"
        ? body.konfirmasi
        : "";

    if (!lama || !baru || !konfirmasi) {
      return Response.json(
        { message: "Semua kolom password wajib diisi." },
        { status: 400 }
      );
    }

    if (baru.length < 8) {
      return Response.json(
        { message: "Password baru minimal 8 karakter." },
        { status: 400 }
      );
    }

    if (baru === lama) {
      return Response.json(
        { message: "Password baru harus berbeda dari password lama." },
        { status: 400 }
      );
    }

    if (baru !== konfirmasi) {
      return Response.json(
        { message: "Konfirmasi password baru tidak cocok." },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(
      `SELECT id, password
       FROM users
       WHERE id = ? AND role = 'admin'
       LIMIT 1`,
      [session.id]
    );

    if (!rows.length) {
      return Response.json(
        { message: "Akun admin tidak ditemukan." },
        { status: 404 }
      );
    }

    const passwordValid = await bcrypt.compare(
      lama,
      rows[0].password
    );

    if (!passwordValid) {
      return Response.json(
        { message: "Password lama yang kamu masukkan salah." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(baru, 12);

    const [updateResult] = await db.execute(
      `UPDATE users
       SET password = ?
       WHERE id = ? AND role = 'admin'`,
      [hashedPassword, session.id]
    );

    if (updateResult.affectedRows !== 1) {
      return Response.json(
        { message: "Password gagal diperbarui." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Password admin berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT password admin:", error);

    return Response.json(
      {
        message: "Terjadi kesalahan saat memperbarui password.",
        debug:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
