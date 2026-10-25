"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./StudentDashboardOverlay.css";

function Icon({ name, size = 18 }) {
  const icons = {
    form: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 8h.01M11 8h5M8 12h.01M11 12h5M8 16h.01M11 16h5" />
      </>
    ),
    assessment: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h4" />
      </>
    ),
    payment: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m-5 5 5-5 5 5" />
        <path d="M5 14v5h14v-5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h4M9 13h6M9 17h6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function formatStatus(value) {
  if (!value) return "Status pendaftaran belum tersedia";

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function StudentDashboardOverlay({ onClose }) {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/student/dashboard", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil data dashboard siswa."
          );
        }

        if (active) setDashboard(result);
      } catch (loadError) {
        if (active) {
          setError(
            loadError.message || "Gagal mengambil data dashboard siswa."
          );
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const student = dashboard?.student;
  const completed = dashboard?.progress.completed || 0;
  const total = dashboard?.progress.total || 4;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div
      className="student-dashboard-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="student-dashboard-shell">
        <span className="student-dashboard-label">Account</span>
        <section
          className="student-dashboard-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-dashboard-title"
        >
          <header className="student-dashboard-header">
            <h1 id="student-dashboard-title">Informasi Akun</h1>
            <button
              type="button"
              className="student-dashboard-close"
              onClick={onClose}
              aria-label="Tutup dashboard siswa"
            >
              ×
            </button>
          </header>

          {error ? (
            <p className="student-dashboard-message" role="alert">
              {error}
            </p>
          ) : !student ? (
            <p className="student-dashboard-message" role="status">
              Memuat informasi akun...
            </p>
          ) : (
            <>
              <div className="student-account">
                <div
                  className="student-avatar"
                  role="img"
                  aria-label="Foto profil belum tersedia"
                  title="Foto profil belum tersedia"
                >
                  {getInitials(student.nama)}
                </div>
                <div className="student-account-details">
                  <p>Halo, {student.nama.split(/\s+/)[0]}</p>
                  <strong>{student.nama}</strong>
                  <span>Status: Calon Siswa</span>
                  <small>
                    Pendaftaran: {formatStatus(student.statusPendaftaran)}
                  </small>
                </div>
              </div>

              <section className="student-progress-summary">
                <h2>PROGRESS SPMB</h2>
                <div
                  className="student-progress-track"
                  role="progressbar"
                  aria-label="Progress SPMB"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={percentage}
                >
                  <span style={{ width: `${percentage}%` }} />
                  <strong
                    className={percentage === 0 ? "is-empty" : ""}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage}% SELESAI
                  </strong>
                </div>
                <p>
                  {completed} dari {total} Langkah Terisi
                </p>
                <small>
                  Progres dihitung dari data pendaftaran yang tersimpan.
                </small>
              </section>

              <div className="student-dashboard-grid">
                <section className="student-dashboard-card student-steps-card">
                  <h2>PROGRESS</h2>
                  <div className="student-step-list">
                    <article className="student-step">
                      <span className="student-step-icon form">
                        <Icon name="form" />
                      </span>
                      <div className="student-step-copy">
                        <strong>Mengisi Formulir Pendaftaran</strong>
                        <span>
                          {student.registrationCompleted
                            ? "Sudah selesai"
                            : "Data formulir belum tersedia"}
                        </span>
                      </div>
                      {student.registrationCompleted && (
                        <span
                          className="student-step-check"
                          aria-label="Selesai"
                        >
                          <Icon name="check" size={13} />
                        </span>
                      )}
                    </article>
                    <article className="student-step">
                      <span className="student-step-icon assessment">
                        <Icon name="assessment" />
                      </span>
                      <div className="student-step-copy">
                        <strong>Mengikuti Tes Assessment</strong>
                        <span>Fitur assessment siswa belum tersedia</span>
                      </div>
                      <button type="button" disabled>
                        Belum tersedia
                      </button>
                    </article>
                    <article className="student-step">
                      <span className="student-step-icon payment">
                        <Icon name="payment" />
                      </span>
                      <div className="student-step-copy">
                        <strong>Pembayaran (Minimal 50%)</strong>
                        <span>Status pembayaran belum tersedia</span>
                      </div>
                      <Link href="/#enrollment" onClick={onClose}>
                        Info
                      </Link>
                    </article>
                    <article className="student-step">
                      <span className="student-step-icon upload">
                        <Icon name="upload" />
                      </span>
                      <div className="student-step-copy">
                        <strong>Unggah Dokumen</strong>
                        <span>Fitur unggah dokumen belum tersedia</span>
                      </div>
                      <button type="button" disabled>
                        Belum tersedia
                      </button>
                    </article>
                  </div>
                </section>

                <section className="student-dashboard-card student-schedule-card">
                  <h2>SCHEDULE</h2>
                  {["Tes Assessment", "Pembayaran", "Unggah Dokumen"].map(
                    (item) => (
                      <div className="student-information-item" key={item}>
                        <Icon name="clock" size={17} />
                        <div>
                          <strong>{item}</strong>
                          <span>Jadwal belum tersedia</span>
                        </div>
                      </div>
                    )
                  )}
                </section>

                <section className="student-dashboard-card student-documents-card">
                  <h2>DOCUMENTS</h2>
                  {["Kartu Keluarga", "Akta Kelahiran", "Foto 3x4"].map(
                    (item) => (
                      <div className="student-document-item" key={item}>
                        <span>{item}</span>
                        <small>Data belum tersedia</small>
                      </div>
                    )
                  )}
                </section>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
