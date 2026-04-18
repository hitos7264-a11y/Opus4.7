/* ================================================================
   ui.js — 共通 UI（AppBar / TabBar / Drawer）と
   スクロールリビール・アコーディオン・セグメント・プログレス
   アニメを一括で初期化するクライアント側コントローラ。
   ================================================================ */

(function() {
  "use strict";

  /* ---------- ページごとのメタ -------------------------------- */
  const PAGES = [
    { path: "index.html",        title: "ホーム",             key: "home",        icon: "fa-solid fa-house" },
    { path: "pages/overview.html",   title: "概要",            key: "overview",    icon: "fa-solid fa-bookmark" },
    { path: "pages/pricing.html",    title: "価格 & FinOps",    key: "pricing",     icon: "fa-solid fa-yen-sign" },
    { path: "pages/context.html",    title: "コンテキスト",     key: "context",     icon: "fa-solid fa-align-left" },
    { path: "pages/reasoning.html",  title: "Adaptive Reasoning", key: "reasoning", icon: "fa-solid fa-brain" },
    { path: "pages/vision.html",     title: "ビジョン",         key: "vision",      icon: "fa-solid fa-eye" },
    { path: "pages/benchmarks.html", title: "ベンチマーク",     key: "bench",       icon: "fa-solid fa-chart-simple" },
    { path: "pages/safety.html",     title: "安全性 & Mythos",  key: "safety",      icon: "fa-solid fa-shield-halved" },
    { path: "pages/channels.html",   title: "配信チャネル",     key: "channels",    icon: "fa-solid fa-cloud" },
    { path: "pages/migration.html",  title: "移行ガイド",       key: "migration",   icon: "fa-solid fa-arrow-right-arrow-left" },
    { path: "pages/personality.html",title: "性格 & 挙動",      key: "personality", icon: "fa-solid fa-masks-theater" },
    { path: "pages/verdict.html",    title: "最終評価",         key: "verdict",     icon: "fa-solid fa-gavel" },
    { path: "pages/sources.html",    title: "出典 (43)",        key: "sources",     icon: "fa-solid fa-book" }
  ];

  /* ---------- パス解決ユーティリティ -------------------------- */
  function isRootPage() {
    const p = location.pathname;
    return p.endsWith("/") || p.endsWith("/index.html") || p === "" || /\/$/.test(p);
  }
  function base() {
    // depth 0 (/) vs depth 1 (/pages/xxx.html)
    return isRootPage() ? "" : "../";
  }
  function resolveHref(p) {
    if (isRootPage()) return p;
    if (p === "index.html") return "../index.html";
    return p.replace(/^pages\//, "");
  }

  /* ---------- AppBar レンダリング ----------------------------- */
  function renderAppBar(currentKey, pageTitle) {
    const el = document.getElementById("appbar");
    if (!el) return;
    el.innerHTML = `
      <div class="appbar__inner">
        <button class="appbar__btn" id="backBtn" aria-label="戻る">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="appbar__title">
          <small>Claude Code 仕様書 · 2026-04-18</small>
          ${escapeHtml(pageTitle || "Claude Opus 4.7")}
        </div>
        <button class="appbar__btn" id="menuBtn" aria-label="メニューを開く">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    `;
    document.getElementById("backBtn").addEventListener("click", (e) => {
      e.preventDefault();
      if (history.length > 1 && document.referrer) history.back();
      else location.href = resolveHref("index.html");
    });
    document.getElementById("menuBtn").addEventListener("click", openDrawer);
  }

  /* ---------- TabBar レンダリング ----------------------------- */
  function renderTabBar(currentKey) {
    const el = document.getElementById("tabbar");
    if (!el) return;
    const tabs = [
      { key: "home",     path: "index.html",          icon: "fa-solid fa-house",    label: "ホーム" },
      { key: "bench",    path: "pages/benchmarks.html", icon: "fa-solid fa-chart-simple", label: "ベンチ" },
      { key: "reasoning",path: "pages/reasoning.html",  icon: "fa-solid fa-brain",    label: "推論" },
      { key: "safety",   path: "pages/safety.html",     icon: "fa-solid fa-shield-halved", label: "安全" },
      { key: "sources",  path: "pages/sources.html",    icon: "fa-solid fa-book",     label: "出典" }
    ];
    el.innerHTML = `
      <nav class="tabbar__inner" aria-label="primary">
        ${tabs.map(t => `
          <a class="tab ${t.key === currentKey ? "is-active" : ""}"
             href="${resolveHref(t.path)}"
             ${t.key === currentKey ? 'aria-current="page"' : ''}>
            <i class="${t.icon}"></i>
            <span>${t.label}</span>
          </a>
        `).join("")}
      </nav>
    `;
  }

  /* ---------- Drawer レンダリング ----------------------------- */
  function renderDrawer(currentKey) {
    const host = document.getElementById("drawer-root");
    if (!host) return;
    host.innerHTML = `
      <div class="drawer-backdrop" id="drawerBackdrop"></div>
      <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="全ページメニュー">
        <div class="drawer__head">
          <strong style="font-size:14px;">目次</strong>
          <button class="appbar__btn" id="drawerClose" aria-label="閉じる">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="drawer__body">
          <div class="drawer__section-title">仕様書セクション</div>
          <ul class="drawer__list">
            ${PAGES.map(p => `
              <li>
                <a class="drawer__link ${p.key === currentKey ? "is-active" : ""}"
                   href="${resolveHref(p.path)}">
                  <i class="${p.icon}"></i>
                  <span>${escapeHtml(p.title)}</span>
                </a>
              </li>
            `).join("")}
          </ul>
          <div class="drawer__section-title">付録</div>
          <ul class="drawer__list">
            <li><a class="drawer__link" href="${resolveHref('pages/glossary.html')}"><i class="fa-solid fa-spell-check"></i><span>用語集</span></a></li>
            <li><a class="drawer__link" href="${resolveHref('pages/timeline.html')}"><i class="fa-solid fa-timeline"></i><span>タイムライン</span></a></li>
            <li><a class="drawer__link" href="${resolveHref('pages/faq.html')}"><i class="fa-solid fa-circle-question"></i><span>FAQ</span></a></li>
            <li><a class="drawer__link" href="${resolveHref('pages/versus.html')}"><i class="fa-solid fa-code-compare"></i><span>競合比較</span></a></li>
            <li><a class="drawer__link" id="themeToggleInDrawer" href="#"><i class="fa-solid fa-circle-half-stroke"></i><span>テーマ切替</span></a></li>
          </ul>
        </div>
      </aside>
    `;
    document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
    document.getElementById("drawerClose").addEventListener("click", closeDrawer);
    document.getElementById("themeToggleInDrawer").addEventListener("click", (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  function openDrawer() {
    document.getElementById("drawer")?.classList.add("is-open");
    document.getElementById("drawerBackdrop")?.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    document.getElementById("drawer")?.classList.remove("is-open");
    document.getElementById("drawerBackdrop")?.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------- Theme -------------------------------------------- */
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("opus47-theme", next); } catch(e) {}
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("opus47-theme"); } catch(e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }

  /* ---------- 共通 initializer -------------------------------- */
  function init(currentKey, pageTitle) {
    initTheme();
    renderAppBar(currentKey, pageTitle);
    renderTabBar(currentKey);
    renderDrawer(currentKey);
    initRevealObserver();
    initAccordion();
    initSegments();
    initProgressBars();
    initBarCharts();
    initGauges();
    initCopyButtons();
  }

  /* ---------- Reveal on scroll -------------------------------- */
  function initRevealObserver() {
    const targets = document.querySelectorAll(".reveal, .stagger");
    if (!("IntersectionObserver" in window) || !targets.length) {
      targets.forEach(t => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add("is-in");
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- Accordion -------------------------------------- */
  function initAccordion() {
    document.querySelectorAll(".accordion").forEach(acc => {
      acc.querySelectorAll(".accordion__head").forEach(btn => {
        btn.addEventListener("click", () => {
          const item = btn.closest(".accordion__item");
          const open = item.classList.toggle("is-open");
          const body = item.querySelector(".accordion__body");
          if (!body) return;
          if (open) body.style.maxHeight = body.scrollHeight + "px";
          else body.style.maxHeight = "0";
        });
      });
    });
  }

  /* ---------- Segmented control ------------------------------ */
  function initSegments() {
    document.querySelectorAll(".segment").forEach(seg => {
      const btns = seg.querySelectorAll(".segment__btn");
      const targetSelector = seg.getAttribute("data-target");
      btns.forEach(b => {
        b.addEventListener("click", () => {
          btns.forEach(x => x.classList.remove("is-active"));
          b.classList.add("is-active");
          if (!targetSelector) return;
          const id = b.getAttribute("data-panel");
          document.querySelectorAll(targetSelector).forEach(p => {
            p.hidden = (p.getAttribute("data-panel") !== id);
          });
        });
      });
    });
  }

  /* ---------- Progress bars (fill to [data-value]) ---------- */
  function initProgressBars() {
    const fills = document.querySelectorAll("[data-fill]");
    if (!fills.length) return;
    const doFill = (el) => {
      const v = parseFloat(el.getAttribute("data-fill"));
      if (!Number.isFinite(v)) return;
      requestAnimationFrame(() => { el.style.width = Math.max(0, Math.min(100, v)) + "%"; });
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { doFill(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.2 });
      fills.forEach(f => io.observe(f));
    } else {
      fills.forEach(doFill);
    }
  }

  function initBarCharts() {
    // .barchart__fill はすでに data-fill によりアニメ
    // 追加：data-max を参照してスケーリング
    document.querySelectorAll(".barchart[data-max]").forEach(chart => {
      const max = parseFloat(chart.getAttribute("data-max")) || 100;
      chart.querySelectorAll("[data-raw]").forEach(f => {
        const raw = parseFloat(f.getAttribute("data-raw"));
        if (!Number.isFinite(raw)) return;
        const pct = (raw / max) * 100;
        f.setAttribute("data-fill", pct.toFixed(2));
      });
    });
  }

  function initGauges() {
    document.querySelectorAll(".gauge__ring[data-value]").forEach(g => {
      const v = Math.max(0, Math.min(100, parseFloat(g.getAttribute("data-value")) || 0));
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(es => {
          es.forEach(e => {
            if (e.isIntersecting) {
              let cur = 0;
              const step = () => {
                cur += Math.max(1, Math.ceil(v/40));
                if (cur >= v) cur = v;
                g.style.setProperty("--p", cur);
                const valEl = g.querySelector(".gauge__val");
                if (valEl) valEl.textContent = Math.round(cur) + "%";
                if (cur < v) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
              io.unobserve(g);
            }
          });
        }, { threshold: 0.3 });
        io.observe(g);
      } else {
        g.style.setProperty("--p", v);
      }
    });
  }

  /* ---------- コピー可能なコードブロック --------------------- */
  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const sel = btn.getAttribute("data-copy");
        const tgt = sel ? document.querySelector(sel) : btn.closest(".codeblock")?.querySelector("pre code, pre");
        if (!tgt) return;
        try {
          await navigator.clipboard.writeText(tgt.innerText);
          const prev = btn.textContent;
          btn.textContent = "✓ コピー完了";
          setTimeout(() => btn.textContent = prev, 1400);
        } catch(e) { /* silent */ }
      });
    });
  }

  /* ---------- helper ----------------------------------------- */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  /* ---------- expose ----------------------------------------- */
  window.OPUS47_UI = { init, openDrawer, closeDrawer, toggleTheme, escapeHtml };
})();
