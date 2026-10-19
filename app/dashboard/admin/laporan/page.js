
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../admin-dashboard.css";
import "./laporan.css";

const MENU = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "sidebarHome" },
  { label: "Data Calon Siswa", href: "/dashboard/admin/siswa", icon: "sidebarUsers" },
  { label: "Tes Assessment", href: "/dashboard/admin/assessment", icon: "sidebarTest" },
  { label: "Verifikasi Dokumen", href: "/dashboard/admin/verifikasi", icon: "sidebarFile" },
  { label: "Laporan & Analisis", href: "/dashboard/admin/laporan", icon: "sidebarReport", active: true },
  { label: "Pengaturan", href: "/dashboard/admin/pengaturan", icon: "sidebarSettings" },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
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
    users: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 4a4 4 0 0 1 0 7M18 14a5 5 0 0 1 4 5v2" /></>,
    test: <><path d="M6 3h9l5 5v13H6z" /><path d="M14 3v6h6M9 13h8M9 17h5" /></>,
    file: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h8M9 17h6" /></>,
    report: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13 2 1-2 4-2-1a8 8 0 0 1-2 1l-.5 2h-5L9 18l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1 .5-2h5L15 6l2 1 2-1 2 4-2 1z" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M4 17v4h16v-4" /></>,
    usersGroup: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20v-2a6 6 0 0 1 12 0v2M15 16a5 5 0 0 1 7 4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
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
      {paths[name] || paths.report}
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

