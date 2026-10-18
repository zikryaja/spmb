
"use client";

import { useEffect, useMemo, useState } from "react";
import "../admin-dashboard.css";
import "./siswa.css";

function Icon({ name, size = 22 }) {
  const paths = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v12h14V9M9 21v-7h6v7" />
    </>
  ),

  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1" />
    </>
  ),

  test: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),

  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h4M9 13h6M9 17h6" />
    </>
  ),

  report: (
    <>
      <path d="M4 20V10m6 10V4m6 16v-7m5 7H2" />
    </>
  ),

  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19 13 2 1-2 4-2-1-2 1v2H9v-2l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1V4h6v2l2 1 2-1 2 4-2 1z" />
    </>
  ),

  // Pertahankan path ikon lainnya yang sudah ada.
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
    {
      icon: "users",
      label: "Data Calon Siswa",
      href: "/dashboard/admin/siswa",
      active: true,
    },
    { icon: "test", label: "Tes Assessment", href: "/dashboard/admin/assessment" },
    { icon: "file", label: "Verifikasi Dokumen", href: "/dashboard/admin/verifikasi" },
    { icon: "report", label: "Laporan & Analisis", href: "/dashboard/admin/laporan" },
    { icon: "settings", label: "Pengaturan", href: "/dashboard/admin/pengaturan" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-logo">
          <span>PG</span>
        </div>
        <div>
          <strong>SPMB Permata Global</strong>
          <span>Admin</span>
        </div>
      </div>

      <p className="admin-sidebar-caption">ADMIN MASTER SIDEBAR</p>

      <nav className="admin-menu">
        {menu.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`admin-menu-link ${item.active ? "active" : ""} ${
              item.label === "Pengaturan" ? "settings-link" : ""
            }`}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className="admin-back-button" href="/">
        <span className="admin-back-chevron">‹</span>
        Kembali
      </a>
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

function getStatusLabel(value) {
  if (!value) return "Belum ada status";

  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ");
}

function getStatusClass(value) {
  const normalized = String(value || "").toLowerCase();

  if (
    normalized.includes("verifikasi") ||
    normalized === "verified" ||
    normalized === "approved"
  ) {
    return "verified";
  }

  if (
    normalized === "draft" ||
    normalized.includes("menunggu") ||
    normalized.includes("pending")
  ) {
    return "pending";
  }

  if (
    normalized.includes("ditolak") ||
    normalized.includes("revisi") ||
    normalized.includes("reject")
  ) {
    return "rejected";
  }

  return "pending";
}

function mapStudent(item) {
  return {
    id: item.user_id,
    pendaftaranId: item.pendaftaran_id,
    nama: item.nama || "",
    nisn: item.nisn_id || "",
    telepon: item.nomor_telepon || "",
    program: item.program_akademik || "",
    statusPendaftaran: item.status_pendaftaran || "draft",
  };
}

export default function DataCalonSiswaPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("Semua Program");
  const [status, setStatus] = useState("Semua Status");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionType, setActionType] = useState("success");

  const [editing, setEditing] = useState(null);
  const [deleteStudentData, setDeleteStudentData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const pageSize = 10;

  async function loadStudents(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/admin/siswa", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal mengambil data calon siswa."
        );
      }

      setStudents((result.data || []).map(mapStudent));
    } catch (error) {
      setErrorMessage(
        error.message || "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const programs = useMemo(
    () => [
      ...new Set(
        students
          .map((student) => student.program)
          .filter(Boolean)
      ),
    ],
    [students]
  );

  const statuses = useMemo(
    () => [
      ...new Set(
        students
          .map((student) => student.statusPendaftaran)
          .filter(Boolean)
      ),
    ],
    [students]
  );

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.nama.toLowerCase().includes(keyword) ||
        String(student.nisn).toLowerCase().includes(keyword);

      const matchesProgram =
        program === "Semua Program" || student.program === program;

      const matchesStatus =
        status === "Semua Status" ||
        student.statusPendaftaran === status;

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [students, search, program, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function showMessage(message, type = "success") {
    setActionMessage(message);
    setActionType(type);
  }

  async function saveEdit(event) {
    event.preventDefault();

    if (!editing || actionLoading) return;

    const nama = editing.nama.trim();
    const nisn = editing.nisn.trim();
    const telepon = editing.telepon.trim();
    const programAkademik = editing.program.trim();

    if (!nama || !nisn) {
      showMessage("Nama dan NISN wajib diisi.", "error");
      return;
    }

    if (!/^\d{10}$/.test(nisn)) {
      showMessage("NISN harus terdiri dari 10 angka.", "error");
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage("");

      const response = await fetch(
        `/api/admin/siswa/${editing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama,
            nisn,
            telepon,
            program: programAkademik,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menyimpan perubahan."
        );
      }

      setEditing(null);
      showMessage(
        result.message || "Data calon siswa berhasil diperbarui."
      );

      await loadStudents(false);
    } catch (error) {
      showMessage(
        error.message || "Terjadi kesalahan saat menyimpan data.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteStudent() {
    if (!deleteStudentData || actionLoading) return;

    try {
      setActionLoading(true);
      setActionMessage("");

      const response = await fetch(
        `/api/admin/siswa/${deleteStudentData.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menghapus calon siswa."
        );
      }

      setDeleteStudentData(null);
      showMessage(
        result.message || "Data calon siswa berhasil dihapus."
      );

      await loadStudents(false);
    } catch (error) {
      showMessage(
        error.message || "Terjadi kesalahan saat menghapus data.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <main className="admin-dashboard">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content student-content">
          <h1 className="admin-page-title">Data Calon Siswa</h1>

          {actionMessage && (
            <div
              role="status"
              className={`student-action-message ${
                actionType === "error" ? "error" : ""
              }`}
            >
              <span>{actionMessage}</span>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => setActionMessage("")}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          )}

          <section className="student-filters">
            <label className="student-search">
              <Icon name="search" size={22} />
              <input
                type="search"
                placeholder="Cari nama/NISN siswa"
                value={search}
                onChange={(event) =>
                  updateFilter(setSearch, event.target.value)
                }
              />
            </label>

            <select
              aria-label="Filter program"
              value={program}
              onChange={(event) =>
                updateFilter(setProgram, event.target.value)
              }
            >
              <option value="Semua Program">Program: Semua Program</option>
              {programs.map((item) => (
                <option key={item} value={item}>
                  Program: {item}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter status pendaftaran"
              value={status}
              onChange={(event) =>
                updateFilter(setStatus, event.target.value)
              }
            >
              <option value="Semua Status">Status: Semua Status</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  Status: {getStatusLabel(item)}
                </option>
              ))}
            </select>
          </section>

          <div className="student-table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Foto</th>
                  <th>Nama Siswa</th>
                  <th>NISN</th>
                  <th>No. Telepon</th>
                  <th>Program</th>
                  <th>Status Pendaftaran</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} className="student-empty">
                      Memuat data calon siswa dari database...
                    </td>
                  </tr>
                )}

                {!loading && errorMessage && (
                  <tr>
                    <td colSpan={8} className="student-empty">
                      {errorMessage}
                      <br />
                      <button
                        type="button"
                        className="student-retry-button"
                        onClick={() => loadStudents()}
                      >
                        Coba Lagi
                      </button>
                    </td>
                  </tr>
                )}

                {!loading &&
                  !errorMessage &&
                  visibleStudents.map((student, index) => (
                    <tr
                      key={`${student.id}-${student.pendaftaranId || "none"}`}
                    >
                      <td>
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td>
                        <div className="student-photo">
                          {student.nama
                            .split(/\s+/)
                            .filter(Boolean)
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "?"}
                        </div>
                      </td>

                      <td className="student-name">
                        {student.nama || "-"}
                      </td>

                      <td>{student.nisn || "-"}</td>
                      <td>{student.telepon || "-"}</td>
                      <td>{student.program || "Belum dipilih"}</td>

                      <td>
                        <span
                          className={`student-registration-status ${getStatusClass(
                            student.statusPendaftaran
                          )}`}
                        >
                          {getStatusLabel(student.statusPendaftaran)}
                        </span>
                      </td>

                      <td>
                        <div className="student-actions">
                          <button
                            type="button"
                            className="student-action edit"
                            title="Edit data"
                            aria-label={`Edit ${student.nama}`}
                            onClick={() => {
                              setActionMessage("");
                              setEditing({ ...student });
                            }}
                          >
                            <Icon name="edit" size={21} />
                          </button>

                          <button
                            type="button"
                            className="student-action delete"
                            title="Hapus data"
                            aria-label={`Hapus ${student.nama}`}
                            onClick={() => {
                              setActionMessage("");
                              setDeleteStudentData(student);
                            }}
                          >
                            <Icon name="trash" size={21} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  !errorMessage &&
                  visibleStudents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="student-empty">
                        {students.length === 0
                          ? "Belum ada akun calon siswa yang terdaftar."
                          : "Tidak ada calon siswa yang cocok dengan pencarian atau filter."}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className="student-pagination">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((value) => Math.max(1, value - 1))
              }
            >
              <Icon name="back" size={20} />
            </button>

            <span className="student-current-page">{currentPage}</span>
            <span className="student-page-total">/ {totalPages}</span>

            <button
              type="button"
              aria-label="Halaman selanjutnya"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
            >
              <Icon name="next" size={20} />
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div
          className="student-modal-backdrop"
          onClick={() => {
            if (!actionLoading) setEditing(null);
          }}
        >
          <form
            className="student-modal"
            onSubmit={saveEdit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="student-modal-heading">
              <h2>Edit Data Calon Siswa</h2>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setEditing(null)}
                aria-label="Tutup modal"
              >
                <Icon name="close" />
              </button>
            </div>

            <label>
              Nama Siswa
              <input
                required
                maxLength={100}
                value={editing.nama}
                onChange={(event) =>
                  setEditing({ ...editing, nama: event.target.value })
                }
              />
            </label>

            <label>
              NISN
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={editing.nisn}
                onChange={(event) =>
                  setEditing({ ...editing, nisn: event.target.value })
                }
              />
            </label>

            <label>
              Nomor Telepon
              <input
                maxLength={20}
                value={editing.telepon}
                onChange={(event) =>
                  setEditing({ ...editing, telepon: event.target.value })
                }
              />
            </label>

            <label>
              Program Akademik
              <input
                maxLength={100}
                value={editing.program}
                onChange={(event) =>
                  setEditing({ ...editing, program: event.target.value })
                }
              />
            </label>

            <button
              type="submit"
              className="student-save-button"
              disabled={actionLoading}
            >
              {actionLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      )}

      {deleteStudentData && (
        <div
          className="student-modal-backdrop"
          onClick={() => {
            if (!actionLoading) setDeleteStudentData(null);
          }}
        >
          <div
            className="student-modal student-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Hapus calon siswa?</h2>

            <p>
              Kamu akan menghapus akun <strong>{deleteStudentData.nama}</strong>,
              data pendaftarannya, dan data orang tua yang terkait. Tindakan
              ini tidak bisa dibatalkan.
            </p>

            <div className="student-modal-actions">
              <button
                type="button"
                className="student-cancel-button"
                disabled={actionLoading}
                onClick={() => setDeleteStudentData(null)}
              >
                Batal
              </button>

              <button
                type="button"
                className="student-confirm-delete"
                disabled={actionLoading}
                onClick={deleteStudent}
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
