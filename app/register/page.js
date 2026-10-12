 "use client";

import { useState } from "react";
import "./register.css";

const initialForm = {
  tipe_pendaftaran: "", program_akademik: "", nama: "", nisn_id: "",
  password: "", jenis_kelamin: "", tempat_lahir: "", tanggal_lahir: "",
  anak_ke: "", agama: "", nomor_telepon: "", tempat_tinggal: "",
  tanggal_mulai_tinggal: "", alamat: "", sekolah_sebelumnya: "",
  tinggi_badan: "", berat_badan: "", golongan_darah: "", ukuran_seragam: "",
  nama_ayah: "", tempat_lahir_ayah: "", tanggal_lahir_ayah: "",
  pendidikan_ayah: "", pekerjaan_ayah: "", penghasilan_ayah: "",
  telepon_ayah: "", alamat_ayah: "",
  nama_ibu: "", tempat_lahir_ibu: "", tanggal_lahir_ibu: "",
  pendidikan_ibu: "", pekerjaan_ibu: "", penghasilan_ibu: "",
  telepon_ibu: "", alamat_ibu: "",
  nama_wali: "", tempat_lahir_wali: "", tanggal_lahir_wali: "",
  pendidikan_wali: "", pekerjaan_wali: "", penghasilan_wali: "",
  telepon_wali: "", alamat_wali: "",
};

const educationOptions = [
  "Tidak sekolah", "SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3",
];
const incomeOptions = [
  "Kurang dari Rp1.000.000", "Rp1.000.000–Rp3.000.000",
  "Rp3.000.001–Rp5.000.000", "Lebih dari Rp5.000.000",
];

function InputField({
  label, name, value, onChange, type = "text", options,
  required = false, placeholder, wide = false, min,
}) {
  return (
    <div className={`register-field ${wide ? "register-wide" : ""}`}>
      <label htmlFor={name}>
        {label}{required && <span className="register-required"> *</span>}
      </label>
      {options ? (
        <select id={name} name={name} value={value} onChange={onChange} required={required}>
          <option value="">Pilih {label.toLowerCase()}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name} name={name} value={value} onChange={onChange}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          required={required} rows={3}
        />
      ) : (
        <input
          id={name} name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          required={required} min={min}
        />
      )}
    </div>
  );
}

