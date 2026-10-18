
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../admin-dashboard.css";
import "./pengaturan.css";

const initialProfile = {
  nama: "Marvin Adriansyah",
  email: "admin@spmb.sch.id",
  telepon: "0812 3456 7890",
};

const initialSchedule = [
  {
    id: "gelombang1",
    nama: "Pendaftaran Gelombang 1",
    mulai: "2027-01-04",
    selesai: "2027-02-28",
    warna: "blue",
  },
  {
    id: "gelombang2",
    nama: "Pendaftaran Gelombang 2",
    mulai: "2027-03-01",
    selesai: "2027-04-30",
    warna: "blue",
  },
  {
    id: "assessment",
    nama: "Tes Assessment",
    mulai: "2027-05-15",
    selesai: "2027-05-20",
    warna: "orange",
  },
  {
    id: "pengumuman",
    nama: "Pengumuman Hasil",
    mulai: "2027-05-31",
    selesai: "",
    warna: "green",
  },
];

const initialNotifications = [
  {
    id: "pendaftar",
    judul: "Pendaftar baru",
    deskripsi: "Beri tahu saat ada calon siswa mendaftar",
    aktif: true,
  },
  {
    id: "pembayaran",
    judul: "Pembayaran masuk",
    deskripsi: "Beri tahu saat pembayaran perlu diverifikasi",
    aktif: true,
  },
  {
    id: "ringkasan",
    judul: "Ringkasan harian",
    deskripsi: "Kirim rekap pendaftaran ke email setiap pagi",
    aktif: false,
  },
  {
    id: "pengumuman",
    judul: "Pengumuman otomatis",
    deskripsi: "Kirim pengumuman saat hasil seleksi rilis",
    aktif: true,
  },
];

