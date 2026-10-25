import { cookies } from "next/headers";
import db from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = verifySessionToken(
      cookieStore.get(SESSION_COOKIE_NAME)?.value
    );

    if (!session || session.role !== "calon_siswa") {
      return Response.json(
        { message: "Akses dashboard siswa diperlukan." },
        { status: 401 }
      );
    }

    const [rows] = await db.execute(
      `SELECT
        u.id AS user_id,
        u.nama,
        p.id AS pendaftaran_id,
        p.status_pendaftaran
       FROM users AS u
       LEFT JOIN pendaftaran AS p
         ON p.id = (
           SELECT p2.id
           FROM pendaftaran AS p2
           WHERE p2.user_id = u.id
           ORDER BY p2.created_at DESC, p2.id DESC
           LIMIT 1
         )
       WHERE u.id = ? AND u.role = 'calon_siswa'
       LIMIT 1`,
      [session.id]
    );

    if (!rows.length) {
      return Response.json(
        { message: "Data akun siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const student = rows[0];
    const registrationCompleted = Boolean(student.pendaftaran_id);

    return Response.json({
      student: {
        nama: student.nama,
        statusPendaftaran: student.status_pendaftaran,
        registrationCompleted,
      },
      progress: {
        completed: registrationCompleted ? 1 : 0,
        total: 4,
      },
    });
  } catch (error) {
    console.error("GET dashboard siswa:", error);

    return Response.json(
      { message: "Gagal mengambil data dashboard siswa." },
      { status: 500 }
    );
  }
}
