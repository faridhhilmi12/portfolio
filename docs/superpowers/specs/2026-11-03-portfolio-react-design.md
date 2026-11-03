# Portfolio React: Desain

Tanggal: 2026-11-03. Status: menunggu tinjauan pemilik.

## 1. Tujuan dan batasan

**Tujuan.** Membuat portfolio Muhammad Farid Hilmi lebih menarik dengan memindahkannya ke React, mengembangkan konsep "kanvas Figma" menjadi interaktif. Target utama pengunjung adalah recruiter dan pemberi magang.

**Kriteria sukses.**
- Semua yang berfungsi di situs statis sekarang tetap berfungsi (daftar paritas, bagian 8).
- Hero, proyek, dan keahlian memiliki interaksi kanvas yang dijelaskan di bagian 4.
- Semua konten bisa dibaca dan dioperasikan dengan keyboard tanpa interaksi tambahan.
- `npm run build` dan pengecekan tipe bersih; pengujian lulus.

**Keputusan yang sudah disepakati.**
- Arah visual: kanvas Figma interaktif (bukan editorial, bukan sekadar pindah komponen).
- Stack: Vite + React + TypeScript + Tailwind CSS + `motion`.
- Deploy: Netlify (Vercel kompatibel). Alamat final belum ditentukan.
- Teks proyek, pengalaman, dan keahlian tidak diubah; hanya dipindah.

**Di luar cakupan.** Screenshot proyek asli, prerender/SSR, CMS, blog, halaman case study, routing.

## 2. Stack

- Vite + React 19 + TypeScript, satu halaman tanpa router.
- Tailwind CSS v4. Token warna dan font ada di `@theme` pada `src/index.css`: palet abu, aksen biru (`--select`, `--select-strong`), font Hanken Grotesk. Dark mode: varian `dark:` dihubungkan ke `data-theme="dark"` dan ke `prefers-color-scheme` saat tidak ada pilihan manual.
- `motion` untuk drag, layout animation, dan transisi masuk.
- Vitest + Testing Library untuk pengujian.
- Tidak ada library UI atau state tambahan.

## 3. Struktur proyek

```
portfolio/
├─ index.html          metadata SEO, JSON-LD, skrip tema awal, <noscript>
├─ src/
│  ├─ main.tsx, App.tsx
│  ├─ data/            projects.ts, experience.ts, skills.ts, links.ts
│  ├─ i18n/            id.ts, en.ts, LangProvider, useT()
│  ├─ theme/           ThemeProvider
│  ├─ components/      Nav, Hero, CollaboratorCursor, DotGrid, Projects,
│  │                   ProjectFrame, Inspect, Timeline, Skills, Contact, Footer
│  └─ index.css        @import "tailwindcss" + @theme
├─ public/             assets/farid.jpg, robots.txt, sitemap.xml
├─ legacy/             berkas statis lama (index.html, styles.css, script.js)
└─ netlify.toml
```

Komponen hanya membaca `data/` dan kamus bahasa melalui `useT()`. Menambah proyek berarti mengubah `data/projects.ts` dan kedua kamus bahasa, tanpa menyentuh komponen tampilan. `legacy/` dipertahankan sampai versi React lolos verifikasi; penghapusannya keputusan pemilik.

## 4. Interaksi kanvas

Prinsip: interaksi hanya menambah kesan. Konten tetap terbaca dan bisa dioperasikan tanpa interaksi itu.

**Hero.**
- Latar dot grid yang bergeser halus mengikuti mouse (parallax kecil).
- Kotak seleksi nama, handle sudut, badge "UI/UX Designer + Developer", dan garis ukur `48` dipertahankan. Ditambahkan label ukuran gaya Figma di bawah kotak (misalnya `412 × 168`) yang dihitung dari ukuran elemen nama sebenarnya (`ResizeObserver`).
- Foto menjadi frame yang bisa diseret dan kembali ke posisi semula dengan pegas saat dilepas. Dengan keyboard foto statis.
- `CollaboratorCursor`: satu kursor berlabel `Farid` bergerak otomatis antara nama, foto, dan tombol, sesekali menampilkan gelembung komentar pendek. Dekoratif (`aria-hidden`), hanya dirender pada perangkat dengan `(hover: hover) and (pointer: fine)`.

**Karya pilihan.**
- Empat proyek tampil sebagai kartu frame di grid 2 kolom, dengan label di atasnya (`Waldo · 2026`).
- Kartu adalah tombol. Klik atau Enter memilih kartu: muncul kotak seleksi dengan handle sudut dan badge peran. Satu kartu terpilih pada satu waktu; kartu pertama terpilih secara bawaan.
- Panel `Inspect` di bawah grid menampilkan proyek terpilih seperti panel properti Figma: peran, deskripsi, dan stack sebagai properti. Isi berganti dengan transisi layout.
- Proyek privat (LMS Telkomsat) tampil dengan garis putus-putus dan catatan bahwa tautan dan tangkapan layar tidak dipublikasikan.
- Layar kecil: kartu ditumpuk satu kolom dan `Inspect` menjadi akordeon di bawah kartu terpilih.
- Isi kartu berupa ilustrasi wireframe abstrak (`wire`: `app | dashboard | lms | site`), dekoratif dan tidak diklaim sebagai tangkapan layar. Jika `image` pada data proyek diisi, gambar itu menggantikan wireframe.

