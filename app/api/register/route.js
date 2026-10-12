
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();

    const nama =
      typeof body.nama === "string" ? body.nama.trim() : "";

    const nisn_id =
      typeof body.nisn_id === "string"
        ? body.nisn_id.trim()
        : "";

    const password = body.password;

    // Validasi input
    if (!nama || !nisn_id || typeof password !== "string" || !password) {
      return Response.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (nama.length > 100 || nisn_id.length > 50) {
      return Response.json(
        { message: "Nama atau NISN/ID terlalu panjang." },
        { status: 400 }
      );
    }

    // Validasi NISN: 10 digit angka
    // Jika mendukung ID admin/kepsek, ID tersebut
    // sebaiknya dibuat melalui proses khusus.
    if (!/^\d{10}$/.test(nisn_id)) {
      return Response.json(
        { message: "NISN harus terdiri dari 10 digit angka." },
        { status: 400 }
      );
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return Response.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Cek NISN sudah terdaftar
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE nisn_id = ?",
      [nisn_id]
    );

    if (existing.length > 0) {
      return Response.json(
        { message: "NISN sudah terdaftar." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Role ditentukan oleh server
    await pool.execute(
      `INSERT INTO users (nisn_id, nama, password, role)
       VALUES (?, ?, ?, 'calon_siswa')`,
      [nisn_id, nama, hashedPassword]
    );

    return Response.json(
      { message: "Registrasi calon siswa berhasil." },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return Response.json(
        { message: "NISN sudah terdaftar." },
        { status: 409 }
      );
    }

    console.error("Register error:", error);

    return Response.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
