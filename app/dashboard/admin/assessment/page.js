
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "../admin-dashboard.css";
import "./assessment.css";

const initialStudents = [];

const initialQuestions = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  question: "",
  options: ["", "", "", ""],
  answer: 0,
}));

async function readResponseData(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error("Server mengembalikan respons yang tidak valid.", {
      cause: error,
    });
  }
}

function Icon({ name, size = 18 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1" /></>,
    test: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 13h6M9 17h6" /></>,
    report: <><path d="M4 20V10m6 10V4m6 16v-7m5 7H2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13 2 1-2 4-2-1-2 1v2H9v-2l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1V4h6v2l2 1 2-1 2 4-2 1z" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
    edit: <><path d="m14 5 5 5M4 20l4-.8L20 7a2 2 0 0 0-3-3L5 16z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M4 17v4h16v-4" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.file}
    </svg>
  );
}

function Sidebar() {
  const menu = [
    { icon: "home", label: "Dashboard", href: "/dashboard/admin" },
    { icon: "users", label: "Data Calon Siswa", href: "/dashboard/admin/siswa" },
    { icon: "test", label: "Tes Assessment", href: "/dashboard/admin/assessment", active: true },
    { icon: "file", label: "Verifikasi Dokumen", href: "/dashboard/admin/verifikasi" },
    { icon: "report", label: "Laporan & Analisis", href: "/dashboard/admin/laporan" },
    { icon: "settings", label: "Pengaturan", href: "/dashboard/admin/pengaturan" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-logo"><span>PG</span></div>
        <div>
          <strong>SPMB Permata Global</strong>
          <span>Admin</span>
        </div>
      </div>

      <p className="admin-sidebar-caption">ADMIN MASTER SIDEBAR</p>

      <nav className="admin-menu">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`admin-menu-link ${item.active ? "active" : ""} ${item.label === "Pengaturan" ? "settings-link" : ""}`}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link className="admin-back-button" href="/">
        <span className="admin-back-chevron">‹</span>Kembali
      </Link>
    </aside>
  );
}

function Header() {
  return (
    <header className="admin-topbar">
      <div className="admin-profile">
        <div className="admin-avatar">MA</div>
        <span>Marvin Adriansyah</span>
      </div>
    </header>
  );
}

function ScoreBadge({ children }) {
  return <span className="assessment-score">{children}</span>;
}