function getRegistrationDate(student) {
  const value =
    student.tanggal_pendaftaran ||
    student.created_at ||
    student.tanggal_daftar;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeStatus(value) {
  const status = String(value || "").toLowerCase();

  if (
    status.includes("lolos") ||
    status.includes("diterima") ||
    status.includes("lulus") ||
    status === "passed" ||
    status === "accepted"
  ) {
    return "passed";
  }

  if (
    status.includes("tidak_lolos") ||
    status.includes("tidak lolos") ||
    status.includes("ditolak") ||
    status.includes("rejected")
  ) {
    return "failed";
  }

  return "pending";
}

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function DonutChart({ items, total }) {
  const colors = ["#078cf0", "#ff863b", "#7cb63d"];
  const safeTotal = total || 1;
  const segments = items.reduce(
    (result, item, index) => {
      const length = (item.count / safeTotal) * 100;
      return {
        offset: result.offset + length,
        segments: [
          ...result.segments,
          {
            ...item,
            color: colors[index],
            length,
            offset: result.offset,
          },
        ],
      };
    },
    { offset: 0, segments: [] }
  ).segments;

  return (
    <div className="report-donut-layout">
      <div className="report-donut">
        <svg viewBox="0 0 120 120" role="img" aria-label="Diagram pendaftar per jalur">
          <circle cx="60" cy="60" r="44" fill="none" stroke="#edf1f6" strokeWidth="19" />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke={segment.color}
              strokeWidth="19"
              strokeDasharray={`${segment.length * 2.7646} 276.46`}
              strokeDashoffset={-segment.offset * 2.7646}
              transform="rotate(-90 60 60)"
            />
          ))}
        </svg>
        <div className="report-donut-center">
          <strong>{formatNumber(total)}</strong>
          <span>Pendaftar</span>
        </div>
      </div>

      <div className="report-donut-legend">
        {segments.map((item) => (
          <div className="report-legend-item" key={item.label}>
            <span className="report-legend-dot" style={{ background: item.color }} />
            <div>
              <strong>{item.label}</strong>
              <small>
                {formatNumber(item.count)} siswa (
                {total ? Math.round((item.count / total) * 100) : 0}%)
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyChart({ rows }) {
  const max = Math.max(1, ...rows.map((row) => row.total));
  const chartMax = Math.ceil(max / 20) * 20 || 20;

  return (
    <div className="report-monthly-chart">
      <div className="report-chart-legend">
        <span><i className="legend-passed" />Lolos</span>
        <span><i className="legend-pending" />Menunggu</span>
        <span><i className="legend-failed" />Tidak Lolos</span>
      </div>

      <div className="report-chart-plot">
        <div className="report-y-axis">
          {[100, 75, 50, 25, 0].map((value) => (
            <span key={value}>
              {Math.round((chartMax * value) / 100)}
            </span>
          ))}
        </div>

        <div className="report-bars-area">
          {[100, 75, 50, 25, 0].map((value) => (
            <div
              key={value}
              className="report-grid-line"
              style={{ bottom: `${value}%` }}
            />
          ))}

          <div className="report-bars">
            {rows.map((row) => (
              <div className="report-bar-column" key={row.label}>
                <div className="report-bar-stack">
                  <span
                    className="report-bar-segment passed"
                    style={{ height: `${(row.passed / chartMax) * 100}%` }}
                    title={`Lolos: ${row.passed}`}
                  />
                  <span
                    className="report-bar-segment pending"
                    style={{ height: `${(row.pending / chartMax) * 100}%` }}
                    title={`Menunggu: ${row.pending}`}
                  />
                  <span
                    className="report-bar-segment failed"
                    style={{ height: `${(row.failed / chartMax) * 100}%` }}
                    title={`Tidak lolos: ${row.failed}`}
                  />
                </div>
                <span className="report-bar-label">{row.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LaporanAdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [academicYear, setAcademicYear] = useState("2026/2027");

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/siswa", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal memuat laporan.");
        }

        if (!cancelled) {
          setStudents(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Terjadi kesalahan saat memuat laporan.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReport();
    return () => {
      cancelled = true;
    };
  }, []);

  const report = useMemo(() => {
    const yearStart = Number(academicYear.slice(0, 4));
    const inYear = students.filter((student) => {
      const date = getRegistrationDate(student);
      if (!date) return false;

      const month = date.getMonth();
      const start = new Date(yearStart, 6, 1);
      const end = new Date(yearStart + 1, 6, 1);

      return date >= start && date < end;
    });

    const data = students.filter((student) => {
      const date = getRegistrationDate(student);
      return !date || date.getFullYear() === yearStart ||
        date.getFullYear() === yearStart + 1;
    });

    const yearData = inYear.length > 0 ? inYear : data;

    const counts = {
      total: yearData.length,
      passed: 0,
      pending: 0,
      failed: 0,
    };

    const programMap = new Map();
    const monthlyMap = new Map();

    for (const student of yearData) {
      const status = normalizeStatus(student.statusPendaftaran || student.status_pendaftaran);
      counts[status]++;

      const program = student.program || student.program_akademik || "Belum dipilih";
      if (!programMap.has(program)) {
        programMap.set(program, {
          program,
          quota: null,
          total: 0,
          passed: 0,
          pending: 0,
          failed: 0,
        });
      }

      const programRow = programMap.get(program);
      programRow.total++;
      programRow[status]++;

      const date = getRegistrationDate(student);
      if (date) {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyMap.has(key)) {
          monthlyMap.set(key, {
            year: date.getFullYear(),
            month: date.getMonth(),
            passed: 0,
            pending: 0,
            failed: 0,
            total: 0,
          });
        }

        const monthRow = monthlyMap.get(key);
        monthRow[status]++;
        monthRow.total++;
      }
    }

    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .slice(-6)
      .map((row) => ({ ...row, label: MONTHS[row.month] }));

    const programs = Array.from(programMap.values()).sort(
      (a, b) => b.total - a.total
    );

    return { counts, monthly, programs };
  }, [students, academicYear]);

  const routeCounts = useMemo(() => {
    const counts = new Map();

    for (const student of students) {
      const date = getRegistrationDate(student);
      const yearStart = Number(academicYear.slice(0, 4));

      if (date) {
        const start = new Date(yearStart, 6, 1);
        const end = new Date(yearStart + 1, 6, 1);
        if (date < start || date >= end) continue;
      }

      const route = String(
        student.tipe_pendaftaran || student.tipePendaftaran || ""
      ).toLowerCase();

      let label = "Jalur Zonasi";
      if (route.includes("prestasi")) label = "Jalur Prestasi";
      else if (route.includes("afirmasi")) label = "Jalur Afirmasi";

      counts.set(label, (counts.get(label) || 0) + 1);
    }

    return [
      { label: "Jalur Zonasi", count: counts.get("Jalur Zonasi") || 0 },
      { label: "Jalur Prestasi", count: counts.get("Jalur Prestasi") || 0 },
      { label: "Jalur Afirmasi", count: counts.get("Jalur Afirmasi") || 0 },
    ];
  }, [students, academicYear]);

  function exportReport() {
    const rows = [
      ["Program", "Kuota", "Pendaftar", "Lolos", "Menunggu", "Tidak Lolos", "Keterisian"],
      ...report.programs.map((item) => [
        item.program,
        item.quota ?? "Belum diatur",
        item.total,
        item.passed,
        item.pending,
        item.failed,
        item.quota ? `${Math.round((item.total / item.quota) * 100)}%` : "Belum diatur",
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) =>
        `"${String(cell).replaceAll('"', '""')}"`
      ).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-spmb-${academicYear.replace("/", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-dashboard laporan-dashboard">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content laporan-content">
          <div className="laporan-heading">
            <h1 className="admin-page-title">Laporan &amp; Analisis</h1>
            <div className="laporan-actions">
              <select
                value={academicYear}
                onChange={(event) => setAcademicYear(event.target.value)}
                aria-label="Tahun ajaran"
              >
                <option value="2025/2026">Tahun Ajaran 2025/2026</option>
                <option value="2026/2027">Tahun Ajaran 2026/2027</option>
                <option value="2027/2028">Tahun Ajaran 2027/2028</option>
              </select>
              <button onClick={exportReport} disabled={loading || !students.length}>
                <Icon name="download" size={16} />
                EKSPOR LAPORAN
              </button>
            </div>
          </div>

          {error && <div className="laporan-alert">{error}</div>}

          <section className="laporan-stat-grid">
            <article className="laporan-stat-card blue">
              <span>Total Pendaftar</span>
              <strong>{loading ? "—" : formatNumber(report.counts.total)}</strong>
              <small>Data pendaftar tahun ajaran</small>
            </article>
            <article className="laporan-stat-card green">
              <span>Lolos Seleksi</span>
              <strong>{loading ? "—" : formatNumber(report.counts.passed)}</strong>
              <small>
                {report.counts.total
                  ? `${Math.round((report.counts.passed / report.counts.total) * 100)}% dari pendaftar`
                  : "Belum ada data"}
              </small>
            </article>
            <article className="laporan-stat-card orange">
              <span>Menunggu Verifikasi</span>
              <strong>{loading ? "—" : formatNumber(report.counts.pending)}</strong>
              <small>
                {report.counts.total
                  ? `${Math.round((report.counts.pending / report.counts.total) * 100)}% dari pendaftar`
                  : "Belum ada data"}
              </small>
            </article>
            <article className="laporan-stat-card red">
              <span>Tidak Lolos</span>
              <strong>{loading ? "—" : formatNumber(report.counts.failed)}</strong>
              <small>
                {report.counts.total
                  ? `${Math.round((report.counts.failed / report.counts.total) * 100)}% dari pendaftar`
                  : "Belum ada data"}
              </small>
            </article>
          </section>

          <section className="laporan-charts-grid">
            <article className="laporan-panel">
              <h2>PENDAFTAR PER BULAN</h2>
              {loading ? (
                <div className="laporan-chart-empty">Memuat grafik...</div>
              ) : report.monthly.length ? (
                <MonthlyChart rows={report.monthly} />
              ) : (
                <div className="laporan-chart-empty">
                  Belum ada data tanggal pendaftaran untuk grafik bulanan.
                </div>
              )}
            </article>

            <article className="laporan-panel">
              <h2>PENDAFTAR PER JALUR</h2>
              {loading ? (
                <div className="laporan-chart-empty">Memuat diagram...</div>
              ) : (
                <DonutChart items={routeCounts} total={routeCounts.reduce((sum, item) => sum + item.count, 0)} />
              )}
            </article>
          </section>

          <section className="laporan-panel laporan-program-panel">
            <h2>REKAP PER PROGRAM</h2>

            <div className="laporan-table-wrap">
              <table className="laporan-table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Kuota</th>
                    <th>Pendaftar</th>
                    <th>Lolos</th>
                    <th>Menunggu</th>
                    <th>Tidak Lolos</th>
                    <th>Keterisian</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="laporan-empty">Memuat data...</td></tr>
                  ) : report.programs.length === 0 ? (
                    <tr><td colSpan="7" className="laporan-empty">Belum ada data pendaftaran pada tahun ajaran ini.</td></tr>
                  ) : (
                    report.programs.map((item) => (
                      <tr key={item.program}>
                        <td>{item.program}</td>
                        <td>{item.quota ?? "—"}</td>
                        <td>{formatNumber(item.total)}</td>
                        <td>{formatNumber(item.passed)}</td>
                        <td>{formatNumber(item.pending)}</td>
                        <td>{formatNumber(item.failed)}</td>
                        <td>
                          <span className="laporan-fill-badge">
                            {item.quota
                              ? `${Math.round((item.total / item.quota) * 100)}%`
                              : "—"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="laporan-footnote">
            Laporan dihitung dari data pendaftaran yang tersedia. Kuota program
            dan hasil seleksi final belum tersedia dari API saat ini, sehingga
            keterisian ditampilkan sebagai “—” sampai data kuota ditambahkan.
          </p>
        </div>
      </div>
    </main>
  );
}