function ParentFields({ prefix, title, form, onChange, optional = false }) {
  const fields = [
    { key: "nama", label: "Nama Lengkap", required: true },
    { key: "tempat_lahir", label: "Tempat Lahir" },
    { key: "tanggal_lahir", label: "Tanggal Lahir", type: "date" },
    { key: "pendidikan", label: "Pendidikan Terakhir", options: educationOptions },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "penghasilan", label: "Penghasilan per Bulan", options: incomeOptions },
    { key: "telepon", label: "Nomor Telepon", type: "tel" },
    { key: "alamat", label: "Alamat", type: "textarea", wide: true },
  ];

  return (
    <section className="register-section">
      <h3 className="register-section-title">{title}</h3>
      <div className="register-grid">
        {fields.map((field) => {
          const name = `${prefix}_${field.key}`;
          return (
            <InputField
              key={name} name={name} label={field.label}
              type={field.type || "text"} value={form[name]} onChange={onChange}
              options={field.options} required={!optional && Boolean(field.required)}
              wide={field.wide}
            />
          );
        })}
      </div>
    </section>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="logo">
          <img src="/assets/logo.png" alt="Permata Global" />
        </a>
        <nav className="nav-menu">
          <a href="/">Home</a>
          <a href="/#about">Why Permata Global</a>
          <a href="/#activities">Activities</a>
          <a href="/register" className="active">Enrollment</a>
          <a href="/login">Login</a>
        </nav>
        <a href="/#contact" className="contact-btn">Hubungi Kami</a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-column school-info">
          <img src="/assets/logo.png" alt="Permata Global" className="footer-logo" />
          <p>Jl. Pelangi Raya 10, Perumahan<br />Indah 2 No.1, Rangkapan Jaya,<br />Pancoran Mas, Kota Depok,<br />Jawa Barat 16435</p>
          <p>☎ +62 812 1111555</p>
          <p>✉ permataglobaldepok@gmail.com</p>
          <div className="socials"><span>f</span><span>◎</span><span>▶</span><span>in</span></div>
        </div>
        <div className="footer-column">
          <h3>Program</h3><a href="/#program">Preschool</a><a href="/#program">Kindergarten</a>
          <a href="/#program">Elementary</a><a href="/#program">Junior High School</a><a href="/#program">Senior High School</a>
        </div>
        <div className="footer-column">
          <h3>Sekolah Kami</h3><a href="/#about">Tentang Kami</a><a href="/#about">Fasilitas</a><a href="/#about">Kurikulum</a>
        </div>
        <div className="footer-column">
          <h3>Aktivitas</h3><a href="/#activities">Prestasi</a><a href="/#activities">Ekstrakurikuler</a>
        </div>
        <div className="footer-column">
          <h3>Pendaftaran</h3><a href="/register">Pendaftaran</a><a href="/#contact">Kontak Kami</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Permata Global. All rights reserved.</p>
        <p>Situs Oleh Zikry XI PPLG 1</p>
      </div>
    </footer>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (!/^\\d{10}$/.test(form.nisn_id)) {
      setIsError(true);
      setMessage("NISN harus terdiri dari 10 digit angka.");
      return;
    }
    if (form.password.length < 8) {
      setIsError(true);
      setMessage("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Registrasi gagal.");
      setMessage(
        "Akun berhasil dibuat. Pastikan API sudah menyimpan semua data formulir sebelum pendaftaran dinyatakan selesai."
      );
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <Navbar />

      <section className="apply-hero">
        <h1>Saatnya Tumbuh Bersama<br /><span>Permata Global!</span></h1>
        <p>Langkah terbaik bermula dari keputusan yang tepat. Daftarkan anak Anda sekarang!</p>
      </section>

      <div className="apply-ribbon" aria-label="How to apply">
        <div className="apply-ribbon-yellow">{Array(12).fill("HOW TO APPLY").join("　 ")}</div>
        <div className="apply-ribbon-blue">{Array(12).fill("HOW TO APPLY").join("　 ")}</div>
      </div>

      <section className="apply-process">
        <div className="apply-process-inner">
          <div className="apply-steps">
            <svg className="apply-connectors" viewBox="0 0 390 344" preserveAspectRatio="none" aria-hidden="true">
              <path d="M98 42 C112 42 132 42 146 42 M244 42 C260 38 278 38 292 42" />
              <path d="M341 97 V136 Q341 158 320 158 H70 Q49 158 49 180 V203" />
              <path d="M98 225 H146 M244 252 C262 252 274 245 292 245" />
            </svg>

            <article className="apply-step step-yellow">
              <span className="apply-pin">📌</span>
              <div className="apply-step-body">
                <h3>1. Selesaikan biaya pendaftaran</h3>
                <div className="apply-mini-box">
                  <small>Bank</small><strong>Bank BSI</strong>
                  <small>Nomor rekening</small><strong>739-081-9689</strong>
                  <strong>Yayasan Sekolah Prestasi Global</strong>
                </div>
                <p>Konfirmasi pembayaran melalui WhatsApp tim informasi kami.</p>
              </div>
            </article>

            <article className="apply-step step-green">
              <span className="apply-pin">📌</span>
              <div className="apply-step-body">
                <h3>2. Isi formulir pendaftaran</h3>
                <p>Kami akan mengirimkan tautan pendaftaran. Isi data calon murid dengan lengkap dan benar.</p>
                <a href="#form-pendaftaran" className="apply-mini-button">Formulir Pendaftaran ↗</a>
              </div>
            </article>

            <article className="apply-step step-blue">
              <span className="apply-pin">📌</span>
              <div className="apply-step-body">
                <h3>3. Wawancara dan assessment</h3>
                <p>Calon siswa dan orang tua akan menjalani sesi wawancara serta assessment bersama tim sekolah.</p>
              </div>
            </article>

            <article className="apply-step step-purple">
              <span className="apply-pin">📌</span>
              <div className="apply-step-body">
                <h3>4. Biaya Sekolah (50%)</h3>
                <p>Selesaikan pembayaran biaya pendidikan sesuai ketentuan sekolah untuk melanjutkan proses pendaftaran.</p>
              </div>
            </article>

            <article className="apply-step step-pink">
              <span className="apply-pin">📌</span>
              <div className="apply-step-body">
                <h3>5. Lengkapi dokumen persyaratan pendaftaran</h3>
                <ul><li>01 Formulir Pendaftaran</li><li>02 Salinan Kartu Keluarga</li><li>03 Salinan Akta Kelahiran</li></ul>
                <p>Pastikan semua dokumen telah lengkap.</p>
              </div>
            </article>

            <article className="apply-step step-final">
              <span className="apply-pin">📌</span>
              <div className="apply-step-body">
                <h3>Anak Anda resmi menjadi siswa di Permata Global School!</h3>
                <img src="/assets/image7.png" alt="Siswa Permata Global" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="apply-contact">
        <div className="apply-contact-inner">
          <div className="apply-contact-info">
            <h2>Punya <span>pertanyaan?</span><br />Kami ada untuk Anda</h2>
            <p>Langkah terbaik bermula dari keputusan yang tepat. Daftarkan anak Anda sekarang!</p>
            <div className="apply-photo-grid">
              <img src="/assets/school.png" alt="Kegiatan sekolah" />
              <img src="/assets/image2.png" alt="Kegiatan belajar siswa" />
              <img src="/assets/image3.png" alt="Aktivitas siswa" />
            </div>
          </div>

          <form className="apply-contact-form" onSubmit={(event) => event.preventDefault()}>
            <div className="apply-contact-grid">
              <div className="apply-contact-field">
                <label htmlFor="contact-first-name">Nama Depan</label>
                <input id="contact-first-name" type="text" placeholder="Masukan nama depan" required />
              </div>
              <div className="apply-contact-field">
                <label htmlFor="contact-last-name">Nama Belakang</label>
                <input id="contact-last-name" type="text" placeholder="Masukan nama belakang" required />
              </div>
              <div className="apply-contact-field apply-contact-wide">
                <label htmlFor="contact-phone">Nomor Telepon</label>
                <input id="contact-phone" type="tel" placeholder="+62" required />
              </div>
              <div className="apply-contact-field apply-contact-wide">
                <label htmlFor="contact-email">Email (Opsional)</label>
                <input id="contact-email" type="email" placeholder="Enter your email" />
              </div>
              <div className="apply-contact-field apply-contact-wide">
                <label htmlFor="contact-question">Pertanyaan</label>
                <textarea id="contact-question" placeholder="Masukan pertanyaan" rows={2} required />
              </div>
            </div>
            <button type="submit">Kirim</button>
          </form>
        </div>
      </section>

      <section className="register-heading" id="form-pendaftaran">
        <h2>Formulir Pendaftaran</h2>
      </section>

      <section className="register-main">
        <form className="register-card" onSubmit={handleSubmit}>
          <section className="register-section">
            <h3 className="register-section-title">Informasi Pendaftaran</h3>
            <div className="register-grid">
              <InputField label="Tipe Pendaftaran" name="tipe_pendaftaran" value={form.tipe_pendaftaran} onChange={handleChange} options={["Peserta Didik Baru", "Pindahan"]} required />
              <InputField label="Program Akademik" name="program_akademik" value={form.program_akademik} onChange={handleChange} options={["Program Reguler", "Program Internasional"]} required />
            </div>
          </section>

          <section className="register-section">
            <h3 className="register-section-title">Identitas Calon Murid</h3>
            <div className="register-grid">
              <InputField label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} required wide />
              <InputField label="NISN" name="nisn_id" value={form.nisn_id} onChange={handleChange} placeholder="Masukkan 10 digit NISN" required />
              <InputField label="Kata Sandi (Untuk Login Akun)" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" required />
              <InputField label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} options={["Laki-laki", "Perempuan"]} required />
              <InputField label="Agama" name="agama" value={form.agama} onChange={handleChange} options={["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"]} required />
              <InputField label="Tempat Lahir" name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} required />
              <InputField label="Tanggal Lahir" name="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={handleChange} required />
              <InputField label="Anak Ke-" name="anak_ke" type="number" value={form.anak_ke} onChange={handleChange} required />
            </div>
          </section>

          <section className="register-section">
            <h3 className="register-section-title">Kontak & Alamat</h3>
            <div className="register-grid">
              <InputField label="Nomor Telepon" name="nomor_telepon" type="tel" value={form.nomor_telepon} onChange={handleChange} required />
              <InputField label="Tempat Tinggal" name="tempat_tinggal" value={form.tempat_tinggal} onChange={handleChange} required />
              <InputField label="Tanggal Mulai Tinggal" name="tanggal_mulai_tinggal" type="date" value={form.tanggal_mulai_tinggal} onChange={handleChange} />
              <InputField label="Alamat" name="alamat" type="textarea" value={form.alamat} onChange={handleChange} required wide />
            </div>
          </section>

          <section className="register-section">
            <h3 className="register-section-title">Riwayat Pendidikan</h3>
            <div className="register-grid">
              <InputField label="Sekolah Sebelumnya" name="sekolah_sebelumnya" value={form.sekolah_sebelumnya} onChange={handleChange} required wide />
              <div className="register-field register-wide">
                <label htmlFor="dokumen_ijazah">Foto Ijazah</label>
                <input id="dokumen_ijazah" name="dokumen_ijazah" type="file" accept="image/*,.pdf" />
                <small className="register-hint">Unggahan dokumen perlu dihubungkan ke API penyimpanan.</small>
              </div>
            </div>
          </section>

          <section className="register-section">
            <h3 className="register-section-title">Data Fisik & Tambahan</h3>
            <div className="register-grid">
              <InputField label="Tinggi Badan (cm)" name="tinggi_badan" type="number" value={form.tinggi_badan} onChange={handleChange} />
              <InputField label="Berat Badan (kg)" name="berat_badan" type="number" value={form.berat_badan} onChange={handleChange} />
              <InputField label="Golongan Darah" name="golongan_darah" value={form.golongan_darah} onChange={handleChange} options={["A", "B", "AB", "O", "Belum diketahui"]} />
              <InputField label="Ukuran Seragam" name="ukuran_seragam" value={form.ukuran_seragam} onChange={handleChange} options={["S", "M", "L", "XL", "XXL"]} />
            </div>
          </section>

          <ParentFields title="Identitas Orang Tua — Data Ayah" prefix="ayah" form={form} onChange={handleChange} />
          <ParentFields title="Identitas Orang Tua — Data Ibu" prefix="ibu" form={form} onChange={handleChange} />
          <ParentFields title="Data Wali (Opsional)" prefix="wali" form={form} onChange={handleChange} optional />

          {message && <div className={`register-message ${isError ? "is-error" : ""}`} role="status">{message}</div>}

          <button className="register-submit" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Kirim"}
          </button>
          <p className="register-login">Sudah punya akun? <a href="/login">Login</a></p>
        </form>
      </section>

      <Footer />
    </main>
  );
}
