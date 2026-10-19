
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session || session.role !== "admin") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses admin diperlukan." },
        { status: 401 }
      );
    }

    const [rows] = await pool.execute(`
      SELECT
        u.id AS user_id,
        u.nama,
        u.nisn_id,
        p.id AS pendaftaran_id,
        p.program_akademik,
        p.tipe_pendaftaran,
        d.id AS dokumen_id,
        d.jenis_dokumen,
        d.nama_file,
        d.status_verifikasi,
        d.catatan_admin,
        d.created_at AS tanggal_upload
      FROM users u
      INNER JOIN pendaftaran p
        ON p.user_id = u.id
      LEFT JOIN dokumen_siswa d
        ON d.pendaftaran_id = p.id
      WHERE u.role = 'calon_siswa'
        AND p.id = (
          SELECT p2.id
          FROM pendaftaran p2
          WHERE p2.user_id = u.id
          ORDER BY p2.created_at DESC, p2.id DESC
          LIMIT 1
        )
      ORDER BY p.created_at DESC, u.id DESC
    `);

    const studentsMap = new Map();

    for (const row of rows) {
      if (!studentsMap.has(row.pendaftaran_id)) {
        studentsMap.set(row.pendaftaran_id, {
          user_id: row.user_id,
          pendaftaran_id: row.pendaftaran_id,
          nama: row.nama,
          nisn: row.nisn_id,
          program: row.program_akademik,
          tipe_pendaftaran: row.tipe_pendaftaran,
          dokumen: {
            akta_kelahiran: null,
            ijazah: null,
            kartu_keluarga: null,
          },
        });
      }

      if (row.dokumen_id && row.jenis_dokumen) {
        studentsMap.get(row.pendaftaran_id).dokumen[
          row.jenis_dokumen
        ] = {
          id: row.dokumen_id,
          nama_file: row.nama_file,
          status: row.status_verifikasi,
          catatan_admin: row.catatan_admin,
          tanggal_upload: row.tanggal_upload,
        };
      }
    }

    const data = Array.from(studentsMap.values()).map((student) => {
      const documents = Object.values(student.dokumen).filter(Boolean);
      const allUploaded = documents.length === 3;
      const allApproved =
        allUploaded &&
        documents.every((doc) => doc.status === "disetujui");
      const anyRejected = documents.some(
        (doc) => doc.status === "ditolak"
      );

      return {
        ...student,
        status_dokumen: allApproved
          ? "terverifikasi"
          : anyRejected
            ? "tidak_lengkap"
            : "menunggu",
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET verifikasi dokumen:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data verifikasi dokumen.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const dokumenId = Number(body.dokumen_id);
    const status = body.status;
    const catatan = body.catatan?.trim() || null;

    if (!Number.isSafeInteger(dokumenId) || dokumenId <= 0) {
      return NextResponse.json(
        { success: false, message: "ID dokumen tidak valid." },
        { status: 400 }
      );
    }

    if (!["disetujui", "ditolak"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status verifikasi tidak valid." },
        { status: 400 }
      );
    }

    if (status === "ditolak" && !catatan) {
      return NextResponse.json(
        {
          success: false,
          message: "Berikan alasan penolakan dokumen.",
        },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `UPDATE dokumen_siswa
       SET status_verifikasi = ?,
           catatan_admin = ?,
           diverifikasi_oleh = ?,
           diverifikasi_pada = NOW()
       WHERE id = ?`,
      [status, catatan, session.id, dokumenId]
    );

    if (result.affectedRows !== 1) {
      return NextResponse.json(
        { success: false, message: "Dokumen tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status verifikasi berhasil disimpan.",
    });
  } catch (error) {
    console.error("PATCH verifikasi dokumen:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan status verifikasi.",
      },
      { status: 500 }
    );
  }
}
