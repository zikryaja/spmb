
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";
import "./admin-dashboard.css";

const menuItems = [
  { icon: "home", label: "Dashboard", href: "/dashboard/admin", active: true },
  { icon: "users", label: "Data Calon Siswa", href: "/dashboard/admin/siswa" },
  { icon: "test", label: "Tes Assessment", href: "/dashboard/admin/assessment" },
  { icon: "file", label: "Verifikasi Dokumen", href: "/dashboard/admin/verifikasi" },
  { icon: "report", label: "Laporan & Analisis", href: "/dashboard/admin/laporan" },
  { icon: "settings", label: "Pengaturan", href: "/dashboard/admin/pengaturan" },
];

function Icon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

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

  return <svg {...common}>{paths[name] || paths.file}</svg>;
}

function Brand() {
  return (
    <div className="admin-brand">
      <div className="admin-brand-logo">
        <span>PG</span>
      </div>
      <div>
        <strong>SPMB Permata Global</strong>
        <span>Admin</span>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <Brand />

      <p className="admin-sidebar-caption">ADMIN MASTER SIDEBAR</p>

      <nav className="admin-menu">
        {menuItems.map((item) => (
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

      <Link className="admin-back-button" href="/">
        <span className="admin-back-chevron">‹</span>
        Kembali
      </Link>
    </aside>
  );
}

function MoreButton() {
  return (
    <button className="admin-more-button" aria-label="Pilihan lainnya" type="button">
      <Icon name="more" size={22} />
    </button>
  );
}

function StatCard({ title, children, className = "" }) {
  return (
    <section className={`admin-stat-card ${className}`}>
      <MoreButton />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function RegistrationChart() {
  return (
    <section className="admin-chart-card">
      <div className="admin-chart-heading">
        <h2>TREND PENDAFTARAN SPMB</h2>
        <MoreButton />
      </div>

      <div className="admin-chart-legend">
        <span><i className="legend-purple" />2026/2027</span>
        <span><i className="legend-green" />2027/2028</span>
      </div>

      <div className="admin-line-chart">
        <div className="admin-y-labels">
          {[500, 400, 300, 200, 100, 0].map((n) => <span key={n}>{n}</span>)}
        </div>
        <div className="admin-line-plot">
          <svg viewBox="0 0 600 230" preserveAspectRatio="none" role="img" aria-label="Grafik tren pendaftaran dari Januari sampai Juni">
            <defs>
              <linearGradient id="registrationFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6384ff" stopOpacity=".38" />
                <stop offset="100%" stopColor="#6384ff" stopOpacity=".03" />
              </linearGradient>
            </defs>

            {[20, 55, 90, 125, 160, 195].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} className="chart-grid-line" />
            ))}
            {[0, 120, 240, 360, 480, 600].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="195" className="chart-grid-line vertical" />
            ))}

            <path d="M0 176 C40 170 75 155 120 146 S200 82 240 78 S320 100 360 105 S440 77 480 78 S560 45 600 35 L600 195 L0 195 Z" fill="url(#registrationFill)" />
            <path d="M0 176 C40 170 75 155 120 146 S200 82 240 78 S320 100 360 105 S440 77 480 78 S560 45 600 35" className="chart-line-purple" />
            <path d="M0 163 C45 143 80 100 120 78 S200 28 240 30 S320 49 360 55 S440 80 480 78 S560 33 600 22" className="chart-line-green" />

            {[[0,176],[120,146],[240,78],[360,105],[480,78],[600,35]].map(([x,y]) => (
              <circle key={`p${x}`} cx={x} cy={y} r="4.5" className="chart-dot-purple" />
            ))}
            {[[0,163],[120,78],[240,30],[360,55],[480,78],[600,22]].map(([x,y]) => (
              <circle key={`g${x}`} cx={x} cy={y} r="4.5" className="chart-dot-green" />
            ))}
          </svg>
          <div className="admin-x-labels">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentChart() {
  const data = [
    { month: "Jan", verified: 28, sent: 5, failed: 8 },
    { month: "Feb", verified: 20, sent: 10, failed: 40 },
    { month: "Mar", verified: 38, sent: 8, failed: 22 },
    { month: "Apr", verified: 14, sent: 29, failed: 34 },
    { month: "May", verified: 10, sent: 32, failed: 14 },
    { month: "Jun", verified: 24, sent: 39, failed: 20 },
  ];

  return (
    <section className="admin-chart-card">
      <div className="admin-chart-heading">
        <h2>STATUS PEMBAYARAN</h2>
        <MoreButton />
      </div>

      <div className="admin-bar-legend">
        <span><i className="bar-blue" />Terverifikasi</span>
        <span><i className="bar-teal" />Terkirim</span>
        <span><i className="bar-orange" />Gagal</span>
      </div>

      <div className="admin-bar-chart">
        <div className="admin-bar-y-labels">
          {[100, 80, 60, 40, 20, 0].map((n) => <span key={n}>{n}</span>)}
        </div>
        <div className="admin-bars-area">
          {[100, 80, 60, 40, 20, 0].map((n) => (
            <div key={n} className="admin-bar-grid" style={{ bottom: `${n}%` }} />
          ))}
          <div className="admin-bars">
            {data.map((item) => (
              <div className="admin-bar-column" key={item.month}>
                <div className="admin-bar-stack">
                  <span className="bar-segment failed" style={{ height: `${item.failed}%` }} />
                  <span className="bar-segment sent" style={{ height: `${item.sent}%` }} />
                  <span className="bar-segment verified" style={{ height: `${item.verified}%` }} />
                </div>
                <span className="admin-bar-month">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );

  if (!session) {
    redirect("/");
  }

  const initials = session.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="admin-dashboard">
      <Sidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-mobile-brand"><Brand /></div>
          <div className="admin-profile">
            <div className="admin-avatar">{initials || "AD"}</div>
            <span>{session.name}</span>
          </div>
        </header>

        <div className="admin-content">
          <h1 className="admin-page-title">Dashboard Overview</h1>

          <div className="admin-stats-grid">
            <StatCard title={<>Total Calon Siswa<br />Terdaftar</>} className="registered-card">
              <div className="admin-stat-number">625</div>
              <p className="admin-target">Target: 500</p>
              <div className="admin-target-progress">125% dari Target</div>
            </StatCard>

            <StatCard title={<>Total Siswa Lolos<br />Seleksi</>} className="passed-card">
              <div className="admin-stat-number">240</div>
              <p className="admin-target">Target: 250</p>
              <div className="admin-avatar-stack" aria-label="Siswa lolos seleksi">
                <span>MA</span><span>RA</span><span>FA</span><span>DI</span>
              </div>
            </StatCard>

            <StatCard title="Total Pembayaran" className="payment-card">
              <p className="admin-payment-caption">Dana Terkumpul:</p>
              <div className="admin-payment-total">Rp. 1.125.000.000</div>
              <p className="admin-payment-percent">Payments verified: 95%</p>
              <div className="admin-payment-progress"><span /></div>
              <div className="admin-payment-row"><span>Dana Kurang:</span><strong>Rp. 375.000.000</strong></div>
              <div className="admin-payment-row"><span>Target Dana:</span><strong>Rp. 1.500.000.000</strong></div>
            </StatCard>
          </div>

          <section className="admin-quick-card">
            <h2>UTILITAS CEPAT</h2>
            <div className="admin-quick-grid">
              <a href="/dashboard/admin/verifikasi" className="admin-quick-button orange">
                <span className="admin-quick-icon"><Icon name="document" /></span>
                VERIFIKASI DOKUMEN
              </a>
              <a href="/dashboard/admin/assessment" className="admin-quick-button blue">
                <span className="admin-quick-icon"><Icon name="assessment" /></span>
                TES ASSESSMENT
              </a>
              <a href="/dashboard/admin/laporan" className="admin-quick-button green">
                <span className="admin-quick-icon"><Icon name="upload" /></span>
                EKSPOR LAPORAN
              </a>
              <a href="/dashboard/admin/siswa" className="admin-quick-button blue">
                <span className="admin-quick-icon"><Icon name="users" /></span>
                DATA CALON SISWA
              </a>
              <a href="/dashboard/admin/pengumuman" className="admin-quick-button navy">
                <span className="admin-quick-icon"><Icon name="megaphone" /></span>
                KIRIM PENGUMUMAN
              </a>
              <a href="/dashboard/admin/pengaturan" className="admin-quick-button green">
                <span className="admin-quick-icon"><Icon name="settings" /></span>
                PENGATURAN JADWAL
              </a>
            </div>
          </section>

          <div className="admin-charts-grid">
            <RegistrationChart />
            <PaymentChart />
          </div>
        </div>
      </div>
    </main>
  );
}
