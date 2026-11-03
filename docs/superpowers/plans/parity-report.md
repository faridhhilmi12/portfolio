# Laporan paritas: portfolio React vs situs statis

Tanggal: 2026-11-03. Hasil dari sesi eksekusi plan `2026-11-03-portfolio-react.md`.

## Hasil otomatis
- `npx vitest run`: 9 berkas, 55 tes, lulus semua.
- `npx tsc -b`: bersih.
- `npm run build`: berhasil. `dist/index.html` memuat canonical, `og:*`, `twitter:card`, dua `theme-color`, JSON-LD `Person`, dan `<noscript>`. `dist/` juga memuat `robots.txt`, `sitemap.xml`, `assets/farid.jpg`. Bundel JS 390 KB (gzip 125 KB).

## Daftar paritas (spec bagian 8)
| Butir | Hasil | Cara memeriksa |
|---|---|---|
| Teks ID dan EN sama dengan versi statis | Lulus | Kamus dipindah dari `legacy/`; tes kunci `en` = `id`; ID/EN dicoba di browser |
| Ganti bahasa memperbarui judul tab, deskripsi, `aria-label` | Lulus | Tes + browser (title, meta description, label tombol menu/tema) |
| Terang, gelap, ikut sistem | Lulus | Browser (mulai gelap dari sistem, toggle ke terang) |
| Tema tersimpan lewat reload | Lulus | Browser: `localStorage.theme = light`, `data-theme` tetap `light` setelah reload |
| Peralihan tema tanpa kedipan | Lulus dengan catatan | Kelas `no-anim` dipasang sesaat; di pane preview rAF tertahan sehingga ditambah cadangan `setTimeout` (tes RED→GREEN) |
| Menu mobile, Esc menutup | Lulus | Tes + browser 375 px (buka, link terlihat, Esc menutup) |
| Link nav aktif, bayangan nav | Lulus | Tes (IntersectionObserver di-stub) dan terlihat di browser |
| Tanpa scroll horizontal | Lulus | `scrollWidth <= innerWidth` pada 375, 768, 1024, 1280 px |
| Metadata SEO, JSON-LD, robots, sitemap di build | Lulus | `dist/` diperiksa; tes `seo.test.ts` |
| Reduced motion: tanpa kursor, drag, parallax, reveal | Lulus (tes) | Tes unit untuk `useCanvasMotion`, `Hero`, `CollaboratorCursor`, `Reveal`. **Tidak dicoba di browser**: pane preview tidak bisa meniru `prefers-reduced-motion` |
| Kursor kolaborator hanya di perangkat dengan mouse | Lulus | Tes; di browser tampil di desktop, tidak ada di 375 px |
| Frame proyek: pilih, Inspect, catatan privat, fallback gambar | Lulus | Tes (termasuk keyboard dan ganti bahasa) + browser desktop dan mobile (akordeon) |
| Pasangan Desain↔Kode | Lulus | Tes (fokus) + browser dengan hover mouse sungguhan |
| Konsol bersih | Lulus | Tidak ada error pada muatan segar. Satu error `Cannot read properties of null` sempat muncul dari HMR di antara dua suntingan saya, dan tidak muncul lagi setelah muat ulang |

## Bug yang ditemukan di browser (bukan oleh tes unit) dan sudah diperbaiki
1. Opacity kursor tidak pernah naik dari 0 (motion tidak menganimasikannya) → diganti kelas CSS; tes RED→GREEN.
2. Scrollbar horizontal dari lapisan dot grid `-inset-4` → `overflow-x-clip` pada `DotGrid`; tes RED→GREEN.
3. Label ukuran `244 × 104` bertabrakan dengan badge di mobile → disembunyikan di bawah `md`; tes RED→GREEN.
4. Kelas `no-anim` bisa tertinggal bila rAF tertahan → cadangan `setTimeout`; tes RED→GREEN.

## Temuan review akhir yang diperbaiki
1. Warna address bar (`theme-color`) tidak mengikuti tombol tema, berbeda dari versi statis → `syncThemeColor` di `ThemeProvider`; 2 tes RED→GREEN (+1 tes pelindung).
2. Menu mobile yang terbuka ikut terbawa ke lebar desktop saat layar diputar → gaya dropdown dibatasi `max-md:`; tes RED→GREEN.
3. Tes bahasa dengan storage terblokir tidak bisa gagal → dimulai dari ID lewat `navigator.language`; terbukti gagal di bawah mutasi (state hanya berubah bila storage berhasil).

## Temuan Minor yang ditunda
- Transisi layout pada panel Inspect belum ada (spec bagian 4).
- Kartu proyek di mobile belum punya `aria-expanded`/`aria-controls`, dan judul proyek bukan heading.
- Deskripsi proyek yang tidak terpilih tidak ada di DOM, jadi tidak terindeks; `<noscript>` hanya memuat ringkasan hero.
- Garis seleksi menganimasikan `clip-path` (spec: hanya transform/opacity); sama seperti versi statis.

## Yang tidak bisa dipastikan di sini
- **Smooth-scroll:** pane preview tidak menjalankan smooth-scroll (juga pada `scrollTo` polos). Perlu dicek di browser Anda.
- **`prefers-reduced-motion` di browser nyata** dan **pratinjau tautan** di LinkedIn/WhatsApp (butuh alamat final yang online).
- **Audit kontras WCAG** pada token baru tidak dijalankan ulang; nilai token disalin dari versi statis yang sudah diperiksa.
- **Alamat final:** semua metadata masih memakai `https://faridhhilmi12.netlify.app/` (placeholder).
