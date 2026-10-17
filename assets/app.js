/* Mostova concept B "Cold Chain" — interactions. Vanilla JS, no dependencies. */
(() => {
  "use strict";
  const D = window.MOSTOVA, I = window.MOSTOVA_I18N;
  if (!D || !I) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage blocked */ } }
  };
  let lang = store.get("mostova.lang") === "uk" ? "uk" : "en";
  const renders = [];
  const page = document.body.dataset.page;

  /* ---------- i18n ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function plural(n, f) {
    if (lang === "uk" && f.length === 3) {
      const a = n % 10, b = n % 100;
      return f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2];
    }
    return f[n === 1 ? 0 : f.length - 1];
  }
  function t(k, v = {}) {
    let s = (I[lang] && I[lang][k]) ?? I.en[k] ?? k;
    if (s.includes("|")) s = plural(v.n ?? 0, s.split("|"));
    return s.replace(/\{(\w+)\}/g, (m, p) => (p in v ? v[p] : m));
  }
  const L = (o) => (o && (o[lang] || o.en)) || "";
  const cityName = (c) => L(D.cities[c]);
  const sectorName = (s) => L(D.sectors[s]);

  function applyStatic(root = document) {
    document.documentElement.lang = lang === "uk" ? "uk" : "en";
    $$("[data-i18n]", root).forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-attr]", root).forEach((el) => {
      el.dataset.i18nAttr.split(",").forEach((p) => { const [a, k] = p.split(":"); el.setAttribute(a, t(k)); });
    });
    $$("[data-city]", root).forEach((el) => { el.textContent = cityName(el.dataset.city); });
    $$("[data-sector-name]", root).forEach((el) => { el.textContent = sectorName(el.dataset.sectorName); });
    $$("[data-err]", root).forEach((el) => { el.textContent = t(el.dataset.err); });
    const b = document.body.dataset;
    if (b.title) document.title = t(b.title);
    if (b.desc) $('meta[name="description"]').setAttribute("content", t(b.desc));
    $$(".lang [data-lang]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.lang === lang)));
  }
  function setLang(l) {
    lang = l;
    store.set("mostova.lang", l);
    applyStatic();
    renders.forEach((f) => f());
  }

  /* ---------- Formatting ---------- */
  const today = (() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); })();
  const sign = (v) => (v > 0 ? "+" + v : v < 0 ? "−" + Math.abs(v) : "0");
  const hh = (h) => String(h % 24).padStart(2, "0") + ":00";
  const shiftTxt = (j) => hh(j.shift[0]) + "–" + hh(j.shift[1]);
  const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString(lang === "uk" ? "uk-UA" : "en-GB", { day: "numeric", month: "long" });
  const clim = (v) => (v <= -5 ? "freeze" : v < 15 ? "chill" : "warm");
  const daysAgo = (iso) => (Date.parse(D.today) - Date.parse(iso)) / 864e5;
  const ICON = {
    snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 3 3-3M9 20l3-3 3 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" fill="none" stroke="currentColor" stroke-width="2.2"/>',
    sun: '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" stroke-width="2"/>',
    check: '<path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3"/>',
    dash: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 12h8" stroke="currentColor" stroke-width="2.4"/>',
    x: '<path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2.6"/>',
    house: '<path d="M3 11l9-7 9 7v10H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/>',
    kitchen: '<path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M16 3c-2 1-3 4-3 7h3v11" fill="none" stroke="currentColor" stroke-width="2"/>',
    laundry: '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 6.5h2" stroke="currentColor" stroke-width="2"/>',
    wifi: '<path d="M2 9a15 15 0 0120 0M5.5 12.5a10 10 0 0113 0M9 16a5 5 0 016 0" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="19.5" r="1.5" fill="currentColor"/>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 11h16M7 21v-3M17 21v-3" stroke="currentColor" stroke-width="2"/>',
    tram: '<rect x="5" y="5" width="14" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 2h6M12 2v3M8 21l2-3M16 21l-2-3M5 12h14" stroke="currentColor" stroke-width="2"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 17V7h4a3 3 0 010 6H9" fill="none" stroke="currentColor" stroke-width="2"/>',
    balcony: '<path d="M3 12h18M5 12v8M9 12v8M15 12v8M19 12v8M3 20h18M7 12V4h10v8" fill="none" stroke="currentColor" stroke-width="2"/>',
    garden: '<path d="M12 21v-8M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 13c4 0 6-3 6-7-4 0-6 3-6 7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  };
  ICON.washer = ICON.laundry;
  const svg = (n, sz) => `<svg viewBox="0 0 24 24" aria-hidden="true"${sz ? ` width="${sz}" height="${sz}"` : ""}>${ICON[n]}</svg>`;
  const tchip = (v) => `<span class="tchip t-${clim(v)}" role="img" aria-label="${esc(t("temp.aria", { t: sign(v) + " °C" }))}">${svg(v <= 0 ? "snow" : v < 15 ? "drop" : "sun")}<span aria-hidden="true">${sign(v)} °C</span></span>`;
  const bar = ([a, b]) => Array.from({ length: 24 }, (_, h) => `<i${(a < b ? h >= a && h < b : h >= a || h < b) ? ' class="on"' : ""}></i>`).join("");
  const payTxt = (j) => j.pay[0] + "–" + j.pay[1];

  function jobCard(j) {
    const tx = L(j);
    const chips = [
      j.urgent ? `<span class="chip chip-urgent">${t("chip.urgent")}</span>` : daysAgo(j.posted) <= 3 ? `<span class="chip chip-new">${t("chip.new")}</span>` : "",
      j.rent ? `<span class="chip chip-house">${svg("house")}${t("chip.housing")}</span>` : "",
      j.noExp ? `<span class="chip chip-exp">${t("chip.noexp")}</span>` : ""
    ].join("");
    return `<article class="job${j.urgent ? " is-urgent" : ""}">
      <div class="job-top"><div class="chips">${chips}</div>${tchip(j.temp)}</div>
      <h3><a href="job.html?id=${j.id}">${esc(tx.title)}</a></h3>
      <p class="where">${esc(cityName(j.city))}, ${esc(sectorName(j.sector))}</p>
      <div class="shiftbar" aria-hidden="true">${bar(j.shift)}</div>
      <p class="shift-label"><span>${t("card.shift", { h: shiftTxt(j) })}</span><span>${t("days." + j.days)}</span></p>
      <p class="pay"><b>${payTxt(j)}</b><span>${t("u.plnh")}</span></p>
    </article>`;
  }
  const openJobs = () => D.jobs.filter((j) => !j.closed);

  /* ---------- Generated art ---------- */
  let artId = 0;
  function isoRoom(beds, warm, labelKey) {
    const id = "i" + ++artId, s = 16, cx = 200, cy = 140;
    const p = (x, y, z) => [cx + (x - y) * s * 0.866, cy + (x + y) * s * 0.5 - z * s];
    const pts = (a) => a.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
    const poly = (c, a) => `<polygon class="${c}" points="${pts(a)}"/>`;
    const box = (x, y, z, w, d, h, [tp, sx, sy]) =>
      poly(tp, [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)]) +
      poly(sx, [p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)]) +
      poly(sy, [p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)]);
    const wood = ["wood-top", "wood-x", "wood-y"], white = ["top", "sx", "sy"], blk = ["blanket-top", "blanket-x", "blanket-y"];
    let out = poly("floor", [p(0, 0, 0), p(12, 0, 0), p(12, 12, 0), p(0, 12, 0)]);
    out += poly("wall-r", [p(0, 0, 0), p(12, 0, 0), p(12, 0, 8), p(0, 0, 8)]);
    out += poly("wall-l", [p(0, 0, 0), p(0, 12, 0), p(0, 12, 8), p(0, 0, 8)]);
    out += poly("win", [p(4, 0, 3), p(8.5, 0, 3), p(8.5, 0, 6.6), p(4, 0, 6.6)]);
    out += `<polyline class="frame" points="${pts([p(6.25, 0, 3), p(6.25, 0, 6.6)])}"/><polyline class="frame" points="${pts([p(4, 0, 4.8), p(8.5, 0, 4.8)])}"/>`;
    out += poly("rug", [p(6.6, 3.5, 0), p(10.6, 3.5, 0), p(10.6, 8.5, 0), p(6.6, 8.5, 0)]);
    out += `<ellipse class="glow" cx="${p(10.8, 1.2, 5.6)[0]}" cy="${p(10.8, 1.2, 5.6)[1]}" rx="70" ry="50"/>`;
    const ys = beds >= 3 ? [0.5, 4.4, 8.3] : [1, 7.6];
    const items = [];
    ys.slice(0, beds).forEach((y) => {
      items.push([y, box(0.3, y, 0, 6, 3, 1.1, wood) + box(0.3, y, 1.1, 6, 3, 0.5, white) + box(2.4, y - 0.05, 1.6, 3.95, 3.1, 0.3, blk) + box(0.6, y + 0.4, 1.6, 1.4, 2.2, 0.45, white) + box(0.3, y, 0, 0.4, 3, 2.6, wood)]);
    });
    items.push([0.3 + 10, box(10, 0.3, 0, 1.7, 1.8, 5, wood) + box(10.4, 0.7, 5, 0.7, 0.7, 0.9, ["lamp", "lamp", "lamp"])]);
    items.sort((a, b) => a[0] - b[0]).forEach((i) => { out += i[1]; });
    return `<svg class="iso${warm ? " warm" : ""}" viewBox="20 6 360 340" role="img" aria-label="${esc(t(labelKey || "hs.aria"))}"${labelKey ? ` data-i18n-attr="aria-label:${labelKey}"` : ""}>
      <defs><linearGradient id="isoSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#def3fc"/><stop offset="1" stop-color="#7cc4e4"/></linearGradient>
      <radialGradient id="isoGlow"><stop offset="0" stop-color="#ff8440" stop-opacity=".35"/><stop offset="1" stop-color="#ff8440" stop-opacity="0"/></radialGradient></defs>${out}</svg>`.replace(/isoSky|isoGlow/g, (m) => m + id);
  }
  function miniMap(seed, labelCity) {
    let r = seed * 9301 + 49297;
    const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    const blocks = [];
    for (let x = 0; x < 400; x += 46) for (let y = 0; y < 160; y += 38) if (rnd() > 0.18) blocks.push(`<rect class="${rnd() > 0.88 ? "park" : "block"}" x="${x + 4}" y="${y + 4}" width="38" height="30" rx="3"/>`);
    const ry = 30 + rnd() * 90, px = 200 + rnd() * 120, py = 60 + rnd() * 50;
    return `<svg class="map-art" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(t("off.map", { c: labelCity }))}">
      <rect width="400" height="160" fill="#eef3f7"/>${blocks.join("")}
      <path class="water" d="M0 ${ry}C120 ${ry - 30} 220 ${ry + 40} 400 ${ry + 6}V${ry + 20}C220 ${ry + 56} 120 ${ry - 12} 0 ${ry + 16}Z"/>
      <path class="road" d="M0 ${py + 18}H400M${px - 40} 0V160" stroke-width="8"/>
      <path class="road2" d="M0 20L400 120M90 160L170 0" stroke-width="4"/>
      <path class="route" d="M20 150C80 140 ${px - 90} ${py + 60} ${px} ${py + 8}"/>
      <path class="pin" d="M${px} ${py + 8}c-9-12-14-19-14-26a14 14 0 0128 0c0 7-5 14-14 26z"/><circle cx="${px}" cy="${py - 18}" r="5" fill="#06111f"/></svg>`;
  }
  function officeCard(o, i) {
    const c = cityName(o.city);
    return `<article class="office"${o.id ? ` id="office-${o.id}"` : ""}>
      <div class="map">${miniMap(i + 3, c)}</div>
      <div class="body">
        <p class="kind">${t("off." + o.kind)}</p>
        <h3>${esc(c)}</h3>
        <p class="addr">${esc(o.street)}, ${o.zip} ${esc(D.cities[o.city].en)}</p>
        <dl>
          ${o.hours.map(([d, v]) => `<dt>${t("days." + d)}</dt><dd>${v === "closed" ? t("days.closed") : v}</dd>`).join("")}
          <dt>${t("off.phone")}</dt><dd><a href="tel:${o.phone.replace(/\s/g, "")}">${o.phone}</a></dd>
          <dt>${t("off.email")}</dt><dd><a href="mailto:${o.email}">${o.email}</a></dd>
          <dt>${t("off.langs")}</dt><dd>${o.langs.map((l) => t("lang." + l)).join(", ")}</dd>
        </dl>
      </div>
    </article>`;
  }
  function renderOffices() {
    const el = $("#officeList");
    if (el) el.innerHTML = D.offices.map(officeCard).join("");
  }
  $$("[data-iso]").forEach((el) => {
    const f = () => { el.innerHTML = isoRoom(+el.dataset.iso, !!el.dataset.isoWarm, el.dataset.isoLabel); };
    f(); renders.push(f);
  });

  /* ---------- Header ---------- */
  const menuBtn = $(".menu-btn"), mnav = $("#mobile-nav");
  menuBtn?.addEventListener("click", () => {
    const open = mnav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mnav?.classList.contains("open")) { mnav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); }
  });
  $$(".lang button").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.lang) { if (b.dataset.lang !== lang) setLang(b.dataset.lang); return; }
    b.classList.add("tip");
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove("tip"), 1800);
  }));

  /* ---------- Motion: reveal, count-up, fills ---------- */
  function countUp(el) {
    const target = Number(el.dataset.count);
    if (reduce || !target) { el.textContent = target; return; }
    const start = performance.now(), dur = 1300;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  }
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;
  function observe(root = document) {
    $$("[data-reveal], .board, .sector, .shift-day, .hs-stats", root).forEach((el) => { io ? io.observe(el) : el.classList.add("in"); });
  }

  /* ---------- Home ---------- */
  if (page === "home") {
    const f = () => {
      const open = openJobs();
      $("#heroJobs").textContent = t("home.work.cta", { n: open.length });
      $("#urgentJobs").innerHTML = open.filter((j) => j.urgent).sort((a, b) => b.posted.localeCompare(a.posted)).slice(0, 4).map(jobCard).join("");
      $$("[data-sector-count]").forEach((el) => { el.textContent = t("u.jobs", { n: open.filter((j) => j.sector === el.dataset.sectorCount).length }); });
      renderOffices();
    };
    f(); renders.push(f);
  }
  if (page === "contact") { renderOffices(); renders.push(renderOffices); }

  /* ---------- Jobs list ---------- */
  if (page === "jobs") {
    const MULTI = ["city", "sector", "shift", "contract"];
    const PER = 8;
    const form = $("#filterForm"), panel = $("#filters"), scrim = $(".scrim"), openBtn = $(".filter-open");
    const st = { q: "", city: [], sector: [], shift: [], contract: [], housing: false, noexp: false, lang: "", sort: "new", page: 1 };
    const valid = {
      city: Object.keys(D.cities), sector: Object.keys(D.sectors), shift: ["morning", "afternoon", "night", "long"],
      contract: ["temp", "emp", "mandate"], lang: ["uk", "pl", "ru", "en"]
    };
    const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
    function readURL() {
      const u = new URLSearchParams(location.search);
      MULTI.forEach((k) => { st[k] = (u.get(k) || "").split(",").filter((v) => valid[k].includes(v)); });
      st.q = (u.get("q") || "").slice(0, 60);
      st.housing = u.get("housing") === "1";
      st.noexp = u.get("noexp") === "1";
      st.lang = valid.lang.includes(u.get("lang")) ? u.get("lang") : "";
      st.sort = u.get("sort") === "pay" ? "pay" : "new";
      st.page = Math.max(1, parseInt(u.get("page"), 10) || 1);
    }
    function writeURL() {
      const u = new URLSearchParams();
      if (st.q) u.set("q", st.q);
      MULTI.forEach((k) => st[k].length && u.set(k, st[k].join(",")));
      if (st.housing) u.set("housing", "1");
      if (st.noexp) u.set("noexp", "1");
      if (st.lang) u.set("lang", st.lang);
      if (st.sort !== "new") u.set("sort", st.sort);
      if (st.page > 1) u.set("page", st.page);
      const qs = u.toString().replace(/%2C/g, ",");
      history.replaceState(null, "", qs ? "?" + qs : location.pathname);
    }
    function syncForm() {
      $$("input[type=checkbox]", form).forEach((i) => {
        i.checked = MULTI.includes(i.name) ? st[i.name].includes(i.value) : !!st[i.name];
      });
      form.lang.value = st.lang;
      $("#sort").value = st.sort;
      $("#q").value = st.q;
    }
    function readForm() {
      MULTI.forEach((k) => { st[k] = $$(`input[name=${k}]:checked`, form).map((i) => i.value); });
      st.housing = form.housing.checked;
      st.noexp = form.noexp.checked;
      st.lang = form.lang.value;
    }
    function filtered() {
      const q = norm(st.q.trim());
      const list = openJobs().filter((j) =>
        (!st.city.length || st.city.includes(j.city)) &&
        (!st.sector.length || st.sector.includes(j.sector)) &&
        (!st.shift.length || st.shift.includes(j.type)) &&
        (!st.contract.length || st.contract.includes(j.contract)) &&
        (!st.housing || j.rent) && (!st.noexp || j.noExp) &&
        (!st.lang || j.langs.includes(st.lang)) &&
        (!q || norm([j.en.title, j.uk.title, D.cities[j.city].en, D.cities[j.city].uk, D.sectors[j.sector].en, D.sectors[j.sector].uk, j.district].join(" ")).includes(q)));
      return list.sort(st.sort === "pay" ? (a, b) => b.pay[1] - a.pay[1] || b.pay[0] - a.pay[0] : (a, b) => b.posted.localeCompare(a.posted));
    }
    function active() {
      const a = [];
      if (st.q) a.push(["q", st.q, t("jobs.q.chip", { x: st.q })]);
      st.city.forEach((v) => a.push(["city", v, cityName(v)]));
      st.sector.forEach((v) => a.push(["sector", v, sectorName(v)]));
      st.shift.forEach((v) => a.push(["shift", v, t("shift." + v)]));
      st.contract.forEach((v) => a.push(["contract", v, t("contract." + v + ".s")]));
      if (st.housing) a.push(["housing", 1, t("jobs.f.housing")]);
      if (st.noexp) a.push(["noexp", 1, t("jobs.f.noexp")]);
      if (st.lang) a.push(["lang", st.lang, t("jobs.f.lang") + ": " + t("lang." + st.lang)]);
      return a;
    }
    function remove(k, v) {
      if (MULTI.includes(k)) st[k] = st[k].filter((x) => x !== v);
      else if (k === "q" || k === "lang") st[k] = "";
      else st[k] = false;
      st.page = 1;
      syncForm(); update();
    }
    function clearAll() {
      MULTI.forEach((k) => { st[k] = []; });
      Object.assign(st, { q: "", housing: false, noexp: false, lang: "", page: 1 });
      syncForm(); update();
    }
    function render(scroll) {
      const list = filtered(), n = list.length, pages = Math.max(1, Math.ceil(n / PER));
      st.page = Math.min(st.page, pages);
      const act = active();
      $("#count").textContent = t("jobs.count", { n });
      $("#showBtn").textContent = t("jobs.f.show", { n });
      const fb = $("#fBadge"), filterCount = act.filter((a) => a[0] !== "q").length;
      fb.hidden = !filterCount; fb.textContent = filterCount;
      $("#activeFilters").innerHTML = act.map(([k, v, label]) =>
        `<button class="fchip" type="button" data-k="${k}" data-v="${esc(v)}" aria-label="${esc(t("jobs.remove", { x: label }))}">${esc(label)}${svg("x")}</button>`).join("") +
        (act.length > 1 ? `<button class="fchip clear" type="button" data-clear>${t("jobs.f.clear")}</button>` : "");
      const res = $("#results");
      res.innerHTML = list.slice((st.page - 1) * PER, st.page * PER).map(jobCard).join("");
      res.hidden = !n;
      $("#empty").hidden = !!n;
      $("#sugg").innerHTML = act.map(([k, v, label]) => `<button class="fchip" type="button" data-k="${k}" data-v="${esc(v)}">${esc(t("jobs.empty.rm", { x: label }))}${svg("x")}</button>`).join("") +
        (act.length > 1 ? `<button class="fchip clear" type="button" data-clear>${t("jobs.f.clear")}</button>` : "");
      const pg = $("#pager");
      pg.hidden = pages < 2;
      pg.innerHTML = pages < 2 ? "" :
        `<button type="button" data-p="${st.page - 1}"${st.page === 1 ? " disabled" : ""}>${t("jobs.prev")}</button>` +
        Array.from({ length: pages }, (_, i) => `<button type="button" data-p="${i + 1}" aria-label="${t("jobs.page", { n: i + 1 })}"${i + 1 === st.page ? ' aria-current="page"' : ""}>${i + 1}</button>`).join("") +
        `<button type="button" data-p="${st.page + 1}"${st.page === pages ? " disabled" : ""}>${t("jobs.next")}</button>`;
      if (scroll) {
        const top = $(".results-col").getBoundingClientRect().top + scrollY - 90;
        scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
        $("#count").setAttribute("tabindex", "-1"); $("#count").focus({ preventScroll: true });
      }
    }
    function update(scroll) {
      writeURL();
      const res = $("#results");
      if (!reduce) { res.classList.add("fade"); requestAnimationFrame(() => requestAnimationFrame(() => res.classList.remove("fade"))); }
      render(scroll);
    }
    form.addEventListener("change", () => { readForm(); st.page = 1; update(); });
    form.addEventListener("submit", (e) => e.preventDefault());
    $("#sort").addEventListener("change", (e) => { st.sort = e.target.value; st.page = 1; update(); });
    $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); st.q = $("#q").value.trim(); st.page = 1; update(true); });
    let deb;
    $("#q").addEventListener("input", (e) => { clearTimeout(deb); deb = setTimeout(() => { st.q = e.target.value.trim(); st.page = 1; update(); }, 300); });
    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".fchip[data-k]");
      if (chip) { remove(chip.dataset.k, chip.dataset.v); return; }
      if (e.target.closest("[data-clear]")) { clearAll(); return; }
      const pb = e.target.closest("#pager button[data-p]");
      if (pb && !pb.disabled) { st.page = +pb.dataset.p; update(true); }
    });
    // bottom sheet on phones
    const mq = matchMedia("(max-width: 999px)");
    function setSheet(open) {
      panel.classList.toggle("open", open);
      scrim.classList.toggle("open", open);
      openBtn.setAttribute("aria-expanded", String(open));
      if (open && mq.matches) { panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); }
      else { panel.removeAttribute("role"); panel.removeAttribute("aria-modal"); }
      document.body.style.overflow = open && mq.matches ? "hidden" : "";
      if (open) setTimeout(() => panel.querySelector("input, button")?.focus(), 60);
      else if (mq.matches) openBtn.focus();
    }
    openBtn.addEventListener("click", () => setSheet(true));
    $$("[data-close-sheet]").forEach((b) => b.addEventListener("click", () => setSheet(false)));
    panel.addEventListener("keydown", (e) => {
      if (!panel.classList.contains("open")) return;
      if (e.key === "Escape") setSheet(false);
      if (e.key === "Tab") {
        const f = $$("button, input, select", panel).filter((x) => x.offsetParent);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    mq.addEventListener?.("change", () => setSheet(false));
    readURL(); syncForm(); render();
    renders.push(() => render());
  }

  /* ---------- Shared form helpers ---------- */
  function setErr(form, name, key, prefix) {
    const f = form.querySelector(`[data-field="${name}"]`);
    const p = $("#" + prefix + name);
    if (p) { if (key) { p.dataset.err = key; p.textContent = t(key); } else { delete p.dataset.err; p.textContent = ""; } }
    if (f) $$("input:not([type=radio]):not([type=checkbox]), select, textarea, .seg", f).forEach((i) => i.setAttribute("aria-invalid", String(!!key)));
  }
  function showErrors(form, errs, prefix, sumEl) {
    $$("[data-field]", form).forEach((f) => setErr(form, f.dataset.field, null, prefix));
    errs.forEach(([n, k]) => setErr(form, n, k, prefix));
    if (errs.length) {
      sumEl.dataset.n = errs.length;
      sumEl.textContent = t("ap.e.sum", { n: errs.length });
      const f = form.querySelector(`[data-field="${errs[0][0]}"]`);
      (f && (f.querySelector("input, select, textarea, button"))) ?.focus();
    } else { sumEl.textContent = ""; delete sumEl.dataset.n; }
    return !errs.length;
  }
  function clearOnEdit(form, prefix, sumEl) {
    form.addEventListener("input", (e) => {
      const f = e.target.closest("[data-field]");
      if (f && $("#" + prefix + f.dataset.field)?.textContent) {
        setErr(form, f.dataset.field, null, prefix);
        const left = $$(".err", form).filter((x) => x.textContent).length;
        sumEl.dataset.n = left;
        sumEl.textContent = left ? t("ap.e.sum", { n: left }) : "";
      }
    });
  }
  const phoneOk = (v) => (v.match(/\d/g) || []).length >= 9;
  const radio = (form, n) => form.querySelector(`input[name="${n}"]:checked`)?.value || "";
  function animateStep(el) { if (!reduce) { el.classList.remove("enter"); void el.offsetWidth; el.classList.add("enter"); } }
  function renderSum(sumEl) { if (sumEl.dataset.n) sumEl.textContent = t("ap.e.sum", { n: +sumEl.dataset.n }); }

  /* ---------- Job detail + application ---------- */
  if (page === "job") {
    const id = new URLSearchParams(location.search).get("id");
    const general = id === "general";
    const job = general ? null : D.jobs.find((j) => j.id === id) || D.jobs[0];
    const form = $("#applyForm"), sumEl = $("#apErr");
    let step = 1;

    function similar() {
      const base = job || { sector: "", city: "", id: "" };
      return openJobs().filter((j) => j.id !== base.id)
        .map((j) => [j, (j.sector === base.sector ? 2 : 0) + (j.city === base.city ? 1 : 0) + (j.urgent ? 0.5 : 0)])
        .sort((a, b) => b[1] - a[1] || b[0].posted.localeCompare(a[0].posted)).slice(0, 4).map((x) => x[0]);
    }
    const crumbs = (last) => `<ol class="crumbs" aria-label="${esc(t("job.crumb"))}"><li><a href="index.html">${t("nav.home")}</a></li><li><a href="jobs.html">${t("nav.jobs")}</a></li><li aria-current="page">${esc(last)}</li></ol>`;
    const item = (s, icon) => { const [a, b] = s.split("|"); return `<li>${svg(icon)}<div>${esc(a)}<small>${esc(b)}</small></div></li>`; };

    function renderJob() {
      const head = $("#jdHead"), main = $("#jdMain");
      if (!job) {
        head.className = "jd-head c-chill";
        head.innerHTML = `<div class="wrap">${crumbs(t("ap.hg"))}<h1 id="role-h">${t("ap.hg")}</h1><p class="where">${t("ap.p")}</p></div><div class="wrap"><div class="shift-day"></div></div>`;
        main.innerHTML = `<section id="similar" aria-labelledby="sim-h"><h2 id="sim-h">${t("home.urg.h")}</h2><div class="jobs-grid">${similar().map(jobCard).join("")}</div></section>`;
        document.title = t("ap.hg") + " — Mostova Staffing";
        $("#apply-h").textContent = t("ap.hg");
        $("#barPay").textContent = t("ap.hg");
        $("#barMeta").textContent = t("ap.p");
        return;
      }
      const tx = L(job), sec = D.sectors[job.sector];
      const house = D.housing.find((h) => h.city === job.city);
      head.className = "jd-head c-" + clim(job.temp);
      const chips = [
        job.closed ? `<span class="chip chip-closed">${t("chip.closed")}</span>` : job.urgent ? `<span class="chip chip-urgent">${t("chip.urgent")}</span>` : "",
        tchip(job.temp),
        job.rent ? `<span class="chip chip-house">${svg("house")}${t("chip.housing")}</span>` : `<span class="chip chip-new">${t("chip.nohousing")}</span>`,
        job.noExp ? `<span class="chip chip-exp">${t("chip.noexp")}</span>` : ""
      ].join("");
      const hours = Array.from({ length: 9 }, (_, i) => `<span>${String(i * 3).padStart(2, "0")}</span>`).join("");
      head.innerHTML = `<span class="jd-big-temp" aria-hidden="true">${sign(job.temp)}°</span>
        <div class="wrap">${crumbs(tx.title)}
          <div class="chips">${chips}</div>
          <h1 id="role-h">${esc(tx.title)}</h1>
          <p class="where">${esc(cityName(job.city))}, ${esc(job.district)}. ${esc(sectorName(job.sector))}.${job.closed ? "" : " " + t("job.places", { n: job.places }) + "."}</p>
          <dl class="keyfacts">
            <div class="big"><dt>${t("job.f.pay")}</dt><dd>${payTxt(job)} <span style="font-size:.5em">${t("u.plnh")}</span></dd></div>
            <div><dt>${t("job.f.contract")}</dt><dd>${t("contract." + job.contract)}</dd></div>
            <div><dt>${t("job.f.shift")}</dt><dd>${shiftTxt(job)}, <span style="white-space:nowrap">${t("days." + job.days)}</span></dd></div>
            <div><dt>${t("job.f.housing")}</dt><dd>${job.rent ? t("job.f.housing.v", { r: job.rent }) : t("job.f.housing.no")}</dd></div>
          </dl>
        </div>
        <div class="wrap"><div class="shift-day${reduce ? " in" : ""}">
          <div class="shiftbar" role="img" aria-label="${esc(t("job.axis", { h: shiftTxt(job) }))}">${bar(job.shift)}</div>
          <p class="hours" aria-hidden="true">${hours}</p>
        </div></div>`;
      const stay = job.rent && house ? `<div class="stay">
          <div class="card"><div class="iso-wrap">${isoRoom(house.perRoom, clim(job.temp) === "warm")}</div><h3>${t("job.room")}</h3><b>${t("job.room.v", { r: job.rent })}</b>
            <p>${esc(t("job.room.p", { k: t("hs.kind." + house.kind), d: house.district, n: house.perRoom }))}</p></div>
          <div class="card"><h3>${t("job.bus")}</h3><b>${t("job.bus.v")}</b><p>${t("job.bus.p", { m: house.minutes })}</p>
            <p style="margin-top:12px"><a class="link-more" href="housing.html">${t("home.house.more")}</a></p></div>
        </div>` : `<div class="stay"><div class="card"><h3>${t("job.nohouse.h")}</h3><p>${t("job.nohouse.p", { c: cityName(job.city), r: (house || D.housing[0]).rent })}</p>
          <p style="margin-top:12px"><a class="link-more" href="housing.html">${t("home.house.more")}</a></p></div></div>`;
      main.innerHTML = `${job.closed ? `<div class="closed-banner" role="status"><h2>${t("job.closed.h")}</h2><p>${t("job.closed.p", { d: fmtDate(job.closes) })}</p>
          <div class="ctas"><a class="btn btn-orange" href="#similar">${t("job.closed.cta")}</a><a class="btn btn-quiet" href="jobs.html">${t("job.closed.all")}</a></div></div>` : ""}
        <section aria-labelledby="do-h"><h2 id="do-h">${t("job.do")}</h2><p class="lede">${esc(tx.desc)}</p>
          <dl class="review" style="display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin-top:6px">
            <dt style="color:var(--steel)">${t("job.f.langs")}</dt><dd style="margin:0">${job.langs.map((l) => t("lang." + l)).join(", ")}</dd>
            <dt style="color:var(--steel)">${t("job.f.closes")}</dt><dd style="margin:0">${fmtDate(job.closes)}</dd>
          </dl></section>
        <section aria-labelledby="req-h"><h2 id="req-h">${t("job.need")}</h2><ul class="list-x must">${sec.need.map((n) => item(L(n), "dash")).join("")}</ul></section>
        <section aria-labelledby="get-h"><h2 id="get-h">${t("job.get")}</h2><ul class="list-x get">${sec.get.map((n) => item(L(n), "check")).join("")}</ul></section>
        <section aria-labelledby="stay-h"><h2 id="stay-h">${t("job.stay")}</h2>${stay}</section>
        <section id="similar" aria-labelledby="sim-h"><h2 id="sim-h">${t("job.similar")}</h2><div class="jobs-grid">${similar().map(jobCard).join("")}</div></section>`;
      document.title = t("meta.job.t", { t: tx.title, c: cityName(job.city) });
      $('meta[name="description"]').setAttribute("content", tx.desc);
      $("#barPay").textContent = payTxt(job) + " " + t("u.plnh").split(" ")[0];
      $("#barMeta").textContent = tx.title + ", " + cityName(job.city);
      $("#applyForm").hidden = !!job.closed || $("#apOk").hidden === false;
      $("#apProgress").hidden = $("#apIntro").hidden = !!job.closed;
      $("#apClosed").hidden = !job.closed;
      $("#applyBar").hidden = !!job.closed;
      $("#apply-h").textContent = job.closed ? t("job.closed.h") : t("ap.h");
      $("#apply .demo-tag").hidden = !!job.closed;
      document.body.classList.toggle("has-bar", !job.closed);
      observe(head);
    }

    const start = form.start;
    start.min = today;
    const reviewRows = () => {
      const v = (x) => (x ? esc(x) : `<span style="color:var(--steel)">${t("ap.none")}</span>`);
      const yn = (n) => { const r = radio(form, n); return r === "yes" ? t("ap.yes") : r === "no" ? t("ap.no") : r === "progress" ? t("ap.progressv") : ""; };
      const msgr = radio(form, "msgr");
      const file = form.cv.files[0];
      const sec = (n, rows) => `<section><header><h3>${n}. ${t("ap.s" + n)}</h3><button class="text-btn" type="button" data-goto="${n}">${t("ap.edit")}</button></header><dl>${rows.map(([k, val]) => `<dt>${t(k)}</dt><dd>${val}</dd>`).join("")}</dl></section>`;
      return sec(1, [["ap.name", v(form.name.value.trim())], ["ap.phone", v(form.code.value + " " + form.phone.value.trim())], ["ap.calllang", t("lang." + form.calllang.value)], ["ap.msgr", msgr === "call" ? t("ap.call") : msgr], ["ap.city", v(form.city.value.trim())]]) +
        sec(2, [["ap.passport", yn("passport")], ["ap.permit", yn("permit")], ["ap.pesel", yn("pesel")], ["ap.exp", t("ap.exp." + radio(form, "exp"))], ["ap.start", form.start.value ? fmtDate(form.start.value) : ""]]) +
        sec(3, [["ap.cv", file ? esc(file.name) : t("ap.cvnone")], ["ap.c1", form.c1.checked ? t("ap.yes") : t("ap.no")], ["ap.c2", form.c2.checked ? t("ap.yes") : t("ap.no")]]);
    };
    function validate(n) {
      const e = [];
      if (n === 1) {
        if (form.name.value.trim().length < 2) e.push(["name", "ap.e.name"]);
        if (!phoneOk(form.phone.value)) e.push(["phone", "ap.e.phone"]);
      }
      if (n === 2) {
        ["passport", "permit", "pesel", "exp"].forEach((k) => { if (!radio(form, k)) e.push([k, "ap.e.choose"]); });
        if (!form.start.value || form.start.value < today) e.push(["start", "ap.e.date"]);
      }
      if (n === 3) {
        const f = form.cv.files[0];
        if (f && !/\.(pdf|docx?|jpe?g)$/i.test(f.name)) e.push(["cv", "ap.e.type"]);
        else if (f && f.size > 5 * 1024 * 1024) e.push(["cv", "ap.e.size"]);
        if (!form.c1.checked) e.push(["c1", "ap.e.consent"]);
      }
      return showErrors(form, e, "e-", sumEl);
    }
    function showStep(n, focus) {
      step = n;
      $$(".stepper-step", form).forEach((s) => { s.hidden = +s.dataset.step !== n; });
      const cur = $(`.stepper-step[data-step="${n}"]`, form);
      animateStep(cur);
      $$("#apProgress li").forEach((li, i) => {
        li.classList.toggle("done", i + 1 < n);
        if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      const meta = $("#apMeta");
      meta.dataset.n = n;
      meta.textContent = n <= 3 ? t("ap.step", { n }) : t("ap.review");
      $("#apBack").hidden = n === 1;
      const next = $("#apNext");
      next.dataset.i18n = n < 3 ? "ap.next" : n === 3 ? "ap.check" : "ap.send";
      next.textContent = t(next.dataset.i18n);
      if (n === 4) $("#apReview").innerHTML = reviewRows();
      if (focus) {
        const target = n === 4 ? meta : cur.querySelector("input, select");
        if (n === 4) meta.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
        const top = $("#apply").getBoundingClientRect().top;
        if (top < 60 || top > innerHeight * 0.6) $("#apply").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (step < 4) { if (validate(step)) showStep(step + 1, true); return; }
      form.hidden = true;
      $("#apProgress").hidden = true;
      const ok = $("#apOk");
      ok.hidden = false;
      renderOk();
      ok.focus();
    });
    function renderOk() {
      const m = radio(form, "msgr"), l = t("lang.in." + form.calllang.value);
      $("#apOkText").textContent = m === "call" ? t("ap.ok.call", { l }) : t("ap.ok.p", { m, l });
    }
    $("#apBack").addEventListener("click", () => { showErrors(form, [], "e-", sumEl); showStep(step - 1, true); });
    form.addEventListener("click", (e) => { const g = e.target.closest("[data-goto]"); if (g) showStep(+g.dataset.goto, true); });
    clearOnEdit(form, "e-", sumEl);
    form.addEventListener("change", (e) => {
      const f = e.target.closest("[data-field]");
      if (f && e.target.type === "radio" && $("#e-" + f.dataset.field)?.textContent) form.dispatchEvent(new Event("input"));
      if (e.target.type === "radio") { const ff = e.target.closest("[data-field]"); if (ff) { setErr(form, ff.dataset.field, null, "e-"); } }
    });
    // Apply bar slides away while the form itself is on screen
    const bar2 = $("#applyBar");
    if (io) new IntersectionObserver(([en]) => bar2.classList.toggle("away", en.isIntersecting), { threshold: 0.12 }).observe($("#apply"));

    renderJob();
    renders.push(() => {
      renderJob();
      const meta = $("#apMeta");
      meta.textContent = step <= 3 ? t("ap.step", { n: step }) : t("ap.review");
      if (step === 4) $("#apReview").innerHTML = reviewRows();
      if (!$("#apOk").hidden) renderOk();
      renderSum(sumEl);
    });
    showStep(1, false);
    if (location.hash === "#apply") setTimeout(() => $("#apply").scrollIntoView({ block: "start" }), 50);
  }

  /* ---------- Employer request wizard ---------- */
  if (page === "employers") {
    const KEY = "mostova.request.v1";
    const form = $("#wzForm"), sumEl = $("#wzErr");
    const ROLES = $$(".role-row").map((r) => r.dataset.role);
    let st = { step: 1, roles: {}, f: {} };
    const total = () => ROLES.reduce((s, r) => s + (st.roles[r] || 0), 0);
    let savedT;
    function collect() {
      const f = {};
      $$("input, select, textarea", form).forEach((i) => {
        if (i.type === "checkbox" && i.name === "shifts") { (f.shifts = f.shifts || []); if (i.checked) f.shifts.push(i.value); }
        else if (i.type === "checkbox") f[i.name] = i.checked;
        else if (i.type === "radio") { if (i.checked) f[i.name] = i.value; }
        else if (i.name) f[i.name] = i.value;
      });
      st.f = f;
    }
    function save(flash) {
      collect();
      store.set(KEY, JSON.stringify(st));
      if (flash) { const s = $("#wzSaved"); s.classList.add("show"); clearTimeout(savedT); savedT = setTimeout(() => s.classList.remove("show"), 1600); }
    }
    function fill() {
      $$("input, select, textarea", form).forEach((i) => {
        const v = st.f[i.name];
        if (i.type === "checkbox" && i.name === "shifts") i.checked = (v || []).includes(i.value);
        else if (i.type === "checkbox") i.checked = !!v;
        else if (i.type === "radio") i.checked = v ? v === i.value : i.defaultChecked;
        else i.value = v ?? "";
      });
      renderRoles();
    }
    function renderRoles(bumped) {
      $$(".role-row").forEach((row) => {
        const n = st.roles[row.dataset.role] || 0;
        row.querySelector("output").textContent = n;
        row.querySelector('[data-d="-1"]').disabled = n === 0;
        row.classList.toggle("has", n > 0);
        const name = t("wz.r." + row.dataset.role);
        row.querySelector('[data-d="-1"]').setAttribute("aria-label", t("wz.less", { r: name }));
        row.querySelector('[data-d="1"]').setAttribute("aria-label", t("wz.more", { r: name }));
      });
      const tot = $("#wzTotal");
      tot.textContent = t("wz.total", { n: total() });
      if (bumped && !reduce) { tot.classList.remove("bump"); void tot.offsetWidth; tot.classList.add("bump"); }
    }
    form.addEventListener("click", (e) => {
      const b = e.target.closest(".counter button");
      if (b) {
        const r = b.closest(".role-row").dataset.role;
        st.roles[r] = Math.max(0, Math.min(99, (st.roles[r] || 0) + +b.dataset.d));
        renderRoles(true);
        if (total() > 0) setErr(form, "roles", null, "we-");
        save(true);
        if (b.disabled) b.closest(".counter").querySelector('[data-d="1"]').focus();
        return;
      }
      const g = e.target.closest("[data-goto]");
      if (g) showStep(+g.dataset.goto, true);
    });
    form.addEventListener("input", () => save(true));
    form.addEventListener("change", (e) => {
      save(true);
      const f = e.target.closest("[data-field]");
      if (f && (e.target.type === "checkbox" || e.target.tagName === "SELECT")) setErr(form, f.dataset.field, null, "we-");
    });
    clearOnEdit(form, "we-", sumEl);
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    function validate(n) {
      const e = [], f = form;
      if (n === 1) {
        if (!f.company.value.trim()) e.push(["company", "wz.e.company"]);
        if (!f.contact.value.trim()) e.push(["contact", "wz.e.contact"]);
        if (!emailOk(f.email.value.trim())) e.push(["email", "wz.e.email"]);
        if (!phoneOk(f.phone.value)) e.push(["phone", "wz.e.phone"]);
      }
      if (n === 2 && !total()) e.push(["roles", "wz.e.roles"]);
      if (n === 3) {
        if (!f.city.value) e.push(["city", "wz.e.city"]);
        if (!$$("input[name=shifts]:checked", f).length) e.push(["shifts", "wz.e.shifts"]);
        if (!f.start.value || f.start.value < today) e.push(["start", "wz.e.date"]);
        if (!f.dur.value) e.push(["dur", "wz.e.dur"]);
      }
      return showErrors(form, e, "we-", sumEl);
    }
    function summary() {
      const f = st.f;
      const v = (x) => (x ? esc(x) : `<span style="color:var(--steel)">${t("ap.none")}</span>`);
      const sec = (n, rows) => `<section><header><h3>${n}. ${t("wz.s" + n)}</h3><button class="text-btn" type="button" data-goto="${n}">${t("wz.edit")}</button></header><dl>${rows.map(([k, val]) => `<dt>${t(k)}</dt><dd>${val}</dd>`).join("")}</dl></section>`;
      const roles = ROLES.filter((r) => st.roles[r]).map((r) => [`wz.r.${r}`, st.roles[r]]);
      return sec(1, [["wz.company", v(f.company)], ["wz.nip", v(f.nip)], ["wz.contact", v([f.contact, f.role].filter(Boolean).join(", "))], ["wz.email", v(f.email)], ["wz.phone", v(f.phone)]]) +
        sec(2, roles.concat([["wz.sum.total", `<b>${t("u.people", { n: total() })}</b>`]])) +
        sec(3, [["wz.city", f.city === "other" ? t("wz.city.other") : f.city ? esc(cityName(f.city)) : ""], ["wz.shifts", (f.shifts || []).map((s) => t("shift." + s)).join(", ")], ["wz.start", f.start ? fmtDate(f.start) : ""], ["wz.dur", f.dur ? t("wz." + f.dur) : ""], ["wz.house", f.house ? t("wz.yes") : t("wz.no")]]) +
        sec(4, [["wz.notes", v(f.notes)], ["wz.reply", t("wz.reply." + (f.reply || "phone"))]]);
    }
    function showStep(n, focus) {
      st.step = n;
      $$(".stepper-step", form).forEach((s) => { s.hidden = +s.dataset.step !== n; });
      const cur = $(`.stepper-step[data-step="${n}"]`, form);
      animateStep(cur);
      $$("#wzProgress li").forEach((li, i) => {
        li.classList.toggle("done", i + 1 < n);
        if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      const meta = $("#wzMeta");
      meta.textContent = n <= 4 ? t("wz.step", { n }) : t("wz.s5");
      $("#wzBack").hidden = n === 1;
      const next = $("#wzNext");
      next.dataset.i18n = n < 4 ? "wz.next" : n === 4 ? "wz.review" : "wz.send";
      next.textContent = t(next.dataset.i18n);
      if (n === 5) { collect(); $("#wzReview").innerHTML = summary(); }
      save(false);
      if (focus) {
        const target = n === 5 ? cur.querySelector("h3") : cur.querySelector("input, select, textarea, button");
        if (n === 5) target.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
        const top = $("#wizard").getBoundingClientRect().top;
        if (top < 60 || top > innerHeight * 0.5) $("#wizard").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
    function reset() {
      st = { step: 1, roles: {}, f: {} };
      store.del(KEY);
      form.reset();
      renderRoles();
      showErrors(form, [], "we-", sumEl);
      $("#wzRestored").hidden = true;
      form.hidden = false;
      $("#wzOk").hidden = true;
      $("#wzProgress").hidden = false;
      $(".wz-status").hidden = false;
      store.del(KEY);
      showStep(1, true);
      store.del(KEY);
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (st.step < 5) { if (validate(st.step)) showStep(st.step + 1, true); return; }
      collect();
      const reply = st.f.reply || "phone";
      store.del(KEY);
      form.hidden = true;
      $("#wzProgress").hidden = true;
      $(".wz-status").hidden = true;
      $("#wzRestored").hidden = true;
      const ok = $("#wzOk");
      ok.dataset.reply = reply;
      $("#wzOkText").textContent = t("wz.ok." + reply);
      ok.hidden = false;
      ok.focus();
    });
    $("#wzBack").addEventListener("click", () => { showErrors(form, [], "we-", sumEl); showStep(st.step - 1, true); });
    $("#wzReset").addEventListener("click", reset);
    $("#wzNew").addEventListener("click", reset);
    $("#w-start").min = today;
    // Restore a draft kept on this device
    let saved = null;
    try { saved = JSON.parse(store.get(KEY) || "null"); } catch (e) { saved = null; }
    if (saved && saved.f && (Object.values(saved.f).some((v) => v && v !== "phone" && (!Array.isArray(v) || v.length)) || Object.values(saved.roles || {}).some(Boolean))) {
      st = { step: Math.min(5, Math.max(1, saved.step || 1)), roles: saved.roles || {}, f: saved.f };
      fill();
      $("#wzRestored").hidden = false;
    }
    renderRoles();
    showStep(st.step, false);
    renders.push(() => {
      renderRoles();
      $("#wzMeta").textContent = st.step <= 4 ? t("wz.step", { n: st.step }) : t("wz.s5");
      if (st.step === 5) $("#wzReview").innerHTML = summary();
      const ok = $("#wzOk");
      if (!ok.hidden) $("#wzOkText").textContent = t("wz.ok." + ok.dataset.reply);
      renderSum(sumEl);
    });
  }

  /* ---------- Housing ---------- */
  if (page === "housing") {
    let city = "";
    const cities = [...new Set(D.housing.map((h) => h.city))];
    function tabs() {
      $("#cityTabs").innerHTML = [["", t("hs.all")]].concat(cities.map((c) => [c, cityName(c)]))
        .map(([c, l]) => `<button type="button" data-c="${c}" aria-pressed="${c === city}">${esc(l)}</button>`).join("");
    }
    function cards() {
      const list = D.housing.filter((h) => !city || h.city === city);
      $("#hsCount").textContent = t("hs.shown", { n: list.length });
      $("#houseGrid").innerHTML = list.map((h) => {
        const tx = L(h), idx = D.housing.filter((x) => x.map).indexOf(h);
        return `<article class="house" id="house-${h.id}" data-id="${h.id}">
          <div class="iso-wrap">${isoRoom(h.beds, h.hue === "frost")}</div>
          <div class="body">
            <p class="kind">${t("hs.kind." + h.kind)}, ${esc(cityName(h.city))}, ${esc(h.district)}${idx >= 0 ? ` <b style="display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--orange);color:var(--ink);font-size:.8rem;margin-left:4px">${idx + 1}</b>` : ""}</p>
            <h3>${esc(tx.name)}</h3>
            <p class="desc">${esc(tx.desc)}</p>
            <div class="facts3">
              <div><b>${h.rent}</b><span>${t("hs.rent")}</span></div>
              <div><b>${h.perRoom}</b><span>${t("hs.f.per")}</span></div>
              <div><b>${h.minutes}</b><span>${t("hs.f.min")}</span></div>
            </div>
            <ul class="amen">${h.amen.map((a) => `<li>${svg(a)}${t("hs.am." + a)}</li>`).join("")}</ul>
            <a class="link-more" href="jobs.html?city=${h.city}&housing=1">${t("hs.jobs")}</a>
          </div>
        </article>`;
      }).join("");
    }
    const mapped = D.housing.filter((h) => h.map);
    function pins() {
      $("#pins").innerHTML = mapped.map((h, i) => `<g class="hp" tabindex="0" role="button" data-id="${h.id}" aria-label="${esc(L(h).name)}, ${esc(h.district)}" transform="translate(${h.map[0]} ${h.map[1]})"><circle class="ring" r="21" fill="none"/><circle class="c" r="14"/><text text-anchor="middle" y="5">${i + 1}</text></g>`).join("");
      $("#mapList").innerHTML = mapped.map((h, i) => `<button type="button" data-id="${h.id}"><b>${i + 1}</b><span><strong>${esc(L(h).name)}</strong><br><span style="color:var(--steel);font-size:.9rem">${esc(h.district)}, ${h.rent} ${t("hs.rent")}, ${t("hs.to", { n: h.minutes })}</span></span></button>`).join("");
    }
    function hl(id, on) {
      const h = D.housing.find((x) => x.id === id);
      $$(".hp, #mapList button").forEach((el) => el.classList.toggle("on", on && el.dataset.id === id));
      $$(".dmap .d").forEach((d) => d.classList.toggle("on", !!(on && h && d.dataset.d === h.district)));
    }
    function go(id) {
      const h = D.housing.find((x) => x.id === id);
      if (city && h.city !== city) { city = ""; tabs(); cards(); }
      const card = $("#house-" + id);
      card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      card.classList.add("hl");
      setTimeout(() => card.classList.remove("hl"), 2200);
    }
    $("#cityTabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; city = b.dataset.c; tabs(); cards(); $(`#cityTabs [data-c="${city}"]`).focus(); });
    const mapEl = $(".map-wrap");
    mapEl.addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) go(b.dataset.id); });
    mapEl.addEventListener("keydown", (e) => { const b = e.target.closest(".hp"); if (b && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); go(b.dataset.id); } });
    ["mouseover", "focusin"].forEach((ev) => document.addEventListener(ev, (e) => { const b = e.target.closest?.(".hp, #mapList button, .house"); hl(b?.dataset.id, !!b); }));
    const f = () => { tabs(); cards(); pins(); };
    f(); renders.push(f);
  }

  /* ---------- Contact form ---------- */
  if (page === "contact") {
    const form = $("#contactForm"), sumEl = $("#ctErr");
    clearOnEdit(form, "ce-", sumEl);
    form.addEventListener("change", (e) => { if (e.target.type === "checkbox") setErr(form, "consent", null, "ce-"); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const er = [], c = form.contact.value.trim();
      if (form.name.value.trim().length < 2) er.push(["name", "ct.e.name"]);
      if (!(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) || phoneOk(c))) er.push(["contact", "ct.e.contact"]);
      if (form.msg.value.trim().length < 10) er.push(["msg", "ct.e.msg"]);
      if (!form.consent.checked) er.push(["consent", "ct.e.consent"]);
      if (!showErrors(form, er, "ce-", sumEl)) return;
      form.hidden = true;
      $("#ctOk").hidden = false;
      $("#ctOk").focus();
    });
    $("#ctAgain").addEventListener("click", () => { form.reset(); form.hidden = false; $("#ctOk").hidden = true; form.name.focus(); });
    renders.push(() => renderSum(sumEl));
  }

  applyStatic();
  observe();
})();
