/* =========================================================
   1) LINK — ganti di sini. Link yang dikosongkan ('') otomatis
      disembunyikan dari halaman, jadi tidak ada link rusak.
   ========================================================= */
const LINKS = {
  email: 'mailto:faridmochilmi@gmail.com',
  emailText: 'mailto:faridmochilmi@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muhammad-farid-hilmi',
  github: 'https://github.com/faridhhilmi12',
  instagram: 'https://www.instagram.com/faridhhilmi',
  winme: 'https://winme.id/designwebrid1',
  projects: 'https://projects.co.id/public/browse_services/view/a2bf13/jasa-desain-uiux-landing-page-website-profesional-figma',
};

/* =========================================================
   2) TERJEMAHAN — teks Bahasa Indonesia ada langsung di HTML,
      di sini hanya versi Inggrisnya.
   ========================================================= */
const EN = {
  'skip': 'Skip to work',
  'nav.work': 'Work',
  'nav.exp': 'Experience',
  'nav.skills': 'Skills',
  'nav.contact': 'Contact',
  'nav.theme': 'Toggle light/dark theme',
  'nav.menu': 'Open menu',
  'meta.title': 'Muhammad Farid Hilmi — UI/UX Designer & Developer',
  'meta.desc': 'Portfolio of Muhammad Farid Hilmi, a UI/UX designer and web developer from Bogor. I design web interfaces and build them all the way to launch.',
  'hero.frame': 'Home',
  'hero.lead': 'I design web interfaces in Figma, then build them myself all the way to launch. Computer Science student at IPB University, currently a full-stack developer intern at Telkomsat.',
  'hero.cta1': 'See my work',
  'hero.cta2': 'Get in touch',
  'hero.alt': 'Photo of Muhammad Farid Hilmi',
  'work.title': 'Selected work',
  'work.intro': 'Projects I took from research and design all the way to code.',
  'work.p1.role': 'UI/UX & Frontend',
  'work.p1.sub': 'Campus lost & found platform',
  'work.p1.desc': 'A responsive web interface for reporting and finding lost items on campus. I designed the flows, then built a frontend connected to a REST API: authentication, managing lost and found reports, and contact requests between users.',
  'work.p2.role': 'Capstone project',
  'work.p2.title': 'Educational workload projection dashboard',
  'work.p2.sub': 'Interactive data dashboard',
  'work.p2.desc': 'A dashboard for projecting educational workloads. I analyzed the system requirements and shaped the interface so complex data stays easy for users to read.',
  'work.p3.role': 'Full-stack developer',
  'work.p3.sub': 'Learning Management System',
  'work.p3.desc': 'A learning system for internal company use, with sign-in, separate admin and user access, and learning content management.',
  'work.p3.note': 'This is an internal company system, so its link and screenshots aren’t public. I’m happy to walk through its flows and features in a call.',
  'work.p4.role': 'UI designer',
  'work.p4.title': 'Himalkom IPB website',
  'work.p4.sub': 'Computer Science Student Association',
  'work.p4.desc': 'Wireframes and high-fidelity UI for the association’s website, giving the organization a cleaner and more accessible online presence.',
  'exp.title': 'Experience',
  'exp.e1.date': 'Sep 2026 – present',
  'exp.e1.desc': 'Building internal company web applications with Laravel, from the database to the interface.',
  'exp.e2.title': 'Course Coordinator, Systems Analysis and Design',
  'exp.e2.org': 'Department of Computer Science, IPB University',
  'exp.e2.desc': 'Main point of contact between the lecturer and 132 students. Managed class administration, schedules, and the distribution of materials and assignments.',
  'exp.e3.date': 'Jan – Dec 2025',
  'exp.e3.title': 'Creative & Media Branding Staff',
  'exp.e3.org': 'Computer Science Student Association (Himalkom) IPB',
  'exp.e3.desc': 'Produced visual assets for the association’s brand, designed the UI of the Himalkom website, and ran front-of-house and multimedia for large events.',
  'exp.e4.date': '2023 – 2027 (expected)',
  'exp.e4.title': 'Bachelor of Computer Science',
  'exp.e4.desc': 'Relevant coursework: User Experience Design, Systems Analysis and Design, Software Engineering.',
  'skills.title': 'Both sides of the work',
  'skills.intro': 'Because the same person designs and codes, what ships matches what was designed.',
  'skills.design': 'Design',
  'skills.d1': 'UI design & interactive prototypes',
  'skills.d2': 'UX research & wireframing',
  'skills.d3': 'Figma variables & microinteractions',
  'skills.d4': 'System modeling (UML & ERD)',
  'skills.d5': 'Graphic design & brand assets',
  'skills.code': 'Code',
  'skills.c5': 'REST APIs, Swagger, Git & GitHub',
  'skills.certs': 'Certifications',
  'contact.title': 'Have a website or UI design project?',
  'contact.lead': 'I’m open to freelance projects and internships. Tell me what you need and I’ll take it from design to a live website.',
  'contact.email': 'Send an email',
  'contact.winme': 'See my services on Winme',
  'contact.projects': 'Hire me on Projects.co.id',
  'footer.made': 'Designed and built by me.',
};

