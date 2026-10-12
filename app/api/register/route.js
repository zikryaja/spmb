
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

const parentPrefixes = ["ayah", "ibu", "wali"];

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validDate(value) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? value
    : undefined;
}

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const nama = clean(body.nama);
    const nisn_id = clean(body.nisn_id);
    const password = body.password;

    // Validasi akun
    if (!nama || !nisn_id || typeof password !== "string" || !password) {
      return Response.json(
        { message: "Nama, NISN, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (nama.length > 100 || nisn_id.length > 50) {
      return Response.json(
        { message: "Nama atau NISN terlalu panjang." },
        { status: 400 }
      );
    }

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

    // Validasi formulir utama
    const requiredFields = [
      "tipe_pendaftaran",
      "program_akademik",
      "jenis_kelamin",
      "tempat_lahir",
      "tanggal_lahir",
      "anak_ke",
      "agama",
      "nomor_telepon",
      "tempat_tinggal",
      "alamat",
      "sekolah_sebelumnya",
    ];

    for (const field of requiredFields) {
      if (!clean(body[field])) {
        return Response.json(
          { message: `Kolom ${field.replaceAll("_", " ")} wajib diisi.` },
          { status: 400 }
        );
      }
    }

    if (!["Laki-laki", "Perempuan"].includes(body.jenis_kelamin)) {
      return Response.json(
        { message: "Jenis kelamin tidak valid." },
        { status: 400 }
      );
    }

    const tanggalLahir = validDate(body.tanggal_lahir);
    const tanggalMulaiTinggal = validDate(body.tanggal_mulai_tinggal);

    if (tanggalLahir === undefined || tanggalMulaiTinggal === undefined) {
      return Response.json(
        { message: "Format tanggal tidak valid." },
        { status: 400 }
      );
    }

    const anakKe = Number(body.anak_ke);

    if (!Number.isInteger(anakKe) || anakKe < 1) {
      return Response.json(
        { message: "Anak ke- harus berupa bilangan bulat minimal 1." },
        { status: 400 }
      );
    }

    // Validasi tanggal lahir dan data orang tua
    if (!tanggalLahir) {
      return Response.json(
        { message: "Tanggal lahir wajib diisi." },
        { status: 400 }
      );
    }

    for (const prefix of ["ayah", "ibu"]) {
      if (!clean(body[`${prefix}_nama`])) {
        return Response.json(
          { message: `Nama ${prefix} wajib diisi.` },
          { status: 400 }
        );
      }
    }

    const parentData = parentPrefixes.map((prefix) => {
      const tanggal = validDate(body[`${prefix}_tanggal_lahir`]);

      return {
        hubungan: prefix,
        nama: clean(body[`${prefix}_nama`]),
        tempat_lahir: clean(body[`${prefix}_tempat_lahir`]) || null,
        tanggal_lahir: tanggal,
        pendidikan_terakhir:
          clean(body[`${prefix}_pendidikan`]) || null,
        pekerjaan: clean(body[`${prefix}_pekerjaan`]) || null,
        penghasilan_per_bulan:
          clean(body[`${prefix}_penghasilan`]) || null,
        nomor_telepon: clean(body[`${prefix}_telepon`]) || null,
        alamat: clean(body[`${prefix}_alamat`]) || null,
      };
    });

    if (parentData.some((parent) => parent.tanggal_lahir === undefined)) {
      return Response.json(
        { message: "Tanggal lahir orang tua atau wali tidak valid." },
        { status: 400 }
      );
    }

    // Wali sepenuhnya opsional; simpan jika namanya diisi.
    const wali = parentData.find((parent) => parent.hubungan === "wali");
    const parentsToSave = parentData.filter(
      (parent) => parent.hubungan !== "wali" || wali.nama
    );

    const hashedPassword = await bcrypt.hash(password, 12);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Cegah NISN ganda.
    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE nisn_id = ? LIMIT 1",
      [nisn_id]
    );

    if (existing.length > 0) {
      await connection.rollback();

      return Response.json(
        { message: "NISN sudah terdaftar." },
        { status: 409 }
      );
    }

    // 1. Buat akun. Role tidak pernah diambil dari request.
    const [userResult] = await connection.execute(
      `INSERT INTO users (nisn_id, nama, password, role)
       VALUES (?, ?, ?, 'calon_siswa')`,
      [nisn_id, nama, hashedPassword]
    );

    // 2. Simpan data pendaftaran.
    const [registrationResult] = await connection.execute(
      `INSERT INTO pendaftaran (
        user_id, tipe_pendaftaran, program_akademik,
        jenis_kelamin, tempat_lahir, tanggal_lahir, anak_ke, agama,
        nomor_telepon, tempat_tinggal, tanggal_mulai_tinggal, alamat,
        sekolah_sebelumnya, tinggi_badan, berat_badan,
        golongan_darah, ukuran_seragam, status_pendaftaran
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        'menunggu_verifikasi')`,
      [
        userResult.insertId,
        clean(body.tipe_pendaftaran),
        clean(body.program_akademik),
        body.jenis_kelamin,
        clean(body.tempat_lahir),
        tanggalLahir,
        anakKe,
        clean(body.agama),
        clean(body.nomor_telepon),
        clean(body.tempat_tinggal),
        tanggalMulaiTinggal,
        clean(body.alamat),
        clean(body.sekolah_sebelumnya),
        body.tinggi_badan ? Number(body.tinggi_badan) : null,
        body.berat_badan ? Number(body.berat_badan) : null,
        clean(body.golongan_darah) || null,
        clean(body.ukuran_seragam) || null,
      ]
    );

    // 3. Simpan data ayah, ibu, dan wali bila diisi.
    for (const parent of parentsToSave) {
      await connection.execute(
        `INSERT INTO orang_tua (
          pendaftaran_id, hubungan, nama, tempat_lahir,
          tanggal_lahir, pendidikan_terakhir, pekerjaan,
          penghasilan_per_bulan, nomor_telepon, alamat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registrationResult.insertId,
          parent.hubungan,
          parent.nama,
          parent.tempat_lahir,
          parent.tanggal_lahir,
          parent.pendidikan_terakhir,
          parent.pekerjaan,
          parent.penghasilan_per_bulan,
          parent.nomor_telepon,
          parent.alamat,
        ]
      );
    }

    await connection.commit();

    return Response.json(
      {
        message: "Registrasi dan data pendaftaran berhasil disimpan.",
        user: {
          id: userResult.insertId,
          nama,
          nisn_id,
          role: "calon_siswa",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }

    if (error.code === "ER_DUP_ENTRY") {
      return Response.json(
        { message: "NISN atau data terkait sudah terdaftar." },
        { status: 409 }
      );
    }

    console.error("Register error:", error);

    return Response.json(
      { message: "Registrasi gagal karena kesalahan server." },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
}
