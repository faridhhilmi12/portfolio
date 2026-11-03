# Portofolio Muhammad Farid Hilmi

Vite + React + TypeScript + Tailwind CSS v4, dengan interaksi "kanvas Figma" (`motion`). Satu halaman, tanpa router.

## Perintah
```bash
npm install
npm run dev      # server pengembangan
npm test         # Vitest
npm run build    # tsc + build ke dist/
```

## Struktur
| Lokasi | Isi |
|---|---|
| `index.html` | metadata SEO, JSON-LD, skrip tema/bahasa awal (tanpa kedip), `<noscript>` |
| `src/data/` | isi tanpa teks: proyek, pengalaman, keahlian, link (`links.ts`) |
| `src/i18n/` | `id.ts` (sumber kunci) dan `en.ts` (wajib kunci yang sama), `LangProvider` |
| `src/theme/` | `ThemeProvider` (terang/gelap) |
| `src/canvas/` | elemen kanvas bersama: `SelectionBox`, `DotGrid`, `Reveal`, `useCanvasMotion` |
| `src/components/` | Nav, Hero, Projects, Timeline, Skills, Contact, Footer |
| `src/index.css` | token warna dan font (`@theme`), termasuk token mode gelap |
| `public/` | `assets/farid.jpg`, `robots.txt`, `sitemap.xml` |
| `legacy/` | situs statis lama; boleh dihapus setelah Anda yakin |

## Mengubah isi
- **Teks:** ubah `src/i18n/id.ts` dan `src/i18n/en.ts` bersamaan. Build gagal kalau kunci EN ada yang terlewat.
- **Proyek:** tambah atau ubah entri di `src/data/projects.ts`, lalu tambahkan teksnya (`work.<id>.role|title|sub|desc`) di kedua kamus. Isi `image` dengan jalur gambar (misalnya `/assets/waldo.png`, taruh file di `public/assets/`) untuk mengganti ilustrasi wireframe dengan screenshot asli.
- **Screenshot asli** disimpan di `foto-asli/` (di-ignore git, tidak ikut deploy). Yang dipakai situs adalah JPG 1200×750 hasil potongan di `public/assets/`. LMS Telkomsat (proyek internal) sengaja tanpa screenshot: kartunya wireframe dan catatannya menjelaskan alasannya (dijaga tes).
- **Urutan proyek:** di layar lebar mengikuti `projects` (Waldo, BKD, LMS, Himalkom). Di mobile urutannya LMS, Himalkom, BKD, Waldo; ubah `MOBILE_ORDER` di `src/data/projects.ts`. Proyek pertama yang tampil otomatis terbuka.
- **Link kontak:** `src/data/links.ts`. Link yang dikosongkan otomatis tidak ditampilkan.
- **Warna aksen:** `--c-select` dan `--c-select-strong` di `src/index.css`, ada dua set (terang dan gelap).
- **Pasangan Desain↔Kode** (skill yang ikut menyala): `pairs` di `src/data/skills.ts`.

## Alamat situs
Alamat situs saat ini `https://farid-hilmi-portfolio.netlify.app/` tertulis di tempat berikut. Kalau domain berubah (misalnya setelah mengganti nama situs di Netlify atau memakai domain sendiri), ganti di semuanya:
- `index.html`: `canonical`, `og:url`, `og:image`, `twitter:image`, dan JSON-LD (`url`, `image`)
- `public/robots.txt`
- `public/sitemap.xml`

Tautan sosial di JSON-LD (`index.html`) harus selalu sama dengan `src/data/links.ts`.

## Deploy ke Netlify
1. Dorong repo ini ke GitHub.
2. Di Netlify: Add new site, Import from Git, pilih repo. Build command `npm run build`, publish directory `dist` (sudah diatur di `netlify.toml`).
3. Pastikan situs tidak diberi proteksi (Netlify: Site configuration, Access & security, Visitor access harus publik), kalau tidak pengunjung dan pemindai tautan hanya melihat halaman login.

Vercel juga bisa: pilih preset Vite, tanpa berkas tambahan.

## Catatan
- Isi halaman dirender oleh JavaScript. Pratinjau tautan (LinkedIn, WhatsApp) memakai metadata statis di `index.html`, jadi tetap berfungsi. Jika kelak butuh isi yang terbaca tanpa JavaScript, tambahkan prerender.
- Dengan `prefers-reduced-motion`, kursor kolaborator, parallax, drag foto, dan animasi masuk dimatikan.
