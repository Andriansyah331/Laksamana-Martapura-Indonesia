# 🏢 PT Laksamana Martapura Indonesia — Company Profile Website

Landing page resmi PT Laksamana Martapura Indonesia, perusahaan penyedia SDM profesional, personel keamanan, dan dukungan operasional.

---

## 📸 Preview

> *(Tambahkan screenshot di sini setelah deploy — bisa pakai [screely.com](https://screely.com) untuk tampilan yang rapi)*

---

## 🛠️ Tech Stack

Proyek ini dibangun tanpa framework — murni vanilla web.

| Layer | Teknologi |
|-------|-----------|
| Markup | HTML5 Semantic |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Interaktivitas | Vanilla JavaScript (ES6+) |
| Font | Plus Jakarta Sans + Playfair Display (Google Fonts) |
| Icon | SVG Sprite (inline, zero dependency) |
| Deploy | Static hosting (GitHub Pages / Vercel / Netlify) |

---

## 📁 Struktur Folder

```
/
├── index.html          # Entry point utama
├── assets/
│   ├── css/
│   │   └── style.css   # Semua styling (5100+ baris, CSS v2.2.0)
│   ├── js/
│   │   └── script.js   # Semua interaktivitas
│   └── images/         # Foto, logo, og-image (self-hosted)
└── README.md
```

---

## ✨ Fitur

### UI / UX
- Dark / Light mode dengan preferensi tersimpan di `localStorage`
- Loading screen animasi saat halaman pertama dibuka
- Scroll progress bar di bagian atas halaman
- Reveal animation saat elemen masuk viewport
- Back to top button
- Floating WhatsApp button

### Navigasi
- Sticky navbar dengan efek blur saat scroll
- Mobile hamburger menu (responsive)
- Smooth scroll ke setiap section
- Active link highlight otomatis saat scroll

### Konten
- **Hero** — Headline utama + stats counter animasi
- **Tentang** — Profil singkat perusahaan
- **Keamanan** — Layanan security dengan animasi shield
- **Layanan** — Daftar layanan SDM & operasional
- **Industri** — Sektor yang dilayani
- **Keunggulan** — Why choose us
- **Proses SOP** — Alur kerja step by step
- **Legalitas** — Dokumen & sertifikasi resmi
- **Galeri Kegiatan** — Grid bento dengan filter kategori
- **Testimonial** — Slider ulasan klien
- **FAQ** — Accordion tanya jawab
- **Kontak** — Form dengan redirect ke WhatsApp

### Performa & SEO
- Meta tag Open Graph + Twitter Card
- JSON-LD Structured Data (Organization, LocalBusiness, FAQ)
- `preload` untuk font kritis
- `defer` pada script
- Inline script dark mode (cegah flash saat load)
- `isDev()` guard — console.log hanya tampil di localhost

---

## 🚀 Cara Menjalankan Lokal

Tidak butuh build tool atau npm. Cukup:

```bash
# Clone repo
git clone https://github.com/USERNAME/REPO-NAME.git

# Masuk folder
cd REPO-NAME

# Buka dengan Live Server (VS Code extension)
# atau langsung buka index.html di browser
```

> **Note:** Beberapa fitur (font Google, placeholder image) butuh koneksi internet.

---

## ☁️ Deploy

### GitHub Pages
1. Push semua file ke branch `main`
2. Buka **Settings → Pages**
3. Source: `Deploy from a branch` → branch `main` → folder `/ (root)`
4. Site akan live di `https://USERNAME.github.io/REPO-NAME`

### Vercel / Netlify
Drag & drop folder project ke dashboard masing-masing, langsung live.

---

## ⚙️ Konfigurasi Sebelum Go-Live

Sebelum deploy production, pastikan hal berikut sudah diupdate:

### `index.html`
| Baris | Yang perlu diubah |
|-------|------------------|
| `<link rel="canonical">` | Ganti dengan domain production |
| `og:url` | Ganti dengan domain production |
| `og:image` | Upload `og-image.jpg` (1200×630px) ke server |
| JSON-LD `url`, `logo` | Ganti dengan domain production |
| Google Maps `<iframe src>` | Generate ulang embed URL dari Google Maps (place ID `0x0` masih placeholder) |
| Hero `background-image` | Ganti URL Unsplash dengan foto self-hosted |

### `assets/images/`
- [ ] `og-image.jpg` — thumbnail preview link (1200×630px)
- [ ] `logo.png` — logo untuk JSON-LD SEO
- [ ] Foto galeri — ganti placeholder `placehold.co` dengan foto asli

### Kontak
- Nomor WhatsApp sudah terset di `script.js` dan beberapa link di HTML
- Cari `6281298904311` untuk update nomor jika berubah

---

## 🎨 Panduan Ganti Foto Galeri

Buka `index.html`, cari bagian `<!-- ====== GALLERY SECTION ======`.

Setiap item galeri punya atribut `style="background-image: url('...')"`:

```html
<!-- Ganti URL di sini: -->
<div class="gallery-img" style="background-image: url('URL_FOTO_LO_DISINI')">
```

Foto bisa di-host di:
- Folder `assets/images/` di repo sendiri
- [imgix](https://imgix.com) / [Cloudinary](https://cloudinary.com) (sudah dipakai untuk logo)

---

## 🎨 Warna Brand

| Nama | Hex | Penggunaan |
|------|-----|-----------|
| Navy Primary | `#0B2447` | Background utama, teks dark |
| Navy Secondary | `#19376D` | Gradient, card background |
| Gold Accent | `#C9A84C` | CTA, highlight, border |
| Gold Light | `#E3C273` | Hover state, gradient |

---

## 📋 Checklist Production

- [ ] Domain production sudah diarahkan ke hosting
- [ ] Semua URL placeholder (`0x0`, `placehold.co`, Unsplash) sudah diganti
- [ ] OG image sudah diupload
- [ ] Google Maps embed URL sudah diperbarui
- [ ] Nomor WhatsApp sudah benar
- [ ] Test di mobile (iOS & Android)
- [ ] Test dark mode
- [ ] Test form kontak (pastikan redirect WA berjalan)
- [ ] Cek kecepatan di [PageSpeed Insights](https://pagespeed.web.dev)

---

## 📄 Lisensi

Kode ini dibuat untuk keperluan internal PT Laksamana Martapura Indonesia.  
Dilarang mendistribusikan atau menggunakan ulang tanpa izin.

---

*Built with ❤️ — No framework, no build tool, just clean HTML/CSS/JS.*
