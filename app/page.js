import "./globals.css";

export default function Home() {
  return (
    <main>

      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="navbar-container">

          <a href="/" className="logo">
            <img
              src="/assets/logo.png"
              alt="Prestasi Global"
            />
          </a>

          <nav className="nav-menu">
            <a href="/" className="active">Home</a>
            <a href="#about">Why Prestasi Global</a>
            <a href="#activities">Activities</a>
            <a href="#enrollment">Enrollment</a>
            <a href="/login">Login</a>
          </nav>

          <a href="#contact" className="contact-btn">
            Hubungi Kami
          </a>

        </div>
      </header>


      {/* ================= HERO ================= */}
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

            <a href="#program" className="btn-program">
              Lihat Program
              <span>⌄</span>
            </a>

            <a href="/register" className="btn-register">
              PENDAFTARAN
            </a>

          </div>

        </div>


        {/* HERO IMAGE */}
        <div className="hero-image">

          <div className="hero-card hero-card-left">
            <span className="hero-number">10+ years</span>

            <img
              src="/assets/hero-1.jpg"
              alt="Prestasi Global"
            />

            <p>
              Prestasi Global
              <br />
              telah berdiri
            </p>
          </div>


          <div className="hero-card hero-card-center">
            <img
              src="/assets/hero-2.jpg"
              alt="Siswa Prestasi Global"
            />
          </div>


          <div className="hero-card hero-card-right">

            <div className="student-count">
              <strong>500+</strong>
              <span>Alumni</span>
            </div>

            <img
              src="/assets/school.jpg"
              alt="Gedung Prestasi Global"
            />

          </div>

        </div>

      </section>


      {/* ================= STATISTICS ================= */}
      <section className="statistics">

        <div className="stat-item">

          <div className="stat-icon">
            ♧
          </div>

          <div>
            <strong>800+</strong>
            <span>Siswa Aktif</span>
          </div>

        </div>


        <div className="stat-item">

          <div className="stat-icon">
            ♙
          </div>

          <div>
            <strong>200+</strong>
            <span>Guru & Staf Aktif</span>
          </div>

        </div>


        <div className="stat-item">

          <div className="stat-icon">
            ▣
          </div>

          <div>
            <strong>50+</strong>
            <span>Kelas & Fasilitas</span>
          </div>

        </div>


        <div className="stat-item">

          <div className="stat-icon">
            ★
          </div>

          <div>
            <strong>A</strong>
            <span>Akreditasi Sekolah</span>
          </div>

        </div>

      </section>


      {/* ================= WHY US ================= */}
      <section className="why-section" id="about">

        <div className="why-image">

          <img
            src="/assets/school.jpg"
            alt="Lingkungan sekolah Prestasi Global"
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
                <h3>Kurikulum yang Relevan</h3>

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
                <h3>Sekolah yang Mendidik dengan Hati</h3>

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
                <h3>Lingkungan Belajar yang Mendukung</h3>

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


      {/* ================= PROGRAM ================= */}
      <section className="program-section" id="program">

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

          {/* PRESCHOOL */}
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
              src="/assets/preschool.png"
              alt="Preschool"
            />

          </div>


          {/* KINDERGARTEN */}
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
              src="/assets/kindergarten.png"
              alt="Kindergarten"
            />

          </div>


          {/* ELEMENTARY */}
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
              src="/assets/elementary.png"
              alt="Elementary"
            />

          </div>


          {/* JUNIOR HIGH */}
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
                menjawab untuk jenjang berikutnya.
              </p>

            </div>

            <img
              src="/assets/junior-high.png"
              alt="Junior High School"
            />

          </div>


          {/* SENIOR HIGH */}
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
              src="/assets/senior-high.png"
              alt="Senior High School"
            />

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section" id="enrollment">

        <div className="cta-images left-images">

          <img
            src="/assets/elementary.png"
            alt=""
          />

          <img
            src="/assets/senior-high.png"
            alt=""
          />

        </div>


        <div className="cta-content">

          <h2>
            Awali Perjalanan Belajar Anak Anda
            <br />
            bersama Permata Global
          </h2>

          <a href="#contact" className="cta-button">
            ☎ Hubungi Kami
          </a>

        </div>


        <div className="cta-images right-images">

          <img
            src="/assets/kindergarten.png"
            alt=""
          />

          <img
            src="/assets/preschool.png"
            alt=""
          />

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer" id="contact">

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
              <span>f</span>
              <span>◎</span>
              <span>▶</span>
              <span>in</span>
            </div>

          </div>


          {/* PROGRAM */}
          <div className="footer-column">

            <h3>
              Program
            </h3>

            <a href="#program">Preschool</a>
            <a href="#program">Kindergarten</a>
            <a href="#program">Elementary</a>
            <a href="#program">Junior High School</a>
            <a href="#program">Senior High School</a>

          </div>


          {/* SCHOOL */}
          <div className="footer-column">

            <h3>
              Sekolah Kami
            </h3>

            <a href="#about">Tentang Kami</a>
            <a href="#about">Fasilitas</a>
            <a href="#about">Kurikulum</a>

          </div>


          {/* ACTIVITIES */}
          <div className="footer-column">

            <h3>
              Aktivitas
            </h3>

            <a href="#activities">Prestasi</a>
            <a href="#activities">Ekstrakurikuler</a>

          </div>


          {/* ENROLLMENT */}
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


        <div className="footer-bottom">

          <p>
            © 2026 Permata Global. All rights reserved.
          </p>

          <p>
            Situs Oleh Zikry XI PPLG 1
          </p>

        </div>

      </footer>

    </main>
  );
}