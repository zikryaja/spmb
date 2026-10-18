
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT
        u.id AS user_id,
        u.nisn_id,
        u.nama,
        p.id AS pendaftaran_id,
        p.tipe_pendaftaran,
        p.program_akademik,
        p.nomor_telepon,
        p.status_pendaftaran,
        p.created_at AS tanggal_pendaftaran
      FROM users AS u
      LEFT JOIN pendaftaran AS p
        ON p.id = (
          SELECT p2.id
          FROM pendaftaran AS p2
          WHERE p2.user_id = u.id
          ORDER BY p2.created_at DESC, p2.id DESC
          LIMIT 1
        )
      WHERE u.role = 'calon_siswa'
      ORDER BY u.created_at DESC, u.id DESC
    `);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Gagal mengambil data calon siswa:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data calon siswa dari database.",
      },
      { status: 500 }
    );
  }
}
