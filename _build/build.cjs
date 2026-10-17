#!/usr/bin/env node
/* Builds the static HTML pages from shared templates and the EN dictionary.
   Run: node _build/build.cjs   (output: ../*.html). Folder starts with "_" so GitHub Pages skips it. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const SITE = "https://stacklayer-studio.github.io/mostova-concept/";
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/i18n.js"), "utf8"), ctx);
const EN = ctx.window.MOSTOVA_I18N.en;
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/data.js"), "utf8"), ctx);
const DATA = ctx.window.MOSTOVA;
const CN = (c) => esc(DATA.cities[c].en), SN = (k) => esc(DATA.sectors[k].en);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const t = (k) => { if (!(k in EN)) throw new Error("Missing key " + k); return esc(EN[k].split("|").pop()); };
const x = (tag, k, attrs = "") => `<${tag} data-i18n="${k}"${attrs ? " " + attrs : ""}>${t(k)}</${tag}>`;
const attr = (pairs) => `data-i18n-attr="${pairs.map(([a, k]) => a + ":" + k).join(",")}" ${pairs.map(([a, k]) => `${a}="${t(k)}"`).join(" ")}`;

/* ---------- Icons ---------- */
const P = {
  check: '<path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3"/>',
  dash: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 12h8" stroke="currentColor" stroke-width="2.4"/>',
  bed: '<path d="M3 18V6M3 13h18v5M21 13v-2a3 3 0 00-3-3h-7v5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="10" r="2" fill="currentColor"/>',
  bus: '<rect x="4" y="3" width="16" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 11h16M7 21v-3M17 21v-3" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="14.5" r="1.2" fill="currentColor"/><circle cx="16" cy="14.5" r="1.2" fill="currentColor"/>',
  plant: '<path d="M2 21V10l6 4V10l6 4V5h4l1 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 21h20" stroke="currentColor" stroke-width="2"/>',
  info: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7v1.5" stroke="currentColor" stroke-width="2.2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4"/>',
  filter: '<path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" stroke-width="2.2"/>',
  users: '<circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M16 4.5a3.5 3.5 0 010 7M18 14c2.5.5 4 2.5 4 6" fill="none" stroke="currentColor" stroke-width="2"/>',
  season: '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2"/><path d="M8 14h3v3H8z" fill="currentColor"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 3 3-3M9 20l3-3 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  coord: '<circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 4l3-2" stroke="currentColor" stroke-width="2"/>',
  house: '<path d="M3 11l9-7 9 7v10H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 21v-6h6v6" fill="none" stroke="currentColor" stroke-width="2"/>',
  reg: '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2"/>',
  heart: '<path d="M12 20s-8-4.6-8-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 018 2.5C20 15.4 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
};
const ic = (n, cls = "") => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${P[n]}</svg>`;

const LOGO = (w) => `<svg viewBox="0 0 150 34"${w ? ` width="${w}"` : ""} aria-hidden="true"><path d="M2 28 Q16 4 30 28" fill="none" stroke="#ff6b1a" stroke-width="4"/><path d="M0 28h32M9 28v-8M16 28v-11M23 28v-8" stroke="#ff6b1a" stroke-width="2.5"/><text x="38" y="28" fill="#fff" font-family="Fira Sans Extra Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="30">Mostova</text></svg>`;

/* ---------- Shell ---------- */
const NAV = [["jobs.html", "nav.jobs", "jobs"], ["employers.html", "nav.employers", "employers"], ["housing.html", "nav.housing", "housing"], ["contact.html", "nav.contact", "contact"]];
function navLinks(page) {
  return NAV.map(([h, k, p]) => `<a href="${h}" data-i18n="${k}"${p === page ? ' aria-current="page"' : ""}>${t(k)}</a>`).join("\n      ");
}
function shell({ page, file, title, desc, body, bodyClass = "" }) {
  const url = SITE + (file === "index.html" ? "" : file);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t(title)}</title>