/* ---------- Pasang link ---------- */
document.querySelectorAll('[data-link]').forEach((el) => {
  const url = LINKS[el.dataset.link];
  if (!url) {
    (el.closest('li') || el).hidden = true;
    return;
  }
  el.href = url;
  if (url.startsWith('http')) {
    el.target = '_blank';
    el.rel = 'noopener';
  }
});

/* ---------- Ganti bahasa ---------- */
const ID = {};
document.querySelectorAll('[data-i18n]').forEach((el) => { ID[el.dataset.i18n] = el.textContent; });
document.querySelectorAll('[data-i18n-alt]').forEach((el) => { ID[el.dataset.i18nAlt] = el.alt; });
document.querySelectorAll('[data-i18n-aria]').forEach((el) => { ID[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

const descMeta = document.querySelector('meta[name="description"]');
ID['meta.title'] = document.title;
ID['meta.desc'] = descMeta ? descMeta.content : '';

function setLang(lang) {
  const dict = lang === 'en' ? EN : ID;
  document.documentElement.lang = lang;
  document.title = dict['meta.title'];
  if (descMeta) descMeta.content = dict['meta.desc'];
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const t = dict[el.dataset.i18nAria];
    if (t) el.setAttribute('aria-label', t);
  });
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const t = dict[el.dataset.i18n];
    if (t) el.textContent = t;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const t = dict[el.dataset.i18nAlt];
    if (t) el.alt = t;
  });
  document.querySelectorAll('.lang button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  try { localStorage.setItem('lang', lang); } catch (e) { /* abaikan */ }
}

document.querySelectorAll('.lang button').forEach((b) => {
  b.addEventListener('click', () => setLang(b.dataset.lang));
});

let saved = null;
try { saved = localStorage.getItem('lang'); } catch (e) { /* abaikan */ }
const initial = saved || ((navigator.language || 'id').toLowerCase().startsWith('id') ? 'id' : 'en');
if (initial !== 'id') setLang(initial);

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Tema terang/gelap ----------
   Tanpa pilihan tersimpan, tema mengikuti sistem (diatur di CSS).
   Tombol hanya membalik tema yang sedang tampil. */
const THEME_COLOR = { light: '#FFFFFF', dark: '#121214' };
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;

function currentTheme() {
  return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
}

document.querySelector('.theme').addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.classList.add('no-anim');
  root.dataset.theme = next;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-anim')));
  try { localStorage.setItem('theme', next); } catch (e) { /* abaikan */ }
  // pilihan manual menggantikan dua meta theme-color berbasis media
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach((m, i) => {
    if (i === 0) { m.removeAttribute('media'); m.content = THEME_COLOR[next]; } else { m.remove(); }
  });
});

/* ---------- Navigasi: bayangan, menu mobile, link aktif ---------- */
const nav = document.querySelector('.nav');
const menuBtn = document.querySelector('.nav__menu');
const navLinks = [...document.querySelectorAll('.nav__links a')];

function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
navLinks.forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
});

if ('IntersectionObserver' in window) {
  const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  // garis pantau di tengah layar: section yang melewatinya dianggap aktif
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        const on = a === byId.get(entry.target.id);
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -54% 0px' });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------- Muncul halus saat di-scroll ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = document.querySelectorAll(
      '.section__head, .project, .timeline li, .bridge, .certs, .contact__inner'
    );
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach((el) => {
      el.classList.add('reveal');
      reveal.observe(el);
    });
  }
}