function Icon({ name, size = 18 }) {
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
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    save: (
      <>
        <path d="M5 3h12l4 4v14H3V3z" />
        <path d="M7 3v6h10V3M7 21v-7h10v7" />
      </>
    ),
    left: <path d="m15 18-6-6 6-6" />,
    edit: (
      <>
        <path d="m14 5 5 5M4 20l4-.8L20 7a2 2 0 0 0-3-3L5 16z" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
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
    },
    {
      icon: "test",
      label: "Tes Assessment",
      href: "/dashboard/admin/assessment",
    },
    {
      icon: "file",
      label: "Verifikasi Dokumen",
      href: "/dashboard/admin/verifikasi",
    },
    {
      icon: "report",
      label: "Laporan & Analisis",
      href: "/dashboard/admin/laporan",
    },
    {
      icon: "settings",
      label: "Pengaturan",
      href: "/dashboard/admin/pengaturan",
      active: true,
    },
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
          <Link
            key={item.label}
            href={item.href}
            className={`admin-menu-link ${
              item.active ? "active" : ""
            } ${item.label === "Pengaturan" ? "settings-link" : ""}`}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link className="admin-back-button" href="/">
        <span className="admin-back-chevron">‹</span>
        Kembali
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

function formatDate(date) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PengaturanAdminPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [schedule, setSchedule] = useState(initialSchedule);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [showPasswordEditor, setShowPasswordEditor] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    lama: "",
    baru: "",
    konfirmasi: "",
  });

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  function showMessage(message, type = "success") {
    setNotice(message);
    setNoticeType(type);
  }

  function updateProfile(field, value) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateSchedule(id, field, value) {
    setSchedule((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function toggleNotification(id) {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, aktif: !item.aktif } : item
      )
    );
  }

  // Ambil profil admin dari MySQL melalui API.
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch(
          "/api/admin/pengaturan/profil",
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil profil admin."
          );
        }

        if (!cancelled && result.data) {
          setProfile({
            nama: result.data.nama || "",
            email: result.data.email || "",
            telepon: result.data.telepon || "",
          });
        }
      } catch (error) {
        if (!cancelled) {
          showMessage(
            error.message || "Gagal mengambil profil admin.",
            "error"
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // Simpan profil admin ke MySQL.
  
async function saveProfile(event) {
  event.preventDefault();

  if (!profile.nama.trim() || !profile.email.trim()) {
    showMessage("Nama dan email wajib diisi.", "error");
    return;
  }

  setSavingProfile(true);

  try {
    const response = await fetch("/api/admin/pengaturan/profil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    // Baca respons sebagai teks agar respons non-JSON juga tertangani.
    const responseText = await response.text();

    let result = {};

    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error(
        `Server mengirim respons yang bukan JSON. HTTP ${response.status}: ${responseText.slice(0, 300)}`
      );
    }

    if (!response.ok) {
      const errorMessage =
        result.debug ||
        result.message ||
        `Gagal menyimpan profil. HTTP ${response.status}`;

      console.error(
        `API profil gagal: HTTP ${response.status}`,
        JSON.stringify(result)
      );

      throw new Error(errorMessage);
    }

    if (result.data) {
      setProfile({
        nama: result.data.nama || "",
        email: result.data.email || "",
        telepon: result.data.telepon || "",
      });
    }

    showMessage(result.message || "Profil admin berhasil disimpan.");
  } catch (error) {
    console.error("Simpan profil admin:", error.message);

    showMessage(
      error.message || "Gagal menyimpan profil admin.",
      "error"
    );
  } finally {
    setSavingProfile(false);
  }
}

  function saveSchedule(event) {
    event.preventDefault();

    const invalidSchedule = schedule.find((item) => {
      if (!item.mulai) return true;

      if (
        item.selesai &&
        new Date(item.selesai) < new Date(item.mulai)
      ) {
        return true;
      }

      return false;
    });

    if (invalidSchedule) {
      showMessage(
        `Periksa tanggal pada ${invalidSchedule.nama}.`,
        "error"
      );
      return;
    }

    setShowScheduleEditor(false);

    showMessage(
      "Jadwal berhasil divalidasi. Penyimpanan ke MySQL belum dihubungkan.",
      "info"
    );
  }

  
async function changePassword(event) {
  event.preventDefault();

  if (!passwords.lama || !passwords.baru || !passwords.konfirmasi) {
    showMessage("Semua kolom password wajib diisi.", "error");
    return;
  }

  if (passwords.baru.length < 8) {
    showMessage("Password baru minimal 8 karakter.", "error");
    return;
  }

  if (passwords.baru === passwords.lama) {
    showMessage("Password baru harus berbeda dari password lama.", "error");
    return;
  }

  if (passwords.baru !== passwords.konfirmasi) {
    showMessage("Konfirmasi password baru tidak cocok.", "error");
    return;
  }

  setSavingPassword(true);

  try {
    const response = await fetch("/api/admin/pengaturan/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwords),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.debug ||
        result.message ||
        `Gagal mengubah password (HTTP ${response.status}).`
      );
    }

    setPasswords({
      lama: "",
      baru: "",
      konfirmasi: "",
    });

    setShowPasswordEditor(false);
    showMessage(result.message || "Password berhasil diperbarui.");
  } catch (error) {
    console.error("Ubah password admin:", error);
    showMessage(error.message || "Gagal mengubah password.", "error");
  } finally {
    setSavingPassword(false);
  }
}


  function saveNotifications() {
    showMessage(
      "Pilihan notifikasi diperbarui di tampilan ini, tetapi belum disimpan ke database.",
      "info"
    );
  }

  return (
    <div className="admin-dashboard settings-dashboard">
      <Sidebar />

      <main className="admin-main settings-main">
        <Header />

        <div className="admin-content settings-content">
          <div className="settings-heading">
            <div>
              <span className="settings-eyebrow">
                Pengaturan Admin
              </span>
              <h1>Pengaturan Admin</h1>
            </div>
          </div>

          {notice && (
            <div
              className={`settings-notice ${noticeType}`}
              role="status"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Tutup notifikasi"
              >
                ×
              </button>
            </div>
          )}

          <div className="settings-grid">
            {/* PROFIL ADMIN */}
            <section className="settings-card settings-profile-card">
              <div className="settings-card-heading">
                <h2>PROFIL ADMIN</h2>
              </div>

              <div className="settings-identity">
                <div className="settings-avatar">MA</div>
                <div>
                  <strong>{profile.nama || "Nama Admin"}</strong>
                  <span>Administrator</span>
                </div>
              </div>

              <form onSubmit={saveProfile}>
                <label className="settings-field">
                  <span>Nama Lengkap</span>
                  <input
                    type="text"
                    value={profile.nama}
                    onChange={(event) =>
                      updateProfile("nama", event.target.value)
                    }
                    placeholder="Masukkan nama lengkap"
                    maxLength={100}
                    required
                  />
                </label>

                <div className="settings-form-row">
                  <label className="settings-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(event) =>
                        updateProfile("email", event.target.value)
                      }
                      placeholder="admin@spmb.sch.id"
                      maxLength={150}
                      required
                    />
                  </label>

                  <label className="settings-field">
                    <span>No. Telepon</span>
                    <input
                      type="tel"
                      value={profile.telepon}
                      onChange={(event) =>
                        updateProfile("telepon", event.target.value)
                      }
                      placeholder="08xxxxxxxxxx"
                      maxLength={20}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="settings-button settings-button-orange"
                  disabled={savingProfile || loadingProfile}
                >
                  {loadingProfile
                    ? "MEMUAT..."
                    : savingProfile
                      ? "MENYIMPAN..."
                      : "SIMPAN PERUBAHAN"}
                </button>
              </form>
            </section>

            {/* JADWAL SELEKSI */}
            <section className="settings-card settings-schedule-card">
              <div className="settings-card-heading settings-heading-row">
                <h2>JADWAL SELEKSI</h2>

                {showScheduleEditor && (
                  <span className="settings-editing-label">
                    Mode edit
                  </span>
                )}
              </div>

              {!showScheduleEditor ? (
                <>
                  <div className="settings-schedule-list">
                    {schedule.map((item) => (
                      <div
                        className="settings-schedule-item"
                        key={item.id}
                      >
                        <span
                          className={`settings-dot ${item.warna}`}
                        />

                        <span className="settings-schedule-name">
                          {item.nama}
                        </span>

                        <span className="settings-schedule-date">
                          {item.selesai
                            ? `${formatDate(item.mulai)} - ${formatDate(
                                item.selesai
                              )}`
                            : formatDate(item.mulai)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="settings-button settings-button-blue"
                    onClick={() => setShowScheduleEditor(true)}
                  >
                    UBAH JADWAL
                  </button>
                </>
              ) : (
                <form
                  className="settings-schedule-editor"
                  onSubmit={saveSchedule}
                >
                  {schedule.map((item) => (
                    <div
                      className="settings-schedule-edit-item"
                      key={item.id}
                    >
                      <strong>{item.nama}</strong>

                      <label className="settings-field">
                        <span>Tanggal Mulai</span>
                        <input
                          type="date"
                          value={item.mulai}
                          onChange={(event) =>
                            updateSchedule(
                              item.id,
                              "mulai",
                              event.target.value
                            )
                          }
                          required
                        />
                      </label>

                      {item.id !== "pengumuman" && (
                        <label className="settings-field">
                          <span>Tanggal Selesai</span>
                          <input
                            type="date"
                            value={item.selesai}
                            onChange={(event) =>
                              updateSchedule(
                                item.id,
                                "selesai",
                                event.target.value
                              )
                            }
                            required
                          />
                        </label>
                      )}
                    </div>
                  ))}

                  <div className="settings-button-row">
                    <button
                      type="button"
                      className="settings-button settings-button-muted"
                      onClick={() => setShowScheduleEditor(false)}
                    >
                      BATAL
                    </button>

                    <button
                      type="submit"
                      className="settings-button settings-button-blue"
                    >
                      SIMPAN JADWAL
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* KEAMANAN AKUN */}
            <section className="settings-card settings-security-card">
              <div className="settings-card-heading">
                <h2>KEAMANAN AKUN</h2>
              </div>

              {!showPasswordEditor ? (
                <>
                  <div className="settings-password-preview">
                    <label className="settings-field">
                      <span>Password Lama</span>
                      <input
                        type="password"
                        value="password-preview"
                        readOnly
                        tabIndex={-1}
                        aria-label="Password lama tersimpan"
                      />
                    </label>

                    <label className="settings-field">
                      <span>Password Baru</span>
                      <input
                        type="password"
                        value="password-preview"
                        readOnly
                        tabIndex={-1}
                        aria-label="Password baru"
                      />
                    </label>

                    <label className="settings-field">
                      <span>Konfirmasi Password Baru</span>
                      <input
                        type="password"
                        value="password-preview"
                        readOnly
                        tabIndex={-1}
                        aria-label="Konfirmasi password baru"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className="settings-button settings-button-navy"
                    onClick={() => setShowPasswordEditor(true)}
                  >
                    UBAH PASSWORD
                  </button>
                </>
              ) : (
                <form
                  className="settings-password-form"
                  onSubmit={changePassword}
                >
                  <label className="settings-field">
                    <span>Password Lama</span>
                    <div className="settings-password-input">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={passwords.lama}
                        onChange={(event) =>
                          setPasswords((previous) => ({
                            ...previous,
                            lama: event.target.value,
                          }))
                        }
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowOldPassword((previous) => !previous)
                        }
                        aria-label="Tampilkan atau sembunyikan password lama"
                      >
                        <Icon name="eye" size={17} />
                      </button>
                    </div>
                  </label>

                  <label className="settings-field">
                    <span>Password Baru</span>
                    <div className="settings-password-input">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.baru}
                        onChange={(event) =>
                          setPasswords((previous) => ({
                            ...previous,
                            baru: event.target.value,
                          }))
                        }
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword((previous) => !previous)
                        }
                        aria-label="Tampilkan atau sembunyikan password baru"
                      >
                        <Icon name="eye" size={17} />
                      </button>
                    </div>
                  </label>

                  <label className="settings-field">
                    <span>Konfirmasi Password Baru</span>
                    <input
                      type="password"
                      value={passwords.konfirmasi}
                      onChange={(event) =>
                        setPasswords((previous) => ({
                          ...previous,
                          konfirmasi: event.target.value,
                        }))
                      }
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <div className="settings-button-row">
                    <button
                      type="button"
                      className="settings-button settings-button-muted"
                      onClick={() => {
                        setShowPasswordEditor(false);
                        setPasswords({
                          lama: "",
                          baru: "",
                          konfirmasi: "",
                        });
                      }}
                    >
                      BATAL
                    </button>

                    <button
                      type="submit"
                      className="settings-button settings-button-navy"
                    >
                      SIMPAN PASSWORD
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* NOTIFIKASI */}
            <section className="settings-card settings-notification-card">
              <div className="settings-card-heading">
                <h2>NOTIFIKASI</h2>
              </div>

              <div className="settings-notification-list">
                {notifications.map((item) => (
                  <div
                    className="settings-notification-item"
                    key={item.id}
                  >
                    <div className="settings-notification-copy">
                      <strong>{item.judul}</strong>
                      <span>{item.deskripsi}</span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.aktif}
                      aria-label={`${item.judul}: ${
                        item.aktif ? "aktif" : "nonaktif"
                      }`}
                      className={`settings-switch ${
                        item.aktif ? "is-on" : ""
                      }`}
                      onClick={() => toggleNotification(item.id)}
                    >
                      <span />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="settings-notification-save"
                onClick={saveNotifications}
              >
                <Icon name="save" size={15} />
                SIMPAN PREFERENSI
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
