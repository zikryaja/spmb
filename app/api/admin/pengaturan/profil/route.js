
import { cookies } from "next/headers";
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

// GET: mengambil profil admin
export async function GET() {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        { message: "Akses admin diperlukan." },
        { status: 401 }
      );
    }

    const [rows] = await db.execute(
      `SELECT
        u.id,
        u.nama,
        s.email,
        s.telepon
       FROM users u
       LEFT JOIN admin_settings s ON s.user_id = u.id
       WHERE u.id = ? AND u.role = 'admin'
       LIMIT 1`,
      [session.id]
    );

    if (!rows.length) {
      return Response.json(
        { message: "Data admin tidak ditemukan." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: {
        nama: rows[0].nama || "",
        email: rows[0].email || "",
        telepon: rows[0].telepon || "",
      },
    });
  } catch (error) {
    console.error("GET profil admin:", error);

    return Response.json(
      {
        message: "Gagal mengambil profil admin.",
        debug:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT: menyimpan perubahan profil admin
export async function PUT(request) {
  let connection;

  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        { message: "Akses admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const nama =
      typeof body.nama === "string" ? body.nama.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const telepon =
      typeof body.telepon === "string"
        ? body.telepon.trim()
        : "";

    if (!nama || !email) {
      return Response.json(
        { message: "Nama dan email wajib diisi." },
        { status: 400 }
      );
    }

    if (
      nama.length > 100 ||
      email.length > 150 ||
      telepon.length > 20
    ) {
      return Response.json(
        { message: "Panjang data melebihi batas yang diizinkan." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    // Pastikan akun masih tersedia dan merupakan admin.
    const [adminRows] = await connection.execute(
      "SELECT id FROM users WHERE id = ? AND role = 'admin' LIMIT 1",
      [session.id]
    );

    if (!adminRows.length) {
      await connection.rollback();

      return Response.json(
        { message: "Akun admin tidak ditemukan." },
        { status: 404 }
      );
    }

    // Email disimpan pada admin_settings, bukan users.
    const [existing] = await connection.execute(
      `SELECT s.user_id
       FROM admin_settings s
       INNER JOIN users u ON u.id = s.user_id
       WHERE LOWER(s.email) = ? AND s.user_id <> ?
       LIMIT 1`,
      [email, session.id]
    );

    if (existing.length) {
      await connection.rollback();

      return Response.json(
        { message: "Email sudah digunakan admin lain." },
        { status: 409 }
      );
    }

    await connection.execute(
      "UPDATE users SET nama = ? WHERE id = ? AND role = 'admin'",
      [nama, session.id]
    );

    await connection.execute(
      `INSERT INTO admin_settings (user_id, email, telepon)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email = VALUES(email),
         telepon = VALUES(telepon)`,
      [session.id, email, telepon || null]
    );

    await connection.commit();

    return Response.json({
      success: true,
      message: "Profil admin berhasil disimpan.",
      data: {
        nama,
        email,
        telepon,
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback profil admin:", rollbackError);
      }
    }

    console.error("PUT profil admin:", error);

    return Response.json(
      {
        message: "Gagal menyimpan profil admin.",
        debug:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
