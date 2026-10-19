
import { cookies } from "next/headers";
import db from "@/lib/db";
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

function normalizeQuestion(row) {
  return {
    id: Number(row.question_number),
    question: row.question_text,
    options: [
      row.option_a,
      row.option_b,
      row.option_c,
      row.option_d,
    ],
    answer: ["A", "B", "C", "D"].indexOf(row.correct_answer),
  };
}

// GET: Mengambil 40 soal dari database.
export async function GET() {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        { message: "Akses ditolak. Login sebagai admin diperlukan." },
        { status: 401 }
      );
    }

    const [rows] = await db.execute(
      `SELECT question_number, question_text,
              option_a, option_b, option_c, option_d,
              correct_answer
       FROM assessment_questions
       ORDER BY question_number ASC`
    );

    const questionMap = new Map(
      rows.map((row) => [
        Number(row.question_number),
        normalizeQuestion(row),
      ])
    );

    const questions = Array.from({ length: 40 }, (_, index) => {
      return (
        questionMap.get(index + 1) || {
          id: index + 1,
          question: "",
          options: ["", "", "", ""],
          answer: 0,
        }
      );
    });

    return Response.json({ questions });
  } catch (error) {
    console.error("GET assessment questions:", error);

    return Response.json(
      { message: "Gagal mengambil soal assessment." },
      { status: 500 }
    );
  }
}

// PUT: Menyimpan perubahan bank soal.
export async function PUT(request) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        { message: "Akses ditolak. Login sebagai admin diperlukan." },
        { status: 401 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { message: "Format request JSON tidak valid." },
        { status: 400 }
      );
    }

    const questions =
      body && typeof body === "object" && !Array.isArray(body)
        ? body.questions
        : null;

    if (!Array.isArray(questions) || questions.length !== 40) {
      return Response.json(
        { message: "Data harus berisi tepat 40 soal." },
        { status: 400 }
      );
    }

    const seen = new Set();

    for (const question of questions) {
      if (
        !question ||
        typeof question !== "object" ||
        Array.isArray(question) ||
        !Number.isSafeInteger(question.id) ||
        question.id < 1 ||
        question.id > 40 ||
        seen.has(question.id) ||
        typeof question.question !== "string" ||
        !question.question.trim() ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.options.every(
          (option) => typeof option === "string" && option.trim()
        ) ||
        !Number.isInteger(question.answer) ||
        question.answer < 0 ||
        question.answer > 3
      ) {
        return Response.json(
          { message: "Format data soal tidak valid." },
          { status: 400 }
        );
      }

      if (
        question.question.length > 10000 ||
        question.options.some((option) => option.length > 500)
      ) {
        return Response.json(
          { message: "Teks soal atau pilihan jawaban terlalu panjang." },
          { status: 400 }
        );
      }

      seen.add(question.id);
    }

    if (seen.size !== 40) {
      return Response.json(
        { message: "Nomor soal harus lengkap dari 1 sampai 40." },
        { status: 400 }
      );
    }

    let connection;
    let transactionStarted = false;

    try {
      connection = await db.getConnection();
      await connection.beginTransaction();
      transactionStarted = true;

      for (const question of questions) {
        const options = question.options;
        const answers = ["A", "B", "C", "D"];

        await connection.execute(
          `INSERT INTO assessment_questions
            (question_number, question_text,
             option_a, option_b, option_c, option_d,
             correct_answer)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             question_text = VALUES(question_text),
             option_a = VALUES(option_a),
             option_b = VALUES(option_b),
             option_c = VALUES(option_c),
             option_d = VALUES(option_d),
             correct_answer = VALUES(correct_answer)`,
          [
            question.id,
            question.question.trim(),
            options[0].trim(),
            options[1].trim(),
            options[2].trim(),
            options[3].trim(),
            answers[question.answer],
          ]
        );
      }

      await connection.commit();
      transactionStarted = false;

      return Response.json({
        message: "Bank soal berhasil disimpan.",
      });
    } catch (error) {
      if (connection && transactionStarted) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Rollback assessment questions:", rollbackError);
        }
      }

      console.error("PUT assessment questions:", error);
      return Response.json(
        { message: "Gagal menyimpan bank soal ke database." },
        { status: 500 }
      );
    } finally {
      connection?.release();
    }
  } catch (error) {
    console.error("PUT assessment questions:", error);

    return Response.json(
      { message: "Gagal menyimpan bank soal ke database." },
      { status: 500 }
    );
  }
}
