
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../admin-dashboard.css";
import "./verifikasi.css";

const DOCUMENTS = [
  { key: "kartu_keluarga", label: "Kartu Keluarga", short: "KK" },
  { key: "akta_kelahiran", label: "Akta Kelahiran", short: "AK" },
  { key: "ijazah", label: "Ijazah", short: "IJ" },
];

const MENU = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "sidebarHome" },
  { label: "Data Calon Siswa", href: "/dashboard/admin/siswa", icon: "sidebarUsers" },
  { label: "Tes Assessment", href: "/dashboard/admin/assessment", icon: "sidebarTest" },
  { label: "Verifikasi Dokumen", href: "/dashboard/admin/verifikasi", icon: "sidebarFile", active: true },
  { label: "Laporan & Analisis", href: "/dashboard/admin/laporan", icon: "sidebarReport" },
  { label: "Pengaturan", href: "/dashboard/admin/pengaturan", icon: "sidebarSettings" },
];

function Icon({ name, size = 18 }) {
  const paths = {
    sidebarHome: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></>,
    sidebarUsers: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1" /></>,
    sidebarTest: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    sidebarFile: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 13h6M9 17h6" /></>,
    sidebarReport: <><path d="M4 20V10m6 10V4m6 16v-7m5 7H2" /></>,
    sidebarSettings: <><circle cx="12" cy="12" r="3" /><path d="m19 13 2 1-2 4-2-1-2 1v2H9v-2l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1V4h6v2l2 1 2-1 2 4-2 1z" /></>,
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    users: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 3.5a4 4 0 0 1 0 7.5M18 14a5 5 0 0 1 4 5v2" /></>,
    test: <><path d="M6 3h9l5 5v13H6z" /><path d="M14 3v6h6M9 13h8M9 17h5" /></>,
    file: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h8M9 17h6" /></>,
    report: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13 2 1-2 4-2-1a8 8 0 0 1-2 1l-.5 2h-5L9 18l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1 .5-2h5L15 6l2 1 2-1 2 4-2 1z" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    save: <><path d="M5 3h12l4 4v14H3V3z" /><path d="M7 3v6h10V3M7 21v-7h10v7" /></>,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
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
        {MENU.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`admin-menu-link ${item.active ? "active" : ""} ${
              item.label === "Pengaturan" ? "settings-link" : ""
            }`}
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
        <div className="admin-avatar">AD</div>
        <span>Admin</span>
      </div>
    </header>
  );
}

function normalizeStatus(status) {
  if (status === "disetujui") return "approved";
  if (status === "ditolak") return "rejected";
  return "pending";
}

function statusLabel(status) {
  if (status === "approved") return "TERVERIFIKASI";
  if (status === "rejected") return "DITOLAK";
  return "BELUM TERVERIFIKASI";
}

function studentDocumentStatus(student) {
  const documents = DOCUMENTS.map((item) => student.dokumen?.[item.key]);
  const uploaded = documents.filter(Boolean);

  if (uploaded.length === 0) return "empty";
  if (uploaded.some((doc) => doc.status === "ditolak")) return "rejected";

  if (
    uploaded.length === DOCUMENTS.length &&
    uploaded.every((doc) => doc.status === "disetujui")
  ) {
    return "approved";
  }

  return "pending";
}

async function fetchStudents() {
  const response = await fetch("/api/admin/verifikasi", {
    cache: "no-store",
  });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal mengambil data dokumen.");
  }

  return result.data || [];
}