<meta name="description" content="${t(desc)}">
<meta name="theme-color" content="#06111f">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mostova Staffing (concept)">
<meta property="og:title" content="${t(title)}">
<meta property="og:description" content="${t(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Mostova Staffing concept: food production jobs with shift bars and temperature chips">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="uk_UA">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:wght@600;700;800&family=Golos+Text:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
<script>document.documentElement.classList.add("js");try{var l=localStorage.getItem("mostova.lang");if(l==="uk")document.documentElement.lang="uk"}catch(e){}</script>
<script src="assets/i18n.js" defer></script>
<script src="assets/data.js" defer></script>
<script src="assets/app.js" defer></script>
</head>
<body data-page="${page}" data-title="${title}" data-desc="${desc}"${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip" href="#main" data-i18n="skip">${t("skip")}</a>
<p class="concept">${ic("info")}<span data-i18n="banner">${t("banner")}</span></p>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html" ${attr([["aria-label", "brand.home"]])}>${LOGO()}</a>
    <nav class="nav" ${attr([["aria-label", "nav.main"]])}>
      ${navLinks(page)}
    </nav>
    <div class="header-end">
      <div class="lang" role="group" ${attr([["aria-label", "lang.label"]])}>
        <button type="button" lang="pl" aria-disabled="true" ${attr([["data-tip", "lang.soon"]])}>PL<span class="sr"> <span data-i18n="lang.soon">${t("lang.soon")}</span></span></button>
        <button type="button" lang="uk" data-lang="uk" aria-pressed="false">UA<span class="sr"> Українська</span></button>
        <button type="button" lang="ru" aria-disabled="true" ${attr([["data-tip", "lang.soon"]])}>RU<span class="sr"> <span data-i18n="lang.soon">${t("lang.soon")}</span></span></button>
        <button type="button" lang="en" data-lang="en" aria-pressed="true">EN<span class="sr"> English</span></button>
      </div>
      <a class="btn btn-orange btn-sm header-cta" href="employers.html#request" data-i18n="nav.request">${t("nav.request")}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" ${attr([["aria-label", "nav.menu"]])}>
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path class="l1" d="M3 6h16" stroke="currentColor" stroke-width="2"/><path class="l2" d="M3 11h16" stroke="currentColor" stroke-width="2"/><path class="l3" d="M3 16h16" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" ${attr([["aria-label", "nav.menu"]])}><div>
    <a href="index.html" data-i18n="nav.home"${page === "home" ? ' aria-current="page"' : ""}>${t("nav.home")}</a>
    ${navLinks(page)}
    <a class="btn btn-orange" href="employers.html#request" data-i18n="nav.request">${t("nav.request")}</a>
  </div></nav>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        ${LOGO(130)}
        <p style="margin-top:12px;max-width:34ch" data-i18n="foot.tag">${t("foot.tag")}</p>
      </div>
      <div>${x("h3", "foot.workers")}<ul><li><a href="jobs.html" data-i18n="nav.jobs">${t("nav.jobs")}</a></li><li><a href="housing.html" data-i18n="nav.housing">${t("nav.housing")}</a></li><li><a href="index.html#how" data-i18n="foot.apply">${t("foot.apply")}</a></li><li><a href="contact.html#faq" data-i18n="foot.faq">${t("foot.faq")}</a></li></ul></div>
      <div>${x("h3", "foot.employers")}<ul><li><a href="employers.html#request" data-i18n="nav.request">${t("nav.request")}</a></li><li><a href="employers.html#process" data-i18n="foot.process">${t("foot.process")}</a></li><li><a href="employers.html#compliance" data-i18n="foot.compliance">${t("foot.compliance")}</a></li></ul></div>
      <div>${x("h3", "foot.company")}<ul><li><a href="contact.html" data-i18n="nav.contact">${t("nav.contact")}</a></li><li><a href="contact.html#offices" data-i18n="foot.offices">${t("foot.offices")}</a></li><li><a href="mailto:hello@mostova.example">hello@mostova.example</a></li></ul></div>
    </div>
    <div class="foot-legal">
      <p class="foot-concept" data-i18n="banner">${t("banner")}</p>
      <p data-i18n="foot.legal">${t("foot.legal")}</p>
      <p data-i18n="foot.made">${t("foot.made")}</p>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

/* ---------- Shared blocks ---------- */
const board = (light = false, id = "") => `<div class="board${light ? " light" : ""}"${id ? ` id="${id}"` : ""} role="group" ${attr([["aria-label", "board.aria"]])}>
      <div class="${light ? "board-in" : "wrap"}">
        <div class="board-top">${x("strong", "board.h")}${x("span", "board.sub")}</div>
        <div class="track" aria-hidden="true"><i></i></div>
        <ol class="marks">
          ${[0, 1, 2, 3].map((i) => `<li><b data-i18n="board.${i}">${t("board." + i)}</b>${x("span", `board.${i}p`)}</li>`).join("\n          ")}
        </ol>
      </div>
    </div>`;
const steps = (pre, tKeys) => `<ol class="steps">
${[1, 2, 3, 4].map((i) => `<li><span class="t"${tKeys ? ` data-i18n="${pre}${i}t"` : ""}>${tKeys ? t(pre + i + "t") : t("board." + (i - 1))}</span><div>${x("h4", pre + i)}${x("p", pre + i + "p")}</div></li>`).join("\n")}
</ol>`;

function lineArt(w, h, id) {
  // Production line: belt, rollers, moving crates, cold-room door, hanging lamps
  const crates = [];
  for (let i = -1; i < Math.ceil(w / 60) + 1; i++) {
    const hot = i % 4 === 1;
    crates.push(`<rect class="${hot ? "crate-hot" : "crate"}" x="${i * 60 + 14}" y="${h - 58}" width="${hot ? 30 : 36}" height="${hot ? 22 : 26}" rx="2"/>`);
  }
  const rollers = [];
  for (let x = 10; x < w; x += 26) rollers.push(`<circle cx="${x}" cy="${h - 26}" r="5" fill="none" stroke="#3b5f8a" stroke-width="2"/>`);
  const dT = Math.round(h * 0.3);
  const lamps = [];
  for (let x = 70; x < w; x += 160) lamps.push(`<path d="M${x} 0v${h * 0.22}" stroke="#22395a" stroke-width="2"/><path d="M${x - 16} ${h * 0.22 + 10}h32l-6-10h-20z" fill="#22395a"/><path d="M${x - 14} ${h * 0.22 + 10}L${x - 40} ${h - 50}h80L${x + 14} ${h * 0.22 + 10}z" fill="url(#beam${id})" opacity=".5"/>`);
  return `<svg class="line-art" viewBox="0 0 ${w} ${h}" ${id === "e" ? `role="img" ${attr([["aria-label", "emp.line.aria"]])}` : 'aria-hidden="true"'} preserveAspectRatio="xMidYMax slice">
  <defs><linearGradient id="beam${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8f0" stop-opacity=".55"/><stop offset="1" stop-color="#9fd8f0" stop-opacity="0"/></linearGradient>
  <linearGradient id="door${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#173f6e"/><stop offset="1" stop-color="#0f2d52"/></linearGradient></defs>
  ${lamps.join("")}
  <rect x="${w - 120}" y="${dT}" width="96" height="${h - dT - 32}" fill="url(#door${id})" stroke="#22395a" stroke-width="2"/>
  ${[0, 1, 2, 3, 4].map((i) => `<path d="M${w - 112 + i * 20} ${dT + 6}v${h - dT - 44}" stroke="#9fd8f0" stroke-opacity=".25" stroke-width="10"/>`).join("")}
  <rect x="${w - 104}" y="${dT - 26}" width="64" height="20" rx="3" fill="#06111f" stroke="#9fd8f0" stroke-opacity=".5"/>
  <text x="${w - 72}" y="${dT - 11}" text-anchor="middle" font-family="Fira Sans Extra Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="14" fill="#def3fc">+2 °C</text>
  <g class="move">${crates.join("")}</g>
  <path class="belt" d="M0 ${h - 32}H${w}M0 ${h - 20}H${w}" stroke-width="3"/>
  ${rollers.join("")}
  <path d="M0 ${h - 2}H${w}" stroke="#22395a" stroke-width="4"/>
  ${[40, w * 0.45, w - 170].map((x) => `<path d="M${x} ${h - 18}l-10 18M${x} ${h - 18}l10 18" stroke="#22395a" stroke-width="3"/>`).join("")}
</svg>`;
}

/* ---------- Pages ---------- */
const SECTORS = [["meat", 2, 8], ["dairy", 4, 8], ["bakery", 20, 32], ["cold", -24, 2], ["packing", 4, 12]];
const MIN_T = -30, MAX_T = 35, pct = (v) => ((v - MIN_T) / (MAX_T - MIN_T)) * 100;
const sign = (v) => (v > 0 ? "+" + v : v < 0 ? "−" + Math.abs(v) : "0");

function home() {
  const sectors = SECTORS.map(([k, a, b]) => `<li class="sector" data-reveal>
          <span class="temp${a >= 15 ? " warm" : ""}">${sign(a)}…${sign(b)}<small style="font-size:.45em"> °C</small></span>
          <div><h3><a href="jobs.html?sector=${k}" data-sector-name="${k}">${SN(k)}</a><span class="count" data-sector-count="${k}"></span></h3>${x("p", "sec." + k + ".p")}</div>
          <div class="thermo" role="img" aria-label="${sign(a)} … ${sign(b)} °C">
            <span class="scale"></span><span class="zero" style="left:${pct(0)}%"></span>
            <span class="band${a >= 15 ? " warm" : ""}" style="left:${pct(a)}%;width:${pct(b) - pct(a)}%"></span>
            ${[-30, -15, 0, 15, 30].map((v) => `<span class="tick${v === -30 ? " first" : v === 30 ? " last" : ""}" style="left:${pct(v)}%" aria-hidden="true">${sign(v)}</span>`).join("")}
          </div>
        </li>`).join("\n        ");
  const body = `
  <section class="hero" aria-labelledby="work-h">
    <div class="hero-grid">
      <div class="path path-work">
        ${x("p", "home.work.who", 'class="who"')}
        ${x("h1", "home.work.h", 'id="work-h"')}
        ${x("p", "home.work.p")}
        <ul class="facts">${x("li", "home.work.f1")}${x("li", "home.work.f2")}${x("li", "home.work.f3")}</ul>
        <div class="route" role="img" ${attr([["aria-label", "home.route.aria"]])}>
          <div class="stop"><span>${ic("bed")}</span>${x("span", "home.route.room")}</div><i class="seg"></i>
          <div class="stop"><span>${ic("bus")}</span>${x("span", "home.route.bus")}</div><i class="seg"></i>
          <div class="stop"><span>${ic("plant")}</span>${x("span", "home.route.line")}</div>
        </div>
        <div class="ctas">
          <a class="btn btn-orange" href="jobs.html" id="heroJobs">${t("home.work.cta").replace("{n}", "22")}</a>
          <a class="btn btn-ghost" href="#how" data-i18n="home.work.cta2">${t("home.work.cta2")}</a>
        </div>
      </div>
      <div class="path path-hire on-dark">
        ${x("p", "home.hire.who", 'class="who"')}
        ${x("h2", "home.hire.h")}
        ${x("p", "home.hire.p")}
        <ul class="facts">${x("li", "home.hire.f1")}${x("li", "home.hire.f2")}</ul>
        ${lineArt(520, 120, "h")}
        <div class="ctas">
          <a class="btn btn-orange" href="employers.html#request" data-i18n="home.hire.cta">${t("home.hire.cta")}</a>
          <a class="btn btn-ghost" href="employers.html#process" data-i18n="home.hire.cta2">${t("home.hire.cta2")}</a>
        </div>
      </div>
    </div>
    ${board()}
  </section>

  <section class="sec on-dark" aria-labelledby="numbers-h">
    <div class="wrap">
      <div class="sec-head">${x("h2", "home.num.h", 'id="numbers-h"')}</div>
      <ul class="numbers" data-reveal>
        <li><b data-count="1200">1200</b>${x("span", "home.num.1")}</li>
        <li><b data-count="38">38</b>${x("span", "home.num.2")}</li>
        <li><b><em data-count="48">48</em><small data-i18n="u.h">h</small></b>${x("span", "home.num.3")}</li>
        <li><b data-count="4">4</b>${x("span", "home.num.4")}</li>
      </ul>
      ${x("p", "home.num.note", 'class="note"')}
    </div>
  </section>

  <section class="sec" aria-labelledby="sectors-h">
    <div class="wrap">
      <div class="sec-head">${x("h2", "home.sec.h", 'id="sectors-h"')}${x("p", "home.sec.p")}</div>
      <ul class="sectors">
        ${sectors}
      </ul>
    </div>
  </section>

  <section class="sec frost" aria-labelledby="urgent-h">
    <div class="wrap">
      <div class="sec-head-row">
        <div class="sec-head">${x("h2", "home.urg.h", 'id="urgent-h"')}${x("p", "home.urg.p")}</div>
        <a class="link-more" href="jobs.html" data-i18n="home.urg.all">${t("home.urg.all")}</a>
      </div>
      <div class="jobs-grid four" id="urgentJobs"></div>
    </div>
  </section>

  <section class="sec" id="how" aria-labelledby="how-h">
    <div class="wrap">
      <div class="sec-head">${x("h2", "home.how.h", 'id="how-h"')}</div>
      <div class="tracks">
        <div class="track-col" data-reveal>${x("h3", "home.how.w")}${x("p", "home.how.wp")}${steps("home.how.w", true)}
          <a class="btn btn-orange" href="jobs.html" data-i18n="home.final.find">${t("home.final.find")}</a></div>
        <div class="track-col" data-reveal>${x("h3", "home.how.e")}${x("p", "home.how.ep")}${steps("home.how.e", false)}
          <a class="btn btn-ink" href="employers.html#request" data-i18n="home.hire.cta">${t("home.hire.cta")}</a></div>
      </div>
    </div>
  </section>

  <section class="sec navy on-dark" id="housing" aria-labelledby="housing-h">
    <div class="wrap housing">
      <div class="iso-wrap" data-iso="2" data-iso-label="home.house.aria"></div>
      <div>
        <div class="sec-head" style="margin-bottom:0">${x("h2", "home.house.h", 'id="housing-h"')}${x("p", "home.house.p")}</div>
        <p class="price-tag"><b>400–600</b>${x("span", "home.house.price")}</p>
        <ul class="checks">
          <li>${ic("check")}${x("span", "home.house.c1")}</li>
          <li>${ic("check")}${x("span", "home.house.c2")}</li>
          <li>${ic("check")}${x("span", "home.house.c3")}</li>
        </ul>
        <p style="margin:22px 0 0"><a class="link-more" href="housing.html" data-i18n="home.house.more">${t("home.house.more")}</a></p>
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="quote-h">
    <div class="wrap">
      ${x("h2", "home.q.h", 'id="quote-h" class="sr"')}
      <figure class="quote" data-reveal>
        <span class="sample">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="home.q.sample">${t("home.q.sample")}</span></span>
        ${x("blockquote", "home.q.text")}
        ${x("figcaption", "home.q.by")}
      </figure>
    </div>
  </section>

  <section class="sec frost" id="offices" aria-labelledby="offices-h">
    <div class="wrap">
      <div class="sec-head-row">
        <div class="sec-head">${x("h2", "home.off.h", 'id="offices-h"')}</div>
        <a class="link-more" href="contact.html" data-i18n="home.off.more">${t("home.off.more")}</a>
      </div>
      <div class="offices" id="officeList"></div>
    </div>
  </section>

  <section class="final" aria-labelledby="final-h">
    <div class="wrap">
      ${x("h2", "home.final.h", 'id="final-h"')}
      <div>
        ${x("p", "home.final.p")}
        <div class="ctas">
          <a class="btn btn-ink" href="employers.html#request" data-i18n="home.hire.cta">${t("home.hire.cta")}</a>
          <a class="btn btn-ghost" href="jobs.html" data-i18n="home.final.find">${t("home.final.find")}</a>
        </div>
      </div>
    </div>
  </section>`;
  return shell({ page: "home", file: "index.html", title: "meta.home.t", desc: "meta.home.d", body });
}

function jobsPage() {
  const opt = (name, val, labelKey, extra = "") => `<label><input type="checkbox" name="${name}" value="${val}">${extra}<span data-i18n="${labelKey}">${t(labelKey)}</span></label>`;
  const cities = ["lodz", "poznan", "kutno", "wrzesnia", "konin", "lowicz"];
  const cityOpts = cities.map((c) => `<label><input type="checkbox" name="city" value="${c}"><span data-city="${c}">${CN(c)}</span></label>`).join("");
  const sectorOpts = SECTORS.map(([k]) => `<label><input type="checkbox" name="sector" value="${k}"><span data-sector-name="${k}">${SN(k)}</span></label>`).join("");
  const SH = { morning: [6, 14], afternoon: [14, 22], night: [22, 6], long: [6, 18] };
  const mini = ([a, b]) => `<span class="mini" aria-hidden="true">${Array.from({ length: 24 }, (_, h) => `<i${(a < b ? h >= a && h < b : h >= a || h < b) ? ' class="on"' : ""}></i>`).join("")}</span>`;
  const shiftOpts = Object.keys(SH).map((k) => opt("shift", k, "shift." + k, mini(SH[k]))).join("");
  const contractOpts = ["temp", "emp", "mandate"].map((k) => opt("contract", k, "contract." + k + ".s")).join("");
  const body = `
  <section class="page-head" aria-labelledby="jobs-h">
    <div class="wrap">
      <ol class="crumbs" ${attr([["aria-label", "job.crumb"]])}><li><a href="index.html" data-i18n="nav.home">${t("nav.home")}</a></li><li aria-current="page" data-i18n="nav.jobs">${t("nav.jobs")}</li></ol>
      ${x("h1", "jobs.h", 'id="jobs-h"')}
      ${x("p", "jobs.lead", 'class="lead"')}
      <form class="search" role="search" id="searchForm">
        <div class="field"><label for="q" data-i18n="jobs.q">${t("jobs.q")}</label><input class="input" id="q" name="q" type="search" autocomplete="off" ${attr([["placeholder", "jobs.qph"]])}></div>
        <button class="btn btn-orange" type="submit" data-i18n="jobs.search">${t("jobs.search")}</button>
      </form>
    </div>
  </section>

  <div class="wrap jobs-layout">
    <div class="scrim" data-close-sheet></div>
    <aside class="filters-panel" id="filters" aria-labelledby="filters-h">
      <div class="sheet-head"><h2 id="filters-h" data-i18n="jobs.filters">${t("jobs.filters")}</h2><button class="icon-btn" type="button" data-close-sheet ${attr([["aria-label", "jobs.f.close"]])}>${ic("x").replace("<svg", '<svg width="22" height="22"')}</button></div>
      <div class="panel-title"><h2 data-i18n="jobs.filters" aria-hidden="true">${t("jobs.filters")}</h2><button class="text-btn" type="button" data-clear data-i18n="jobs.f.clear">${t("jobs.f.clear")}</button></div>
      <form class="filters" id="filterForm">
        <fieldset><legend class="lbl" data-i18n="jobs.f.city">${t("jobs.f.city")}</legend><div class="seg">${cityOpts}</div></fieldset>
        <fieldset><legend class="lbl" data-i18n="jobs.f.sector">${t("jobs.f.sector")}</legend><div class="seg">${sectorOpts}</div></fieldset>
        <fieldset><legend class="lbl" data-i18n="jobs.f.shift">${t("jobs.f.shift")}</legend><div class="seg">${shiftOpts}</div></fieldset>
        <fieldset><legend class="lbl" data-i18n="jobs.f.contract">${t("jobs.f.contract")}</legend><div class="seg">${contractOpts}</div></fieldset>
        <div class="switches">
          <label class="switch"><span data-i18n="jobs.f.housing">${t("jobs.f.housing")}</span><input type="checkbox" name="housing" value="1"></label>
          <label class="switch"><span data-i18n="jobs.f.noexp">${t("jobs.f.noexp")}</span><input type="checkbox" name="noexp" value="1"></label>
        </div>
        <div class="field"><label class="lbl" for="f-lang" data-i18n="jobs.f.lang">${t("jobs.f.lang")}</label>
          <select class="select" id="f-lang" name="lang"><option value="" data-i18n="jobs.f.any">${t("jobs.f.any")}</option>${["uk", "pl", "ru", "en"].map((l) => `<option value="${l}" data-i18n="lang.${l}">${t("lang." + l)}</option>`).join("")}</select></div>
        ${x("p", "jobs.closed.note", 'class="closed-note"')}
      </form>
      <div class="sheet-foot"><button class="btn btn-quiet" type="button" data-clear data-i18n="jobs.f.clear">${t("jobs.f.clear")}</button><button class="btn btn-orange" type="button" data-close-sheet id="showBtn">Show jobs</button></div>
    </aside>

    <section aria-labelledby="count" class="results-col">
      <div class="results-bar">
        <h2 class="count" id="count" aria-live="polite" aria-atomic="true">22 open jobs</h2>
        <div class="results-tools">
          <button class="btn btn-ink btn-sm filter-open" type="button" aria-controls="filters" aria-expanded="false">${ic("filter")}<span data-i18n="jobs.filters">${t("jobs.filters")}</span><span class="badge" id="fBadge" hidden>0</span></button>
          <label class="sr" for="sort" data-i18n="jobs.sort">${t("jobs.sort")}</label>
          <select class="select" id="sort"><option value="new" data-i18n="jobs.sort.new">${t("jobs.sort.new")}</option><option value="pay" data-i18n="jobs.sort.pay">${t("jobs.sort.pay")}</option></select>
        </div>
      </div>
      <div class="active-filters" id="activeFilters" role="group" ${attr([["aria-label", "jobs.active"]])}></div>
      <div class="jobs-grid three results" id="results"></div>
      <div class="empty" id="empty" hidden>
        <p class="temp" aria-hidden="true">0</p>
        ${x("h2", "jobs.empty.h")}
        ${x("p", "jobs.empty.p")}
        <div class="sugg" id="sugg"></div>
        ${x("p", "jobs.empty.general", 'class="hint"')}
        <p style="margin:14px 0 0"><a class="btn btn-orange" href="job.html?id=general#apply" data-i18n="jobs.empty.apply">${t("jobs.empty.apply")}</a></p>
      </div>
      <nav class="pager" id="pager" ${attr([["aria-label", "jobs.pages"]])}></nav>
    </section>
  </div>`;
  return shell({ page: "jobs", file: "jobs.html", title: "meta.jobs.t", desc: "meta.jobs.d", body });
}

function jobPage() {
  const yn = (name, three) => `<div class="seg ${three ? "grid3" : "grid2"}" role="radiogroup">
            <label><input type="radio" name="${name}" value="yes"><span data-i18n="ap.yes">${t("ap.yes")}</span></label>
            <label><input type="radio" name="${name}" value="no"><span data-i18n="ap.no">${t("ap.no")}</span></label>
            ${three ? `<label><input type="radio" name="${name}" value="progress"><span data-i18n="ap.progressv">${t("ap.progressv")}</span></label>` : ""}
          </div>`;
  const q = (name, key, three) => `<fieldset class="field" data-field="${name}" aria-describedby="e-${name}"><legend class="lbl" data-i18n="${key}">${t(key)}</legend>${yn(name, three)}<p class="err" id="e-${name}"></p></fieldset>`;
  const body = `
  <section class="jd-head" id="jdHead" aria-labelledby="role-h"></section>
  <div class="wrap jd-layout">
    <div class="jd-main" id="jdMain"></div>
    <aside class="apply-card" id="apply" aria-labelledby="apply-h">
      <header>
        <h2 id="apply-h" data-i18n="ap.h">${t("ap.h")}</h2>
        ${x("p", "ap.p", 'id="apIntro"')}
        <span class="demo-tag">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="ap.demo">${t("ap.demo")}</span></span>
        <ol class="progress" id="apProgress" ${attr([["aria-label", "ap.progress"]])}>
          <li aria-current="step" data-i18n="ap.s1">${t("ap.s1")}</li><li data-i18n="ap.s2">${t("ap.s2")}</li><li data-i18n="ap.s3">${t("ap.s3")}</li>
        </ol>
      </header>
      <form class="flow" id="applyForm" novalidate>
        <p class="step-meta" id="apMeta" aria-live="polite">Step 1 of 3</p>
        <div class="err-sum" id="apErr" role="alert"></div>
        <div class="stepper-step" data-step="1">
          <div class="field" data-field="name"><label for="a-name" data-i18n="ap.name">${t("ap.name")}</label><input class="input" id="a-name" name="name" autocomplete="name" required aria-describedby="e-name"><p class="err" id="e-name"></p></div>
          <div class="field" data-field="phone"><label for="a-phone" data-i18n="ap.phone">${t("ap.phone")}</label>
            <div class="phone-row"><select class="select" id="a-code" name="code" ${attr([["aria-label", "ap.code"]])}><option>+48</option><option selected>+380</option><option>+373</option><option>+57</option><option>+995</option></select>
            <input class="input" id="a-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" required aria-describedby="e-phone" placeholder="000 000 000"></div><p class="err" id="e-phone"></p></div>
          <div class="field"><label for="a-lang" data-i18n="ap.calllang">${t("ap.calllang")}</label>
            <select class="select" id="a-lang" name="calllang">${["uk", "pl", "ru", "en"].map((l) => `<option value="${l}" data-i18n="lang.${l}">${t("lang." + l)}</option>`).join("")}</select></div>
          <fieldset class="field"><legend class="lbl" data-i18n="ap.msgr">${t("ap.msgr")}</legend>
            <div class="seg grid2">
              <label><input type="radio" name="msgr" value="Viber" checked>Viber</label>
              <label><input type="radio" name="msgr" value="WhatsApp">WhatsApp</label>
              <label><input type="radio" name="msgr" value="Telegram">Telegram</label>
              <label><input type="radio" name="msgr" value="call"><span data-i18n="ap.call">${t("ap.call")}</span></label>
            </div></fieldset>
          <div class="field"><label for="a-city" data-i18n="ap.city">${t("ap.city")}</label><input class="input" id="a-city" name="city" autocomplete="address-level2" ${attr([["placeholder", "ap.cityph"]])}></div>
        </div>
        <div class="stepper-step" data-step="2" hidden>
          ${x("p", "ap.why", 'class="why"')}
          ${q("passport", "ap.passport")}
          ${q("permit", "ap.permit", true)}
          ${q("pesel", "ap.pesel")}
          <fieldset class="field" data-field="exp" aria-describedby="e-exp"><legend class="lbl" data-i18n="ap.exp">${t("ap.exp")}</legend>
            <div class="seg grid3">${["none", "lt1", "gt1"].map((v) => `<label><input type="radio" name="exp" value="${v}"><span data-i18n="ap.exp.${v}">${t("ap.exp." + v)}</span></label>`).join("")}</div><p class="err" id="e-exp"></p></fieldset>
          <div class="field" data-field="start"><label for="a-start" data-i18n="ap.start">${t("ap.start")}</label><input class="input" id="a-start" name="start" type="date" required aria-describedby="e-start"><p class="err" id="e-start"></p></div>
        </div>
        <div class="stepper-step" data-step="3" hidden>
          <div class="field" data-field="cv"><label for="a-cv" data-i18n="ap.cv">${t("ap.cv")}</label>
            <div class="file"><input id="a-cv" name="cv" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg" aria-describedby="h-cv e-cv"></div>
            ${x("p", "ap.cvhint", 'class="hint" id="h-cv"')}<p class="err" id="e-cv"></p></div>
          <div class="field" data-field="c1">
            <label class="check"><input type="checkbox" name="c1" required aria-describedby="e-c1"><span><span data-i18n="ap.c1">${t("ap.c1")}</span><small data-i18n="ap.c1r">${t("ap.c1r")}</small></span></label>
            <p class="err" id="e-c1"></p></div>
          <label class="check"><input type="checkbox" name="c2"><span><span data-i18n="ap.c2">${t("ap.c2")}</span><small data-i18n="ap.c2o">${t("ap.c2o")}</small></span></label>
        </div>
        <div class="stepper-step" data-step="4" hidden><div class="review" id="apReview"></div></div>
        <div class="flow-nav">
          <button class="btn btn-quiet" type="button" id="apBack" hidden data-i18n="ap.back">${t("ap.back")}</button>
          <button class="btn btn-orange" type="submit" id="apNext" data-i18n="ap.next">${t("ap.next")}</button>
        </div>
      </form>
      <div class="success" id="apOk" hidden tabindex="-1">
        <div class="tick">${'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3"/></svg>'}</div>
        ${x("h3", "ap.ok.h")}
        <p id="apOkText"></p>
        <span class="demo-tag light">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="ap.ok.demo">${t("ap.ok.demo")}</span></span>
        <a class="btn btn-ink" href="jobs.html" data-i18n="ap.ok.more">${t("ap.ok.more")}</a>
      </div>
      <div class="closed-side" id="apClosed" hidden>
        ${x("p", "job.closed.side")}
        <a class="btn btn-orange" href="#similar" data-i18n="job.closed.cta">${t("job.closed.cta")}</a>
      </div>
    </aside>
  </div>
  <div class="apply-bar" id="applyBar" role="region" ${attr([["aria-label", "ap.bar"]])}>
    <div class="meta"><b id="barPay"></b><span id="barMeta"></span></div>
    <a class="btn btn-orange" href="#apply" data-i18n="ap.bar">${t("ap.bar")}</a>
  </div>`;
  return shell({ page: "job", file: "job.html", title: "meta.jobs.t", desc: "meta.jobs.d", body, bodyClass: "has-bar" });
}

function employersPage() {
  const svc = [["users", 1], ["season", 2], ["snow", 3], ["coord", 4], ["house", 5]];
  const comp = [["reg", 1], ["pen", 2], ["globe", 3], ["shield", 4], ["heart", 5], ["lock", 6]];
  const roles = ["line", "packer", "picker", "forklift", "deboner", "baker", "qc"];
  const fld = (id, key, type = "text", extra = "", opt = false) => `<div class="field" data-field="${id}"><label for="w-${id}"><span data-i18n="${key}">${t(key)}</span>${opt ? ` <span class="opt">(<span data-i18n="wz.opt">${t("wz.opt")}</span>)</span>` : ""}</label><input class="input" id="w-${id}" name="${id}" type="${type}" ${extra} aria-describedby="we-${id}"><p class="err" id="we-${id}"></p></div>`;
  const body = `
  <section class="page-head" aria-labelledby="emp-h">
    <div class="wrap head-split">
      <div>
        <ol class="crumbs" ${attr([["aria-label", "job.crumb"]])}><li><a href="index.html" data-i18n="nav.home">${t("nav.home")}</a></li><li aria-current="page" data-i18n="nav.employers">${t("nav.employers")}</li></ol>
        ${x("h1", "emp.h", 'id="emp-h"')}
        ${x("p", "emp.lead", 'class="lead"')}
        <div class="head-ctas"><a class="btn btn-orange" href="#request" data-i18n="emp.cta">${t("emp.cta")}</a><a class="btn btn-ghost" href="tel:+48000000000">${ic("phone")}<span data-i18n="emp.call">${t("emp.call")}</span></a></div>
      </div>
      <div class="emp-art">${lineArt(640, 300, "e")}</div>
    </div>
  </section>

  <section class="sec" aria-labelledby="svc-h">
    <div class="wrap">
      <div class="sec-head">${x("h2", "emp.svc.h", 'id="svc-h"')}</div>
      <ul class="svc">
        ${svc.map(([i, n]) => `<li data-reveal>${ic(i)}${x("h3", "emp.svc" + n)}${x("p", "emp.svc" + n + "p")}</li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <section class="sec frost" id="process" aria-labelledby="proc-h">
    <div class="wrap proc">
      <div>
        <div class="sec-head">${x("h2", "emp.proc.h", 'id="proc-h"')}${x("p", "emp.proc.p")}</div>
        ${board(true)}
      </div>
      <div data-reveal>${steps("home.how.e", false)}</div>
    </div>
  </section>

  <section class="sec on-dark" id="compliance" aria-labelledby="comp-h">
    <div class="wrap">
      <div class="sec-head">${x("h2", "emp.comp.h", 'id="comp-h"')}${x("p", "emp.comp.p")}</div>
      <dl class="comp">
        ${comp.map(([i, n]) => `<div><dt>${ic(i)}<span data-i18n="emp.comp${n}">${t("emp.comp" + n)}</span></dt>${x("dd", "emp.comp" + n + "p")}</div>`).join("\n        ")}
      </dl>
      ${x("p", "emp.comp.note", 'class="note"')}
    </div>
  </section>

  <section class="sec" id="request" aria-labelledby="wz-h">
    <div class="wrap wizard-wrap">
      <div class="sec-head">${x("h2", "wz.h", 'id="wz-h"')}${x("p", "wz.p")}
        <span class="demo-tag light">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="ap.demo">${t("ap.demo")}</span></span></div>
      <div class="wizard" id="wizard">
        <header>
          <ol class="progress light four" id="wzProgress" ${attr([["aria-label", "ap.progress"]])}>
            ${[1, 2, 3, 4].map((i) => `<li${i === 1 ? ' aria-current="step"' : ""} data-i18n="wz.s${i}">${t("wz.s" + i)}</li>`).join("")}
          </ol>
          <div class="wz-status"><p class="step-meta" id="wzMeta" aria-live="polite">Step 1 of 4</p><span class="saved" id="wzSaved">${ic("check")}<span data-i18n="wz.saved">${t("wz.saved")}</span></span></div>
          <p class="restored" id="wzRestored" hidden><span data-i18n="wz.restored">${t("wz.restored")}</span><button class="text-btn" type="button" id="wzReset" data-i18n="wz.reset">${t("wz.reset")}</button></p>
        </header>
        <form class="flow" id="wzForm" novalidate>
          <div class="err-sum" id="wzErr" role="alert"></div>
          <div class="stepper-step" data-step="1">
            ${fld("company", "wz.company", "text", 'autocomplete="organization" required')}
            ${fld("nip", "wz.nip", "text", 'inputmode="numeric"', true)}
            <div class="grid-2">${fld("contact", "wz.contact", "text", 'autocomplete="name" required')}${fld("role", "wz.role", "text", `autocomplete="organization-title" ${attr([["placeholder", "wz.roleph"]])}`, true)}</div>
            <div class="grid-2">${fld("email", "wz.email", "email", 'autocomplete="email" required')}${fld("phone", "wz.phone", "tel", 'autocomplete="tel" inputmode="tel" required')}</div>
          </div>
          <div class="stepper-step" data-step="2" hidden>
            <fieldset class="field" data-field="roles" aria-describedby="we-roles"><legend class="lbl" data-i18n="wz.roles">${t("wz.roles")}</legend>
              <div class="roles-list">
                ${roles.map((r) => `<div class="role-row" data-role="${r}"><span id="rl-${r}" data-i18n="wz.r.${r}">${t("wz.r." + r)}</span><span class="counter"><button type="button" data-d="-1" disabled aria-label="-">−</button><output aria-labelledby="rl-${r}" aria-live="polite">0</output><button type="button" data-d="1" aria-label="+">+</button></span></div>`).join("\n                ")}
              </div>
              <p class="err" id="we-roles"></p>
            </fieldset>
            <p class="total" id="wzTotal" aria-live="polite">Total: 0 people</p>
          </div>
          <div class="stepper-step" data-step="3" hidden>
            <div class="field" data-field="city"><label for="w-city" data-i18n="wz.city">${t("wz.city")}</label>
              <select class="select" id="w-city" name="city" aria-describedby="we-city"><option value="" data-i18n="wz.city.pick">${t("wz.city.pick")}</option>${["lodz", "poznan", "kutno", "wrzesnia", "konin", "lowicz"].map((c) => `<option value="${c}" data-city="${c}">${CN(c)}</option>`).join("")}<option value="other" data-i18n="wz.city.other">${t("wz.city.other")}</option></select><p class="err" id="we-city"></p></div>
            <fieldset class="field" data-field="shifts" aria-describedby="we-shifts"><legend class="lbl" data-i18n="wz.shifts">${t("wz.shifts")}</legend>
              <div class="seg grid2">${["morning", "afternoon", "night", "long"].map((s) => `<label><input type="checkbox" name="shifts" value="${s}"><span data-i18n="shift.${s}">${t("shift." + s)}</span></label>`).join("")}</div><p class="err" id="we-shifts"></p></fieldset>
            <div class="grid-2">
              ${fld("start", "wz.start", "date", "required")}
              <div class="field" data-field="dur"><label for="w-dur" data-i18n="wz.dur">${t("wz.dur")}</label><select class="select" id="w-dur" name="dur" aria-describedby="we-dur"><option value=""></option>${[1, 2, 3, 4].map((i) => `<option value="d${i}" data-i18n="wz.d${i}">${t("wz.d" + i)}</option>`).join("")}</select><p class="err" id="we-dur"></p></div>
            </div>
            <label class="switch" style="border-top:1px solid var(--line);border-bottom:1px solid var(--line)"><span data-i18n="wz.house">${t("wz.house")}</span><input type="checkbox" name="house" value="1"></label>
          </div>
          <div class="stepper-step" data-step="4" hidden>
            <div class="field"><label for="w-notes"><span data-i18n="wz.notes">${t("wz.notes")}</span> <span class="opt">(<span data-i18n="wz.opt">${t("wz.opt")}</span>)</span></label><textarea class="textarea" id="w-notes" name="notes" rows="5" ${attr([["placeholder", "wz.notesph"]])}></textarea></div>
            <fieldset class="field"><legend class="lbl" data-i18n="wz.reply">${t("wz.reply")}</legend>
              <div class="seg grid2"><label><input type="radio" name="reply" value="phone" checked><span data-i18n="wz.reply.phone">${t("wz.reply.phone")}</span></label><label><input type="radio" name="reply" value="email"><span data-i18n="wz.reply.email">${t("wz.reply.email")}</span></label></div></fieldset>
          </div>
          <div class="stepper-step" data-step="5" hidden>${x("h3", "wz.sum.h", 'style="font-size:1.8rem"')}<div class="review" id="wzReview"></div></div>
          <div class="flow-nav">
            <button class="btn btn-quiet" type="button" id="wzBack" hidden data-i18n="wz.back">${t("wz.back")}</button>
            <button class="btn btn-orange" type="submit" id="wzNext" data-i18n="wz.next">${t("wz.next")}</button>
          </div>
        </form>
        <div class="success" id="wzOk" hidden tabindex="-1">
          <div class="tick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3"/></svg></div>
          ${x("h3", "wz.ok.h")}
          <p id="wzOkText"></p>
          <span class="demo-tag light">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="wz.ok.demo">${t("wz.ok.demo")}</span></span>
          <button class="btn btn-ink" type="button" id="wzNew" data-i18n="wz.ok.new">${t("wz.ok.new")}</button>
        </div>
      </div>
    </div>
  </section>`;
  return shell({ page: "employers", file: "employers.html", title: "meta.employers.t", desc: "meta.employers.d", body });
}

function housingPage() {
  const body = `
  <section class="page-head" aria-labelledby="hs-h">
    <div class="wrap head-split">
      <div>
        <ol class="crumbs" ${attr([["aria-label", "job.crumb"]])}><li><a href="index.html" data-i18n="nav.home">${t("nav.home")}</a></li><li aria-current="page" data-i18n="nav.housing">${t("nav.housing")}</li></ol>
        ${x("h1", "hs.h", 'id="hs-h"')}
        ${x("p", "hs.lead", 'class="lead"')}
        <div class="hs-stats">
          <div><b data-count="400">400</b>${x("span", "hs.stat1")}</div>
          <div><b data-count="25">25</b>${x("span", "hs.stat2")}</div>
          <div><b data-count="3">3</b>${x("span", "hs.stat3")}</div>
        </div>
      </div>
      <div class="iso-wrap" data-iso="3" data-iso-warm="1" data-iso-label="hs.aria"></div>
    </div>
  </section>

  <section class="sec" aria-labelledby="list-h">
    <div class="wrap">
      <div class="sec-head-row">
        <div class="sec-head">${x("h2", "hs.list.h", 'id="list-h"')}<p id="hsCount" aria-live="polite"></p></div>
      </div>
      <div class="city-tabs" id="cityTabs" role="group" ${attr([["aria-label", "hs.filter"]])}></div>
      <div class="house-grid" id="houseGrid"></div>
    </div>
  </section>

  <section class="sec navy on-dark" aria-labelledby="inc-h">
    <div class="wrap two-lists">
      <div>${x("h2", "hs.inc.h", 'id="inc-h"')}
        <ul class="checks">${[1, 2, 3, 4, 5, 6].map((i) => `<li>${ic("check")}${x("span", "hs.inc" + i)}</li>`).join("")}</ul></div>
      <div>${x("h2", "hs.rules.h")}
        <ul class="rules">${[["moon", 1], ["x", 2], ["users", 3], ["house", 4], ["season", 5], ["reg", 6]].map(([i, n]) => `<li>${ic(i)}${x("span", "hs.rule" + n)}</li>`).join("")}</ul></div>
    </div>
  </section>

  <section class="sec" aria-labelledby="map-h">
    <div class="wrap map-wrap">
      <div>
        <div class="sec-head" style="margin-bottom:0">${x("h2", "hs.map.h", 'id="map-h"')}${x("p", "hs.map.p")}</div>
        <div class="legend"><span><i></i><span data-i18n="hs.map.house">${t("hs.map.house")}</span></span><span><i class="o"></i><span data-i18n="hs.map.office">${t("hs.map.office")}</span></span><span><i class="r"></i><span data-i18n="hs.map.route">${t("hs.map.route")}</span></span></div>
        <div class="map-list" id="mapList"></div>
      </div>
      <div class="dmap">
        <svg viewBox="0 0 460 300" role="img" ${attr([["aria-label", "hs.map.aria"]])}>
          <g>
            <path class="d" data-d="Bałuty" d="M60 18H300V118L200 130L60 108Z"/>
            <path class="d" data-d="Widzew" d="M300 18L444 38V232H300V200V118Z"/>
            <path class="d" data-d="Śródmieście" d="M200 130L300 118V200L210 206Z"/>
            <path class="d" data-d="Polesie" d="M16 108H60L200 130L210 206L140 258L16 240Z"/>
            <path class="d" data-d="Górna" d="M140 258L210 206L300 200V232H444L424 292H120Z"/>
          </g>
          <path class="river" d="M8 150C70 140 110 175 170 168S250 120 300 132 400 120 452 96"/>
          <text class="dl" x="120" y="52">Bałuty</text><text class="dl" x="360" y="80">Widzew</text>
          <text class="dl" x="212" y="160" font-size="13">Śródmieście</text><text class="dl" x="40" y="200">Polesie</text><text class="dl" x="250" y="270">Górna</text>
          <path class="rt" d="M372 140C400 160 420 196 452 206"/>
          <path class="rt" d="M150 70C110 58 60 40 8 34"/>
          <g class="op"><rect x="238" y="172" width="22" height="22" rx="3"/><text x="249" y="188" text-anchor="middle" font-family="Fira Sans Extra Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="14" fill="#ff6b1a">M</text></g>
          <g id="pins"></g>
        </svg>
      </div>
    </div>
  </section>

  <section class="final" aria-labelledby="hcta-h">
    <div class="wrap">
      ${x("h2", "hs.cta.h", 'id="hcta-h"')}
      <div class="ctas"><a class="btn btn-ink" href="jobs.html?housing=1" data-i18n="hs.cta">${t("hs.cta")}</a></div>
    </div>
  </section>`;
  return shell({ page: "housing", file: "housing.html", title: "meta.housing.t", desc: "meta.housing.d", body });
}

function contactPage() {
  const W = [1, 2, 3, 4, 5], E = [1, 2, 3, 4];
  const faq = (p, list) => list.map((i) => `<details><summary data-i18n="faq.${p}${i}">${t(`faq.${p}${i}`)}</summary>${x("p", `faq.${p}${i}a`)}</details>`).join("\n          ");
  const fld = (id, key, input) => `<div class="field" data-field="${id}"><label for="c-${id}" data-i18n="${key}">${t(key)}</label>${input}<p class="err" id="ce-${id}"></p></div>`;
  const body = `
  <section class="page-head" aria-labelledby="ct-h">
    <div class="wrap">
      <ol class="crumbs" ${attr([["aria-label", "job.crumb"]])}><li><a href="index.html" data-i18n="nav.home">${t("nav.home")}</a></li><li aria-current="page" data-i18n="nav.contact">${t("nav.contact")}</li></ol>
      ${x("h1", "ct.h", 'id="ct-h"')}
      ${x("p", "ct.lead", 'class="lead"')}
    </div>
  </section>

  <section class="sec frost" id="offices" aria-labelledby="off-h">
    <div class="wrap">
      <div class="sec-head">${x("h2", "ct.off.h", 'id="off-h"')}</div>
      <div class="offices" id="officeList"></div>
    </div>
  </section>

  <section class="sec" aria-label="Contact form and FAQ">
    <div class="wrap contact-grid">
      <div class="form-card" id="write">
        <header>${x("h2", "ct.form.h")}${x("p", "ct.form.p")}
          <span class="demo-tag">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="ap.demo">${t("ap.demo")}</span></span></header>
        <form class="flow" id="contactForm" novalidate>
          <div class="err-sum" id="ctErr" role="alert"></div>
          <div class="field"><label for="c-topic" data-i18n="ct.topic">${t("ct.topic")}</label><select class="select" id="c-topic" name="topic">${["job", "workers", "housing", "other"].map((k) => `<option value="${k}" data-i18n="ct.t.${k}">${t("ct.t." + k)}</option>`).join("")}</select></div>
          <div class="grid-2">
            ${fld("name", "ct.name", '<input class="input" id="c-name" name="name" autocomplete="name" required aria-describedby="ce-name">')}
            ${fld("contact", "ct.contact", '<input class="input" id="c-contact" name="contact" autocomplete="email" required aria-describedby="ce-contact">')}
          </div>
          ${fld("msg", "ct.msg", '<textarea class="textarea" id="c-msg" name="msg" rows="5" required aria-describedby="ce-msg"></textarea>')}
          <div class="field" data-field="consent"><label class="check"><input type="checkbox" name="consent" required aria-describedby="ce-consent"><span data-i18n="ct.consent">${t("ct.consent")}</span></label><p class="err" id="ce-consent"></p></div>
          <button class="btn btn-orange btn-block" type="submit" data-i18n="ct.send">${t("ct.send")}</button>
        </form>
        <div class="success" id="ctOk" hidden tabindex="-1">
          <div class="tick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3"/></svg></div>
          ${x("h3", "ct.ok.h")}${x("p", "ct.ok.p")}
          <span class="demo-tag light">${ic("info").replace("<svg", '<svg width="14" height="14"')}<span data-i18n="ct.ok.demo">${t("ct.ok.demo")}</span></span>
          <button class="btn btn-ink" type="button" id="ctAgain" data-i18n="ct.ok.again">${t("ct.ok.again")}</button>
        </div>
      </div>
      <div class="faq" id="faq">
        ${x("h2", "faq.h", 'style="font-size:clamp(2.3rem,7vw,3.4rem);margin-bottom:24px"')}
        <div class="faq-group">${x("h3", "faq.w")}
          ${faq("w", W)}
        </div>
        <div class="faq-group">${x("h3", "faq.e")}
          ${faq("e", E)}
        </div>
      </div>
    </div>
  </section>`;
  return shell({ page: "contact", file: "contact.html", title: "meta.contact.t", desc: "meta.contact.d", body });
}

function notFound() {
  const bar = Array.from({ length: 24 }, (_, h) => `<i${[6, 7, 8, 10, 13, 14, 15, 16].includes(h) ? ' class="on"' : ""}></i>`).join("");
  const body = `
  <section class="sec nf">
    <div class="wrap">
      <p class="big" aria-hidden="true">404</p>
      <div class="shiftbar broken" aria-hidden="true">${bar}</div>
      ${x("h1", "nf.h")}
      ${x("p", "nf.p")}
      <div class="ctas"><a class="btn btn-orange" href="jobs.html" data-i18n="nf.jobs">${t("nf.jobs")}</a><a class="btn btn-quiet" href="index.html" data-i18n="nf.home">${t("nf.home")}</a></div>
    </div>
  </section>`;
  // GitHub Pages serves 404.html at any missing path, so a base URL is set before other links resolve.
  return shell({ page: "404", file: "404.html", title: "meta.404.t", desc: "meta.home.d", body })
    .replace("<meta charset=\"utf-8\">", "<meta charset=\"utf-8\">\n<script>(function(){var p=location.pathname,i=p.indexOf(\"/mostova-concept/\"),b=document.createElement(\"base\");b.href=i>=0?p.slice(0,i)+\"/mostova-concept/\":\"/\";document.head.appendChild(b)})()</script>");
}

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#06111f"/><path d="M10 44 Q32 8 54 44" fill="none" stroke="#ff6b1a" stroke-width="6" stroke-linecap="round"/><path d="M8 46h48M21 46v-12M32 46v-17M43 46v-12" stroke="#ff6b1a" stroke-width="4" stroke-linecap="round"/><path d="M10 54h44" stroke="#9fd8f0" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 5"/></svg>
`;

const out = { "index.html": home(), "jobs.html": jobsPage(), "job.html": jobPage(), "employers.html": employersPage(), "housing.html": housingPage(), "contact.html": contactPage(), "404.html": notFound() };
for (const [f, html] of Object.entries(out)) fs.writeFileSync(path.join(ROOT, f), html);
fs.writeFileSync(path.join(ROOT, "assets/favicon.svg"), FAVICON);
console.log("Built", Object.keys(out).join(", "));
