
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const accounts = [
  {
    id: "ADMIN001",
    nama: "Administrator Permata Global",
    password: "AdminPG!2026",
    role: "admin",
  },
  {
    id: "KEPSEK001",
    nama: "Kepala Sekolah Permata Global",
    password: "KepsekPG!2026",
    role: "kepsek",
  },
];

async function main() {
  const db = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "spmb",
    port: 3306,
  });

  try {
    for (const account of accounts) {
      const [existing] = await db.execute(
        "SELECT id FROM users WHERE nisn_id = ? LIMIT 1",
        [account.id]
      );

      if (existing.length > 0) {
        console.log(
          `Akun ${account.id} sudah ada. Tidak diubah.`
        );
        continue;
      }

      const hashedPassword = await bcrypt.hash(
        account.password,
        12
      );

      await db.execute(
        `INSERT INTO users (nisn_id, nama, password, role)
         VALUES (?, ?, ?, ?)`,
        [
          account.id,
          account.nama,
          hashedPassword,
          account.role,
        ]
      );

      console.log(
        `Berhasil membuat akun ${account.id} dengan role ${account.role}.`
      );
    }
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error("Gagal membuat akun:", error.message);
  process.exitCode = 1;
});
