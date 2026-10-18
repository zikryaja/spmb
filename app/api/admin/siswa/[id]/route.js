
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request, { params }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Login sebagai admin diperlukan." },
      { status: 401 }
    );
  }

  const { id: rawId } = await params;
  const userId = Number(rawId);

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return NextResponse.json(
      { success: false, message: "ID siswa tidak valid." },
      { status: 400 }
    );
  }

  let connection;

  try {
    const body = await request.json();
    const nama = typeof body.nama === "string" ? body.nama.trim() : "";
    const nisn = typeof body.nisn === "string" ? body.nisn.trim() : "";
    const telepon =
      typeof body.telepon === "string" ? body.telepon.trim() : "";
    const program =
      typeof body.program === "string" ? body.program.trim() : "";

    if (!nama || !nisn) {
      return NextResponse.json(
        { success: false, message: "Nama dan NISN wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(nisn)) {
      return NextResponse.json(
        { success: false, message: "NISN harus terdiri dari 10 angka." },
        { status: 400 }
      );
    }

    if (nama.length > 100 || nisn.length > 50 || telepon.length > 20) {
      return NextResponse.json(
        { success: false, message: "Panjang data melebihi batas kolom." },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [users] = await connection.execute(
      "SELECT id FROM users WHERE id = ? AND role = 'calon_siswa' FOR UPDATE",
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();

      return NextResponse.json(
        { success: false, message: "Calon siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const [duplicate] = await connection.execute(
      "SELECT id FROM users WHERE nisn_id = ? AND id <> ? LIMIT 1",
      [nisn, userId]
    );

    if (duplicate.length > 0) {
      await connection.rollback();

      return NextResponse.json(
        { success: false, message: "NISN sudah digunakan akun lain." },
        { status: 409 }
      );
    }

    await connection.execute(
      "UPDATE users SET nama = ?, nisn_id = ? WHERE id = ? AND role = 'calon_siswa'",
      [nama, nisn, userId]
    );

    const [registrations] = await connection.execute(
      `SELECT id FROM pendaftaran
       WHERE user_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1`,
      [userId]
    );

    if (registrations.length > 0) {
      const registrationId = registrations[0].id;

      // Kolom program dan telepon hanya diperbarui jika nilainya dikirim.
      if (program) {
        await connection.execute(
          "UPDATE pendaftaran SET program_akademik = ? WHERE id = ?",
          [program, registrationId]
        );
      }

      if (body.telepon !== undefined) {
        await connection.execute(
          "UPDATE pendaftaran SET nomor_telepon = ? WHERE id = ?",
          [telepon, registrationId]
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Data calon siswa berhasil diperbarui.",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("Gagal memperbarui calon siswa:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "NISN sudah digunakan." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data calon siswa." },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
}

export async function DELETE(request, { params }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Login sebagai admin diperlukan." },
      { status: 401 }
    );
  }

  const { id: rawId } = await params;
  const userId = Number(rawId);

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return NextResponse.json(
      { success: false, message: "ID siswa tidak valid." },
      { status: 400 }
    );
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [users] = await connection.execute(
      "SELECT id FROM users WHERE id = ? AND role = 'calon_siswa' FOR UPDATE",
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();

      return NextResponse.json(
        { success: false, message: "Calon siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const [registrations] = await connection.execute(
      "SELECT id FROM pendaftaran WHERE user_id = ?",
      [userId]
    );

    for (const registration of registrations) {
      await connection.execute(
        "DELETE FROM orang_tua WHERE pendaftaran_id = ?",
        [registration.id]
      );
    }

    await connection.execute(
      "DELETE FROM pendaftaran WHERE user_id = ?",
      [userId]
    );

    await connection.execute(
      "DELETE FROM users WHERE id = ? AND role = 'calon_siswa'",
      [userId]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Data calon siswa berhasil dihapus.",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("Gagal menghapus calon siswa:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Data gagal dihapus. Periksa relasi foreign key atau data terkait lainnya.",
      },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
}
