# Portofolio Muhammad Farid Hilmi

Website statis (HTML, CSS, JavaScript), tanpa build tool.

## Struktur
- `index.html` — isi halaman (teks Bahasa Indonesia ada di sini), plus metadata SEO dan data terstruktur JSON-LD
- `styles.css` — tampilan; warna & font diatur di bagian `:root`, token mode gelap ada di bawahnya
- `script.js` — link kontak (`LINKS`), terjemahan Inggris (`EN`), tema, menu mobile, dan animasi scroll
- `assets/farid.jpg` — foto profil (juga dipakai sebagai gambar pratinjau saat link dibagikan)
- `robots.txt`, `sitemap.xml` — untuk mesin pencari

## Hal yang perlu diingat
- Link kontak ada di `script.js` (objek `LINKS`). Link yang dibiarkan kosong otomatis disembunyikan.
- Link sosial juga tertulis di JSON-LD pada `index.html`. Kalau `LINKS` berubah, ubah di sana juga.
- Alamat situs `https://faridhhilmi12.github.io/portfolio/` tertulis di `index.html` (canonical, `og:url`, `og:image`, JSON-LD), `robots.txt`, dan `sitemap.xml`. Ganti semuanya kalau memakai domain lain.
- Warna aksen biru ada di `--select` dan `--select-strong`. Ubah di dua tempat untuk mode gelap (blok `@media (prefers-color-scheme: dark)` dan `[data-theme="dark"]`).
- Mode gelap mengikuti pengaturan sistem; tombol di navigasi menggantinya dan pilihannya tersimpan di browser.

## Cara melihat di laptop
Klik dua kali `index.html`, atau di VS Code pakai ekstensi Live Server.

## Cara online gratis (GitHub Pages)
1. Buat repository baru di GitHub, misalnya `portfolio`.
2. Upload semua file di folder ini (atau `git push`).
3. Settings → Pages → Source: branch `main`, folder `/root` → Save.
4. Tunggu 1–2 menit. Alamatnya: `https://faridhhilmi12.github.io/portfolio/`

Alternatif: seret folder ini ke https://app.netlify.com/drop