export default function VerifikasiDokumenPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("Semua Program");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState("kartu_keluarga");
  const [decisions, setDecisions] = useState({});
  const [notes, setNotes] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const pageSize = 10;

  const loadStudents = useCallback(async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
      setSelectedId((current) => {
        if (current && data.some(
          (student) => String(student.pendaftaran_id) === String(current)
        )) {
          return current;
        }
        return data[0]?.pendaftaran_id ?? null;
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    fetchStudents()
      .then((data) => {
        if (!isCurrent) return;
        setStudents(data);
        setSelectedId((current) => {
          if (current && data.some(
            (student) => String(student.pendaftaran_id) === String(current)
          )) {
            return current;
          }
          return data[0]?.pendaftaran_id ?? null;
        });
      })
      .catch((err) => {
        if (isCurrent) {
          setError(err.message || "Terjadi kesalahan saat memuat data.");
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const programs = useMemo(
    () => [...new Set(students.map((student) => student.program).filter(Boolean))],
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        String(student.nama || "").toLowerCase().includes(query) ||
        String(student.nisn || "").toLowerCase().includes(query) ||
        String(student.pendaftaran_id || "").toLowerCase().includes(query);

      const matchesProgram =
        program === "Semua Program" || student.program === program;

      const status = studentDocumentStatus(student);
      const matchesStatus =
        filterStatus === "Semua Status" ||
        (filterStatus === "Terverifikasi" && status === "approved") ||
        (filterStatus === "Menunggu" && status === "pending") ||
        (filterStatus === "Tidak Lengkap" &&
          (status === "empty" || status === "rejected"));

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [students, search, program, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const visibleStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const selectedStudent = students.find(
    (student) => String(student.pendaftaran_id) === String(selectedId)
  );

  const activeDocument = selectedStudent?.dokumen?.[selectedDocument] || null;
  const activeDecisionKey = activeDocument
    ? String(activeDocument.id)
    : "";

  const activeDecision = activeDecisionKey
    ? decisions[activeDecisionKey] || activeDocument.status
    : "";

  const counts = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let incomplete = 0;

    for (const student of students) {
      const status = studentDocumentStatus(student);
      if (status === "approved") approved++;
      else if (status === "empty" || status === "rejected") incomplete++;
      else pending++;
    }

    return { total: students.length, approved, pending, incomplete };
  }, [students]);

  function chooseDecision(status) {
    if (!activeDocument) {
      setNotice("Dokumen belum diunggah oleh calon siswa.");
      return;
    }

    setDecisions((previous) => ({
      ...previous,
      [String(activeDocument.id)]: status,
    }));
    setNotice("");
    setError("");
  }

  async function saveDecision() {
    if (!activeDocument) {
      setError("Tidak ada dokumen yang dapat diverifikasi.");
      return;
    }

    if (!["disetujui", "ditolak"].includes(activeDecision)) {
      setError("Pilih Setujui atau Tidak Setujui sebelum menyimpan.");
      return;
    }

    const catatan = notes[activeDecisionKey] || "";

    if (activeDecision === "ditolak" && !catatan.trim()) {
      setError("Isi alasan penolakan sebelum menyimpan.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const response = await fetch("/api/admin/verifikasi", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dokumen_id: activeDocument.id,
          status: activeDecision,
          catatan,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan verifikasi.");
      }

      setNotice(result.message || "Verifikasi berhasil disimpan.");
      setLoading(true);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Gagal menyimpan verifikasi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-dashboard verifikasi-dashboard">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content verifikasi-content">
          <div className="verifikasi-heading">
            <div>
              <h1 className="admin-page-title">Verifikasi Dokumen</h1>
              <p>Cek dan verifikasi kelengkapan dokumen calon siswa.</p>
            </div>
            <div className="verifikasi-heading-icon">
              <Icon name="file" size={24} />
            </div>
          </div>

          {notice && <div className="verifikasi-alert success">{notice}</div>}
          {error && <div className="verifikasi-alert error">{error}</div>}

          <section className="verifikasi-stats">
            <article className="verifikasi-stat blue">
              <div className="verifikasi-stat-icon"><Icon name="users" /></div>
              <div>
                <span>Total Pendaftar</span>
                <strong>{counts.total}</strong>
                <small>Calon siswa</small>
              </div>
            </article>

            <article className="verifikasi-stat orange">
              <div className="verifikasi-stat-icon"><Icon name="file" /></div>
              <div>
                <span>Menunggu Verifikasi</span>
                <strong>{counts.pending}</strong>
                <small>Dokumen perlu diperiksa</small>
              </div>
            </article>

            <article className="verifikasi-stat green">
              <div className="verifikasi-stat-icon"><Icon name="check" /></div>
              <div>
                <span>Dokumen Lengkap</span>
                <strong>{counts.approved}</strong>
                <small>Semua dokumen disetujui</small>
              </div>
            </article>

            <article className="verifikasi-stat red">
              <div className="verifikasi-stat-icon"><Icon name="close" /></div>
              <div>
                <span>Perlu Perbaikan</span>
                <strong>{counts.incomplete}</strong>
                <small>Belum lengkap atau ditolak</small>
              </div>
            </article>
          </section>

          <section className="verifikasi-filter-panel">
            <div className="verifikasi-search">
              <Icon name="search" size={19} />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama/NISN siswa"
                aria-label="Cari calon siswa"
              />
            </div>

            <select
              value={program}
              onChange={(event) => {
                setProgram(event.target.value);
                setPage(1);
              }}
              aria-label="Filter program"
            >
              <option>Semua Program</option>
              {programs.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(event) => {
                setFilterStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter status"
            >
              <option>Semua Status</option>
              <option>Menunggu</option>
              <option>Terverifikasi</option>
              <option>Tidak Lengkap</option>
            </select>
          </section>

          <section className="verifikasi-workspace">
            <div className="verifikasi-table-wrap">
              <table className="verifikasi-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>NISN</th>
                    <th>Dokumen</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="verifikasi-empty">Memuat data calon siswa...</td></tr>
                  ) : visibleStudents.length === 0 ? (
                    <tr><td colSpan="5" className="verifikasi-empty">Belum ada data calon siswa.</td></tr>
                  ) : (
                    visibleStudents.map((student, index) => {
                      const status = studentDocumentStatus(student);
                      const selected =
                        String(selectedId) === String(student.pendaftaran_id);

                      return (
                        <tr
                          key={student.pendaftaran_id}
                          className={selected ? "selected" : ""}
                          onClick={() => {
                            setSelectedId(student.pendaftaran_id);
                            setSelectedDocument("kartu_keluarga");
                            setNotice("");
                            setError("");
                          }}
                        >
                          <td>{(page - 1) * pageSize + index + 1}</td>
                          <td>
                            <button
                              className="verifikasi-student-name"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(student.pendaftaran_id);
                              }}
                            >
                              {student.nama || "-"}
                            </button>
                          </td>
                          <td>{student.nisn || "-"}</td>
                          <td>
                            <span className={`verifikasi-pill ${status}`}>
                              {status === "approved"
                                ? "LENGKAP"
                                : status === "rejected"
                                  ? "PERLU REVISI"
                                  : status === "empty"
                                    ? "BELUM ADA"
                                    : "MENUNGGU"}
                            </span>
                          </td>
                          <td>
                            <span className={`verifikasi-pill ${status}`}>
                              {status === "approved"
                                ? "TERVERIFIKASI"
                                : status === "rejected"
                                  ? "DITOLAK"
                                  : "BELUM VERIFIKASI"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className="verifikasi-pagination">
                <span>
                  {filteredStudents.length === 0
                    ? "0 data"
                    : `${(page - 1) * pageSize + 1}–${Math.min(
                        page * pageSize,
                        filteredStudents.length
                      )} dari ${filteredStudents.length}`}
                </span>
                <div>
                  <button
                    aria-label="Halaman sebelumnya"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    <Icon name="left" size={16} />
                  </button>
                  <span>{page} / {totalPages}</span>
                  <button
                    aria-label="Halaman selanjutnya"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    <Icon name="right" size={16} />
                  </button>
                </div>
              </div>
            </div>

            <aside className="verifikasi-detail">
              <div className="verifikasi-detail-title">
                <div>
                  <h2>{selectedStudent?.nama || "Pilih calon siswa"}</h2>
                  <p>
                    {selectedStudent
                      ? `NISN: ${selectedStudent.nisn || "-"}`
                      : "Pilih siswa dari daftar untuk memeriksa dokumen."}
                  </p>
                </div>
              </div>

              <div className="verifikasi-document-tabs">
                {DOCUMENTS.map((document) => {
                  const file = selectedStudent?.dokumen?.[document.key];
                  const active = selectedDocument === document.key;

                  return (
                    <button
                      key={document.key}
                      className={`verifikasi-document-tab ${active ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDocument(document.key);
                        setNotice("");
                        setError("");
                      }}
                    >
                      <span className="verifikasi-document-icon">
                        {document.short}
                      </span>
                      <span className="verifikasi-document-tab-text">
                        <strong>{document.label}</strong>
                        <small>
                          {!file
                            ? "Belum diunggah"
                            : file.status === "disetujui"
                              ? "Terverifikasi"
                              : file.status === "ditolak"
                                ? "Perlu diperbaiki"
                                : "Menunggu verifikasi"}
                        </small>
                      </span>
                      <span className={`verifikasi-mini-dot ${file ? normalizeStatus(file.status) : "missing"}`} />
                    </button>
                  );
                })}
              </div>

              <div className="verifikasi-preview">
                <div className="verifikasi-preview-top">
                  <strong>
                    {DOCUMENTS.find((item) => item.key === selectedDocument)?.label}
                  </strong>
                  {activeDocument && (
                    <span className={`verifikasi-pill ${normalizeStatus(activeDocument.status)}`}>
                      {statusLabel(normalizeStatus(activeDocument.status))}
                    </span>
                  )}
                </div>

                {activeDocument ? (
                  <div className="verifikasi-file-placeholder">
                    <div className="verifikasi-file-art">
                      <Icon name="file" size={44} />
                    </div>
                    <strong>{activeDocument.nama_file || "Dokumen diunggah"}</strong>
                    <p>Informasi file tersedia. Preview file memerlukan endpoint file yang aman.</p>
                  </div>
                ) : (
                  <div className="verifikasi-no-document">
                    <div><Icon name="upload" size={30} /></div>
                    <strong>Dokumen belum tersedia</strong>
                    <p>Calon siswa belum mengunggah {DOCUMENTS.find((item) => item.key === selectedDocument)?.label}.</p>
                  </div>
                )}
              </div>

              <div className="verifikasi-decision">
                <label>Keputusan Verifikasi</label>
                <div className="verifikasi-decision-buttons">
                  <button
                    className={`verifikasi-approve ${activeDecision === "disetujui" ? "chosen" : ""}`}
                    disabled={!activeDocument || saving}
                    onClick={() => chooseDecision("disetujui")}
                  >
                    <Icon name="check" size={17} />
                    Setujui / Verifikasi
                  </button>
                  <button
                    className={`verifikasi-reject ${activeDecision === "ditolak" ? "chosen" : ""}`}
                    disabled={!activeDocument || saving}
                    onClick={() => chooseDecision("ditolak")}
                  >
                    <Icon name="close" size={17} />
                    Tidak Setujui
                  </button>
                </div>

                {activeDecision === "ditolak" && (
                  <textarea
                    value={notes[activeDecisionKey] || ""}
                    onChange={(event) =>
                      setNotes((previous) => ({
                        ...previous,
                        [activeDecisionKey]: event.target.value,
                      }))
                    }
                    placeholder="Tuliskan alasan penolakan dokumen..."
                    rows={3}
                  />
                )}

                <button
                  className="verifikasi-save"
                  disabled={!activeDocument || saving || !activeDecision}
                  onClick={saveDecision}
                >
                  <Icon name="save" size={17} />
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}
