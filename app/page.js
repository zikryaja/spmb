"use client";

import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setLoginSuccess(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setLoginSuccess(false);
  };

  return (
    <main>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">
        <div className="navbar-container">

          <a href="/" className="logo">
            <img
              src="/assets/logo.png"
              alt="Permata Global"
            />
          </a>

          <nav className="nav-menu">

            <a href="/" className="active">
              Home
            </a>

            <a href="#about">
              Why Permata Global
            </a>

            <a href="#activities">
              Activities
            </a>

            <a href="#enrollment">
              Enrollment
            </a>

            <button
              type="button"
              className="nav-login"
              onClick={openLogin}
            >
              Login
            </button>

          </nav>

          <a
            href="#contact"
            className="contact-btn"
          >
            Hubungi Kami
          </a>

        </div>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-content">

          <h1>
            Membentuk Generasi Cerdas dan Siap
            <br />
            Menjadi <span>Permata Global</span>
          </h1>

          <p>
            Di mana keunggulan standar Cambridge berpadu dengan karakter
            Islami yang modern, mencetak pembelajar yang siap menghadapi
            masa depan—dimulai dari sini!
          </p>

          <div className="hero-buttons">

            <a
              href="#program"
              className="btn-program"
            >
              Lihat Program

              <span
                className="program-arrow"
                aria-hidden="true"
              />

            </a>

            <a
              href="/register"
              className="btn-register"
            >
              PENDAFTARAN
            </a>

          </div>

        </div>


        <div className="hero-image">

          <img
            src="/assets/hero.png"
            alt="Permata Global"
          />

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="statistics">

        <div className="stat-item">

          <div className="stat-icon">

            <img
              className="stat-img"
              src="/assets/icon1.png"
              alt="Icon Siswa Aktif"
            />

          </div>

          <div>

            <strong>
              800+
            </strong>

            <span>
              Siswa Aktif
            </span>

          </div>

        </div>


        <div className="stat-item">

          <div className="stat-icon">

            <img
              className="stat-img"
              src="/assets/icon2.png"
              alt="Icon Guru dan Staf"
            />

          </div>

          <div>

            <strong>
              200+
            </strong>

            <span>
              Guru & Staf Aktif
            </span>

          </div>

        </div>


        <div className="stat-item">

          <div className="stat-icon">

            <img
              className="stat-img"
              src="/assets/icon3.png"
              alt="Icon Kelas dan Fasilitas"
            />

          </div>

          <div>

            <strong>
              50+
            </strong>

            <span>
              Kelas & Fasilitas
            </span>

          </div>

        </div>


        <div className="stat-item">

          <div className="stat-icon">

            <img
              className="stat-img"
              src="/assets/icon4.png"
              alt="Icon Akreditasi"
            />

          </div>

          <div>

            <strong>
              A
            </strong>

            <span>
              Akreditasi Sekolah
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY US
      ===================================================== */}

      <section
        className="why-section"
        id="about"
      >

        <div className="why-image">

          <img
            src="/assets/school.png"
            alt="Lingkungan sekolah Permata Global"
          />

        </div>


        <div className="why-content">

          <h2>
            Mengapa Permata Global?
          </h2>


          <div className="why-list">

            <div className="why-item">

              <div className="why-number">
                01
              </div>

              <div>

                <h3>
                  Kurikulum yang Relevan
                </h3>

                <p>
                  Kurikulum yang membentuk anak-anak cerdas,
                  mempersiapkan mereka untuk masa depan, dan
                  membangun fondasi iman yang kuat.
                </p>

              </div>

            </div>


            <div className="why-item">

              <div className="why-number">
                02
              </div>

              <div>

                <h3>
                  Sekolah yang Mendidik dengan Hati
                </h3>

                <p>
                  Nilai-nilai Islam dan akhlak mulia bukan sekadar
                  pelajaran—hal tersebut diamalkan setiap hari,
                  di mana saja.
                </p>

              </div>

            </div>


            <div className="why-item">

              <div className="why-number">
                03
              </div>

              <div>

                <h3>
                  Lingkungan Belajar yang Mendukung
                </h3>

                <p>
                  Ruang belajar yang modern dan nyaman, guru-guru
                  yang berdedikasi, serta lingkungan yang mendorong
                  anak-anak untuk mencapai potensi maksimal mereka.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRAM EDUKASI
      ===================================================== */}

      <section
        className="program-section"
        id="program"
      >

        <div className="program-decoration blue-decoration">
          ∿
        </div>

        <div className="program-decoration yellow-decoration">
          ∿
        </div>


        <div className="section-title">

          <h2>
            Program Edukasi Kami
          </h2>

          <p>
            Program pembelajaran yang dirancang untuk setiap tahap
            perkembangan anak.
          </p>

        </div>


        <div className="program-grid">
          <div className="program-row-top">

          {/* =================================================
              1. PRESCHOOL
          ================================================= */}

          <div className="program-card">

            <span className="age">
              Umur 2–4
            </span>

            <h3>
              Preschool
            </h3>

            <p>
              Belajar dengan bermain untuk pertumbuhan
              dan perkembangan awal.
            </p>

            <img
              src="/assets/image2.png"
              alt="Preschool"
            />

          </div>


          {/* =================================================
              2. KINDERGARTEN
          ================================================= */}

          <div className="program-card">

            <span className="age">
              Umur 4–6
            </span>

            <h3>
              Kindergarten
            </h3>

            <p>
              Membangun dasar pembelajaran dan
              kemandirian.
            </p>

            <img
              src="/assets/image3.png"
              alt="Kindergarten"
            />

          </div>


          {/* =================================================
              3. ELEMENTARY
          ================================================= */}

          <div className="program-card">

            <span className="age">
              Umur 6–12
            </span>

            <h3>
              Elementary
            </h3>

            <p>
              Landasan akademik yang kuat dan
              karakter Islami.
            </p>

            <img
              src="/assets/image4.png"
              alt="Elementary"
            />

          </div>

          </div>

          <div className="program-row-bottom">
          {/* =================================================
              4. JUNIOR HIGH SCHOOL
          ================================================= */}

          <div className="program-card wide">

            <div className="program-text">

              <span className="age">
                Umur 12–15
              </span>

              <h3>
                Junior High School
              </h3>

              <p>
                Memperkuat kemampuan akademis dan
                mempersiapkan diri untuk jenjang berikutnya.
              </p>

            </div>

            <img
              src="/assets/image5.png"
              alt="Junior High School"
            />

          </div>


          {/* =================================================
              5. SENIOR HIGH SCHOOL
          ================================================= */}

          <div className="program-card wide">

            <div className="program-text">

              <span className="age">
                Umur 15–17
              </span>

              <h3>
                Senior High School
              </h3>

              <p>
                Membangun keunggulan dan mempersiapkan
                diri untuk universitas impian Anda.
              </p>

            </div>

            <img
              src="/assets/image6.png"
              alt="Senior High School"
            />

          </div>

          </div>
        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        className="cta-section"
        id="enrollment"
      >

        <div className="cta-images left-images">

          <img
            src="/assets/image7.png"
            alt=""
          />

        </div>


        <div className="cta-content">

          <h2>
            Awali Perjalanan Belajar Anak Anda
            <br />
            bersama Permata Global
          </h2>

          <a
            href="#contact"
            className="cta-button"
          >
            ☎ Hubungi Kami
          </a>

        </div>


        <div className="cta-images right-images">

          <img
            src="/assets/image8.png"
            alt=""
          />

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="footer"
        id="contact"
      >

        <div className="footer-container">

          {/* SCHOOL INFO */}

          <div className="footer-column school-info">

            <img
              src="/assets/logo.png"
              alt="Permata Global"
              className="footer-logo"
            />

            <p>
              Jl. Pelangi Raya 10, Perumahan
              <br />
              Indah 2 No.1, Rangkapan Jaya,
              <br />
              Pancoran Mas, Kota Depok,
              <br />
              Jawa Barat 16435
            </p>

            <p>
              ☎ +62 812 1111555
            </p>

            <p>
              ✉ permataglobaldepok@gmail.com
            </p>


            <div className="socials">

              <span>
                f
              </span>

              <span>
                ◎
              </span>

              <span>
                ▶
              </span>

              <span>
                in
              </span>

            </div>

          </div>


          {/* PROGRAM */}

          <div className="footer-column">

            <h3>
              Program
            </h3>

            <a href="#program">
              Preschool
            </a>

            <a href="#program">
              Kindergarten
            </a>

            <a href="#program">
              Elementary
            </a>

            <a href="#program">
              Junior High School
            </a>

            <a href="#program">
              Senior High School
            </a>

          </div>


          {/* SEKOLAH */}

          <div className="footer-column">

            <h3>
              Sekolah Kami
            </h3>

            <a href="#about">
              Tentang Kami
            </a>

            <a href="#about">
              Fasilitas
            </a>

            <a href="#about">
              Kurikulum
            </a>

          </div>


          {/* ACTIVITIES */}

          <div className="footer-column">

            <h3>
              Aktivitas
            </h3>

            <a href="#activities">
              Prestasi
            </a>

            <a href="#activities">
              Ekstrakurikuler
            </a>

          </div>


          {/* PENDAFTARAN */}

          <div className="footer-column">

            <h3>
              Pendaftaran
            </h3>

            <a href="/register">
              Pendaftaran
            </a>

            <a href="#contact">
              Kontak Kami
            </a>

          </div>

        </div>


        {/* FOOTER BOTTOM */}

        <div className="footer-bottom">

          <p>
            © 2026 Permata Global. All rights reserved.
          </p>

          <p>
            Situs Oleh Zikry XI PPLG 1
          </p>

        </div>

      </footer>


      {/* =====================================================
          LOGIN OVERLAY
      ===================================================== */}

      {showLogin && (

        <div
          className="login-overlay"
          onClick={(e) => {

            if (e.target === e.currentTarget) {
              closeLogin();
            }

          }}
        >

          <div className="login-modal">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="login-close"
              onClick={closeLogin}
              aria-label="Tutup login"
            >
              ×
            </button>


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            {!loginSuccess ? (

              <>

                <img
                  src="/assets/logo1.png"
                  alt="Prestasi Global"
                  className="login-logo"
                />


                <h2>
                  Selamat Datang!
                </h2>


                <p className="login-description">
                  Kamu siswa atau staff? Silahkan masuk
                  <br />
                  untuk melanjutkannya
                </p>


                {/* NISN / ID */}

                <div className="login-field">

                  <label htmlFor="login-id">
                    NISN/ID
                  </label>

                  <input
                    id="login-id"
                    type="text"
                    placeholder="Masukan NISN atau ID"
                  />

                </div>


                {/* PASSWORD */}

                <div className="login-field">

                  <label htmlFor="login-password">
                    Kata Sandi
                  </label>

                  <input
                    id="login-password"
                    type="password"
                    placeholder="Masukan kata sandi"
                  />

                </div>


                {/* FORGOT PASSWORD */}

                <a
                  href="#"
                  className="forgot-password"
                  onClick={(e) => e.preventDefault()}
                >
                  Lupa kata sandi?
                </a>


                {/* LOGIN BUTTON */}

                <button
                  type="button"
                  className="login-submit"
                  onClick={() => setLoginSuccess(true)}
                >
                  Masuk
                </button>

              </>

            ) : (

              /* =================================================
                 LOGIN SUCCESS
              ================================================= */

              <>

                <img
                  src="/assets/logo1.png"
                  alt="Prestasi Global"
                  className="login-logo success-logo"
                />

                <h2>
                  Masuk Berhasil!
                </h2>

                <p className="success-description">
                  Selamat datang di website{" "}
                  <span>
                    Permata Global!
                  </span>
                </p>

                <button
                  type="button"
                  className="profile-button"
                  onClick={closeLogin}
                >
                  Profil
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </main>
  );
}