**Keahlian.**
- Struktur "Desain ↔ Kode" dipertahankan. Saat satu skill di-hover atau difokus, pasangannya di sisi lain ikut menyala (misalnya Figma dengan React). Pasangan ditulis di `data/skills.ts`.

**Aksesibilitas dan performa interaksi.**
- Dengan `prefers-reduced-motion`: tanpa kursor otomatis, tanpa parallax, tanpa drag, dan transisi diganti perubahan instan.
- Semua elemen interaktif memiliki fokus terlihat dan dapat dioperasikan dengan Tab dan Enter.
- Animasi hanya memakai `transform` dan `opacity`.

## 5. Data, bahasa, dan tema

**Data bertipe.**
- `projects.ts`: `{ id, year, tags: string[], wire, image?, isPrivate?, link? }`. Teks proyek tidak ada di sini.
- `experience.ts`, `skills.ts` (termasuk pasangan Desain↔Kode), dan `links.ts` (isi `LINKS` sekarang). Link yang kosong tidak dirender.

**Bahasa.**
- `id.ts` adalah sumber utama dan menentukan tipe kunci. `en.ts` harus memiliki kunci yang sama, sehingga kunci yang terlewat menggagalkan pengecekan tipe.
- Teks yang sekarang ada di `index.html` dan `script.js` dipindah tanpa mengubah kalimat.
- `LangProvider` menyimpan pilihan di `localStorage`. Tanpa pilihan tersimpan, bahasa mengikuti `navigator.language` (awalan `id` menjadi ID, selain itu EN). Provider memperbarui `document.title`, `<html lang>`, meta deskripsi, dan `aria-label` tombol.

**Tema.**
- Skrip inline di `index.html` memasang tema tersimpan sebelum React dimuat (tanpa kedip). `ThemeProvider` mengambil alih sesudahnya, dengan transisi dimatikan sesaat saat berganti. Tanpa pilihan tersimpan, tema mengikuti sistem.

## 6. SEO

- Metadata, Open Graph, `twitter:*`, canonical, `theme-color`, dan JSON-LD `Person` tetap statis di `index.html`; pratinjau tautan tidak membutuhkan JavaScript.
- Isi halaman dirender oleh JavaScript. Google menjalankan JavaScript sehingga tetap terindeks; pemindai tanpa JavaScript hanya melihat metadata dan blok `<noscript>` berisi ringkasan teks. Prerender sengaja tidak ditambahkan dan dapat dipasang kemudian.
- `robots.txt` dan `sitemap.xml` ada di `public/`.
- Alamat sementara: `https://faridhhilmi12.netlify.app/` (placeholder). Ia muncul di `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD), `robots.txt`, dan `sitemap.xml`, dan wajib diganti oleh pemilik sebelum rilis. README mencatat daftar lokasinya.

## 7. Build dan deploy

- `netlify.toml`: perintah build `npm run build`, folder publish `dist`, header cache panjang untuk aset berhash. Vercel memakai preset Vite tanpa berkas tambahan.
- Tidak ada publikasi ke layanan luar tanpa persetujuan pemilik. Pemilik yang menghubungkan repo ke Netlify dan menentukan alamat final.

## 8. Pengujian dan kriteria selesai

**Daftar paritas (semua harus lulus).**
- Teks ID dan EN identik dengan versi statis; pindah bahasa memperbarui judul tab, deskripsi, dan `aria-label`.
- Terang, gelap, dan mengikuti sistem berfungsi; tema tersimpan tanpa kedip; peralihan tema tidak memunculkan kedipan.
- Menu mobile, link nav aktif, bayangan nav, dan penutupan menu dengan Esc berfungsi.
- Tidak ada scroll horizontal pada 375, 768, dan 1280 px.
- Metadata `og:*`, canonical, JSON-LD, `robots.txt`, dan `sitemap.xml` ada di hasil build.
- Dengan `prefers-reduced-motion`: tanpa animasi otomatis, kursor, parallax, atau drag.

**Pengujian otomatis.**
- `en.ts` dan `id.ts` memiliki kunci yang sama.
- Link kosong tidak dirender.
- Memilih kartu proyek mengganti panel `Inspect`, termasuk lewat keyboard.
- Bahasa dan tema tersimpan dan terbaca ulang.
- Pengecekan tipe dan `npm run build` bersih.

**Verifikasi manual di browser.** Setiap butir daftar paritas diperiksa pada ukuran desktop, tablet, dan mobile, dalam mode terang dan gelap, plus kursor kolaborator, drag foto, dan seleksi frame proyek. Console harus bersih. Smooth-scroll tidak dapat diuji di pane preview dan hanya dapat dipastikan di browser pemilik.

**Penanganan galat.**
- Semua akses `localStorage` dibungkus try/catch; halaman tetap dirender bila diblokir.
- Bahasa atau tema tersimpan yang tidak valid diganti nilai bawaan.
- Foto yang gagal dimuat tetap menampilkan kotak abu.

## 9. Peluncuran bertahap

1. Versi React dibangun di struktur baru; berkas lama dipindah ke `legacy/`, tidak dihapus.
2. Daftar paritas dan pengujian dijalankan, hasilnya dilaporkan apa adanya termasuk yang gagal.
3. Pemilik memutuskan kapan menghubungkan repo ke Netlify dan mengganti alamat placeholder.