export default function AssessmentPage() {
  const [tab, setTab] = useState(1);
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("Semua Program");
  const [status, setStatus] = useState("Semua Status");
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [notice, setNotice] = useState("");
  const [importedFile, setImportedFile] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        const response = await fetch(
          "/api/admin/assessment/questions",
          { cache: "no-store" }
        );
        const data = await readResponseData(response);

        if (!response.ok) {
          throw new Error(data.message || "Gagal memuat bank soal.");
        }

        if (
          !Array.isArray(data.questions) ||
          data.questions.length !== initialQuestions.length
        ) {
          throw new Error("Data bank soal dari server tidak berisi 40 soal.");
        }

        if (!cancelled) {
          const normalized = initialQuestions.map((blank) => {
            const saved = data.questions.find(
              (item) => Number(item.id) === blank.id
            );

            if (!saved) return blank;

            return {
              id: blank.id,
              question: saved.question || "",
              options: Array.isArray(saved.options)
                ? [
                    saved.options[0] || "",
                    saved.options[1] || "",
                    saved.options[2] || "",
                    saved.options[3] || "",
                  ]
                : ["", "", "", ""],
              answer: Math.max(
                0,
                Math.min(3, Number(saved.answer) || 0)
              ),
            };
          });

          setQuestions(normalized);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Gagal memuat bank soal:", error);
          setNotice(error.message || "Gagal memuat bank soal.");
        }
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return students.filter((student) => {
      const total =
        Number(student.assessment || 0) +
        Number(student.wawancara || 0) +
        Number(student.kesehatan || 0);
      const passed = total / 3 >= 75;

      return (
        (
          (student.nama || "").toLowerCase().includes(keyword) ||
          (student.nisn || "").toLowerCase().includes(keyword)
        ) &&
        (program === "Semua Program" || student.program === program) &&
        (status === "Semua Status" ||
          (status === "Lulus" && passed) ||
          (status === "Tidak Lulus" && !passed))
      );
    });
  }, [students, search, program, status]);

  const currentQuestion =
    questions.find((question) => question.id === selectedQuestion) ||
    initialQuestions[0];

  function updateQuestion(field, value) {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === selectedQuestion
          ? { ...question, [field]: value }
          : question
      )
    );
  }

  function updateOption(index, value) {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === selectedQuestion
          ? {
              ...question,
              options: question.options.map((option, i) =>
                i === index ? value : option
              ),
            }
          : question
      )
    );
  }

  function updateScore(id, field, value) {
    if (value === "") {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === id ? { ...student, [field]: "" } : student
        )
      );
      return;
    }

    const score = Number(value);
    if (!Number.isFinite(score) || score < 0 || score > 100) return;

    setStudents((previous) =>
      previous.map((student) =>
        student.id === id ? { ...student, [field]: score } : student
      )
    );
  }

  function calculateResults() {
    if (students.length === 0) {
      setNotice("Belum ada siswa yang mengikuti tes assessment.");
      return;
    }

    setNotice(
      "Kelulusan dihitung berdasarkan rata-rata tiga komponen nilai. Ambang batas saat ini 75."
    );
  }

  async function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (students.length === 0) {
      setNotice("Belum ada data siswa untuk diperbarui.");
      event.target.value = "";
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (extension !== "csv") {
      setNotice(
        "Untuk saat ini, impor langsung mendukung file CSV. File Excel membutuhkan integrasi parser Excel."
      );
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const lines = text.trim().split(/\r?\n/);

      const imported = lines.slice(1).map((line) => {
        const columns = line.split(",").map((value) => value.trim());

        return {
          nisn: columns[0],
          assessment: Number(columns[1]),
          wawancara: Number(columns[2]),
          kesehatan: Number(columns[3]),
        };
      });

      let updatedCount = 0;

      setStudents((previous) =>
        previous.map((student) => {
          const record = imported.find(
            (row) => row.nisn === student.nisn
          );

          if (
            !record ||
            ![
              record.assessment,
              record.wawancara,
              record.kesehatan,
            ].every(
              (value) =>
                Number.isFinite(value) && value >= 0 && value <= 100
            )
          ) {
            return student;
          }

          updatedCount++;

          return {
            ...student,
            assessment: record.assessment,
            wawancara: record.wawancara,
            kesehatan: record.kesehatan,
          };
        })
      );

      setImportedFile(file.name);
      setNotice(
        `File dibaca. ${updatedCount} data nilai cocok dengan NISN yang tersedia.`
      );
    } catch {
      setNotice("File tidak dapat dibaca. Periksa format CSV kamu.");
    }

    event.target.value = "";
  }

  function downloadTemplate() {
    const csv = [
      "nisn,assessment,wawancara,kesehatan",
      ...students.map(
        (student) =>
          `${student.nisn},${student.assessment},${student.wawancara},${student.kesehatan}`
      ),
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "template-nilai-assessment.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  async function saveAll() {
    if (tab !== 3) {
      setNotice(
        students.length === 0
          ? "Belum ada nilai siswa untuk disimpan."
          : "Penyimpanan nilai siswa ke MySQL belum dihubungkan."
      );
      return;
    }

    if (saving) return;

    setSaving(true);
    setNotice("");

    try {
      const invalidQuestion = questions.find(
        (question, index) =>
          question.id !== index + 1 ||
          typeof question.question !== "string" ||
          !question.question.trim() ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          question.options.some(
            (option) => typeof option !== "string" || !option.trim()
          ) ||
          !Number.isInteger(question.answer) ||
          question.answer < 0 ||
          question.answer > 3
      );

      if (
        questions.length !== initialQuestions.length ||
        invalidQuestion
      ) {
        setNotice(
          invalidQuestion
            ? `Soal nomor ${invalidQuestion.id} belum lengkap atau tidak valid.`
            : "Bank soal harus berisi tepat 40 soal."
        );
        return;
      }

      const expectedQuestions = questions.map((question) => ({
        id: question.id,
        question: question.question.trim(),
        options: question.options.map((option) => option.trim()),
        answer: question.answer,
      }));

      const response = await fetch(
        "/api/admin/assessment/questions",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ questions: expectedQuestions }),
        }
      );
      const result = await readResponseData(response);

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menyimpan soal ke database."
        );
      }

      const checkResponse = await fetch(
        "/api/admin/assessment/questions",
        { cache: "no-store" }
      );
      const checkResult = await readResponseData(checkResponse);

      if (!checkResponse.ok) {
        throw new Error(
          checkResult.message ||
            "Soal tersimpan, tetapi gagal memuat ulang data."
        );
      }

      if (
        !Array.isArray(checkResult.questions) ||
        checkResult.questions.length !== expectedQuestions.length
      ) {
        throw new Error(
          "Data tersimpan, tetapi GET tidak mengembalikan tepat 40 soal."
        );
      }

      const matchesSavedData = expectedQuestions.every(
        (expected, index) => {
          const actual = checkResult.questions[index];
          return (
            Number(actual.id) === expected.id &&
            actual.question === expected.question &&
            Array.isArray(actual.options) &&
            actual.options.length === expected.options.length &&
            actual.options.every(
              (option, optionIndex) =>
                option === expected.options[optionIndex]
            ) &&
            Number(actual.answer) === expected.answer
          );
        }
      );

      if (!matchesSavedData) {
        throw new Error(
          "Data yang dibaca kembali tidak sama dengan soal yang dikirim."
        );
      }

      setQuestions(checkResult.questions);
      setNotice("Bank soal berhasil disimpan dan diverifikasi dari database.");
    } catch (error) {
      console.error("Gagal menyimpan bank soal:", error);
      setNotice(
        error.message || "Terjadi kesalahan saat menyimpan soal."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalStudents = students.length;

  const passedStudents = students.filter((student) => {
    const total =
      Number(student.assessment || 0) +
      Number(student.wawancara || 0) +
      Number(student.kesehatan || 0);

    return total / 3 >= 75;
  }).length;

  const averageScore =
    totalStudents > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum +
              Number(student.assessment || 0) +
              Number(student.wawancara || 0) +
              Number(student.kesehatan || 0),
            0
          ) /
          (totalStudents * 3)
        ).toFixed(1)
      : "0";

  return (
    <div className="admin-dashboard assessment-dashboard">
      <Sidebar />

      <main className="admin-main">
        <Header />

        <div className="admin-content assessment-content">
          <h1 className="assessment-page-title">Data Tes Assessment</h1>

          <div
            className="assessment-tabs"
            role="tablist"
            aria-label="Menu assessment"
          >
            {[
              { id: 1, label: "TAB 1: HASIL REKAP NILAI" },
              { id: 2, label: "TAB 2: INPUT DATA NILAI" },
              { id: 3, label: "TAB 3: EDIT SOAL TES" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`assessment-tab ${
                  tab === item.id ? "active" : ""
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {notice && (
            <div className="assessment-notice" role="status">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Tutup pemberitahuan"
              >
                ×
              </button>
            </div>
          )}

          {tab !== 3 && (
            <div className="assessment-filters">
              <label className="assessment-search">
                <Icon name="search" size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama/NISN siswa"
                />
              </label>

              <select
                value={program}
                onChange={(event) => setProgram(event.target.value)}
              >
                <option>Semua Program</option>
                <option>Junior High School</option>
                <option>Senior High School</option>
              </select>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>Semua Status</option>
                <option>Lulus</option>
                <option>Tidak Lulus</option>
              </select>
            </div>
          )}

          {tab === 1 && (
            <section className="assessment-panel">
              <div className="assessment-table-wrap">
                <table className="assessment-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Foto</th>
                      <th>Nama Siswa</th>
                      <th>NISN</th>
                      <th>Assessment</th>
                      <th>Wawancara</th>
                      <th>Kesehatan</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student, index) => {
                      const total =
                        Number(student.assessment || 0) +
                        Number(student.wawancara || 0) +
                        Number(student.kesehatan || 0);
                      const passed = total / 3 >= 75;

                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="assessment-student-avatar">
                              {(student.nama || "?").charAt(0)}
                            </div>
                          </td>
                          <td className="assessment-student-name">
                            {student.nama}
                          </td>
                          <td>{student.nisn}</td>
                          <td><ScoreBadge>{student.assessment}</ScoreBadge></td>
                          <td><ScoreBadge>{student.wawancara}</ScoreBadge></td>
                          <td><ScoreBadge>{student.kesehatan}</ScoreBadge></td>
                          <td><ScoreBadge>{(total / 3).toFixed(0)}</ScoreBadge></td>
                          <td>
                            <span
                              className={`assessment-status ${
                                passed ? "passed" : "failed"
                              }`}
                            >
                              <Icon
                                name={passed ? "check" : "file"}
                                size={12}
                              />
                              {passed ? "LULUS" : "TIDAK LULUS"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={9} className="assessment-empty">
                          Belum ada siswa yang menyelesaikan tes assessment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="assessment-table-footer">
                Menampilkan {filteredStudents.length} siswa
              </div>
            </section>
          )}

          {tab === 2 && (
            <>
              <section className="assessment-import-banner">
                <div className="assessment-excel-icon">X</div>

                <div className="assessment-import-copy">
                  <strong>Input Data Nilai Otomatis</strong>
                  <p>
                    Impor CSV untuk mengisi nilai berdasarkan NISN, atau ubah
                    nilai secara manual.
                  </p>
                  {importedFile && <small>File terakhir: {importedFile}</small>}
                </div>

                <div className="assessment-import-actions">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    hidden
                    onChange={importFile}
                  />

                  <button
                    className="assessment-primary-button"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Icon name="upload" size={17} />
                    <span>Upload / Import<small>File nilai</small></span>
                  </button>

                  <button
                    className="assessment-secondary-button"
                    type="button"
                    onClick={calculateResults}
                  >
                    <Icon name="check" size={17} />
                    <span>Hitung Kelulusan<small>Otomatis</small></span>
                  </button>

                  <button
                    className="assessment-secondary-button"
                    type="button"
                    onClick={downloadTemplate}
                  >
                    <Icon name="download" size={17} />
                    <span>Template<small>CSV</small></span>
                  </button>
                </div>
              </section>

              <section className="assessment-panel">
                <div className="assessment-manual-heading">
                  <div>
                    <h2>Input Nilai Manual</h2>
                    <p>
                      Klik nilai untuk mengedit. Nilai harus berada di antara
                      0–100.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="assessment-save-button"
                    onClick={saveAll}
                    disabled={saving || students.length === 0}
                  >
                    {saving ? "Menyimpan..." : "Simpan Semua"}
                  </button>
                </div>

                <div className="assessment-table-wrap">
                  <table className="assessment-table manual-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Siswa</th>
                        <th>NISN</th>
                        <th>Assessment</th>
                        <th>Wawancara</th>
                        <th>Kesehatan</th>
                        <th>Rata-rata</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td className="assessment-student-name">
                            {student.nama}
                          </td>
                          <td>{student.nisn}</td>

                          {["assessment", "wawancara", "kesehatan"].map(
                            (field) => (
                              <td key={field}>
                                <input
                                  className="assessment-score-input"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={student[field]}
                                  aria-label={`${field} ${student.nama}`}
                                  onChange={(event) =>
                                    updateScore(
                                      student.id,
                                      field,
                                      event.target.value
                                    )
                                  }
                                />
                              </td>
                            )
                          )}

                          <td>
                            <ScoreBadge>
                              {(
                                (Number(student.assessment || 0) +
                                  Number(student.wawancara || 0) +
                                  Number(student.kesehatan || 0)) /
                                3
                              ).toFixed(0)}
                            </ScoreBadge>
                          </td>
                        </tr>
                      ))}

                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="assessment-empty">
                            Belum ada data siswa untuk input nilai.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="assessment-table-footer">
                  Total data: {filteredStudents.length} siswa
                </div>
              </section>
            </>
          )}

          {tab === 3 && (
            <section className="assessment-question-layout">
              <div className="assessment-panel assessment-question-list">
                <h2>Daftar Soal</h2>

                {loadingQuestions ? (
                  <p className="assessment-question-hint">
                    Memuat bank soal dari database...
                  </p>
                ) : (
                  <>
                    <div className="assessment-question-grid">
                      {questions.map((question) => (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() =>
                            setSelectedQuestion(question.id)
                          }
                          className={`assessment-question-number ${
                            selectedQuestion === question.id
                              ? "selected"
                              : ""
                          } ${
                            question.question.trim()
                              ? "has-content"
                              : ""
                          }`}
                        >
                          {question.id}
                        </button>
                      ))}
                    </div>

                    <p className="assessment-question-hint">
                      Biru menandakan soal sedang dipilih atau sudah diisi.
                    </p>
                  </>
                )}
              </div>

              <div className="assessment-panel assessment-question-editor">
                <div className="assessment-editor-title">
                  <div>
                    <h2>Edit Soal Tes Assessment</h2>
                    <p>
                      Soal nomor {selectedQuestion} dari {questions.length}
                    </p>
                  </div>

                  <span className="assessment-question-label">
                    SOAL {selectedQuestion}
                  </span>
                </div>

                {loadingQuestions ? (
                  <p className="assessment-question-hint">
                    Mohon tunggu, soal sedang dimuat.
                  </p>
                ) : (
                  <>
                    <label className="assessment-field">
                      <span>Pertanyaan</span>
                      <textarea
                        rows={4}
                        value={currentQuestion.question}
                        onChange={(event) =>
                          updateQuestion("question", event.target.value)
                        }
                        placeholder="Tulis pertanyaan assessment di sini..."
                      />
                    </label>

                    <div className="assessment-options-title">
                      Pilihan Jawaban
                    </div>

                    {currentQuestion.options.map((option, index) => (
                      <div className="assessment-option-row" key={index}>
                        <span className="assessment-option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <input
                          value={option}
                          onChange={(event) =>
                            updateOption(index, event.target.value)
                          }
                          placeholder={`Masukkan pilihan ${String.fromCharCode(
                            65 + index
                          )}`}
                          aria-label={`Pilihan ${String.fromCharCode(
                            65 + index
                          )}`}
                        />

                        <label className="assessment-correct-choice">
                          <input
                            type="radio"
                            name={`answer-${selectedQuestion}`}
                            checked={currentQuestion.answer === index}
                            onChange={() =>
                              updateQuestion("answer", index)
                            }
                          />
                          Benar
                        </label>
                      </div>
                    ))}

                    <div className="assessment-question-navigation">
                      <button
                        type="button"
                        className="assessment-outline-button"
                        disabled={selectedQuestion === 1}
                        onClick={() =>
                          setSelectedQuestion((value) =>
                            Math.max(1, value - 1)
                          )
                        }
                      >
                        <Icon name="left" size={15} />
                        Soal Sebelumnya
                      </button>

                      <button
                        type="button"
                        className="assessment-save-button"
                        onClick={saveAll}
                        disabled={saving || loadingQuestions}
                      >
                        {saving ? "Menyimpan..." : "Simpan Soal"}
                      </button>

                      <button
                        type="button"
                        className="assessment-outline-button"
                        disabled={selectedQuestion === questions.length}
                        onClick={() =>
                          setSelectedQuestion((value) =>
                            Math.min(questions.length, value + 1)
                          )
                        }
                      >
                        Soal Selanjutnya
                        <Icon name="right" size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          <div className="assessment-bottom-actions">
            <Link
              href="/dashboard/admin/siswa"
              className="assessment-back-link"
            >
              <Icon name="left" size={15} />
              Kembali
            </Link>

            <div>
              <button
                type="button"
                className="assessment-cancel-button"
                onClick={() =>
                  setNotice(
                    "Perubahan yang belum disimpan tetap berada di tampilan saat ini."
                  )
                }
              >
                Batal
              </button>

              <button
                type="button"
                className="assessment-save-button"
                onClick={saveAll}
                disabled={saving || (tab === 3 && loadingQuestions)}
              >
                {saving ? "Menyimpan..." : "Simpan Semua"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
