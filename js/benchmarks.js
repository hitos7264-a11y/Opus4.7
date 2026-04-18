/* ================================================================
   benchmarks.js — ベンチマーク一覧ページ用のチャート描画。
   window.OPUS47 のデータを読んで、各パネルに棒グラフを注入する。
   ================================================================ */

(function() {
  "use strict";
  if (!window.OPUS47) return;
  const D = window.OPUS47;

  function row(label, value, fillClass, raw, max) {
    const pct = Math.max(0, Math.min(100, (raw / max) * 100));
    return `
      <div class="barchart__row">
        <span class="barchart__label">${label}</span>
        <div class="barchart__track">
          <div class="barchart__fill ${fillClass}" data-fill="${pct.toFixed(2)}"></div>
        </div>
        <span class="barchart__value">${value}</span>
      </div>`;
  }

  function renderCoding() {
    const el = document.getElementById("chart-coding");
    if (!el) return;
    const MAX = 100;
    let html = "";
    D.benchCoding.forEach(b => {
      if (b.opus46 != null)
        html += row(`${b.name} 4.6`, b.opus46 + (b.unit || ""), "barchart__fill--gray", b.opus46, MAX);
      if (b.opus47 != null)
        html += row(`${b.name} 4.7`, b.opus47 + (b.unit || ""), "", b.opus47, MAX);
    });
    el.innerHTML = html;
  }

  function renderKnowledge() {
    const el = document.getElementById("chart-knowledge");
    if (!el) return;
    let html = "";
    D.benchKnowledge.forEach(b => {
      // Eloはスケール合わず別建て表示
      if (b.unit === "Elo") {
        // Elo は max 2000 として
        const MAX = 2000;
        html += row(`${b.name} Opus4.7`, b.opus47, "", b.opus47, MAX);
        if (b.competitors) {
          Object.entries(b.competitors).forEach(([k, v]) => {
            html += row(`${b.name} ${k}`, v, "barchart__fill--alt", v, MAX);
          });
        }
      } else {
        const MAX = 100;
        if (b.opus46 != null)
          html += row(`${b.name} 4.6`, b.opus46 + "%", "barchart__fill--gray", b.opus46, MAX);
        if (b.opus47 != null)
          html += row(`${b.name} 4.7`, b.opus47 + (b.unit === "%" ? "%" : ""), "", b.opus47, MAX);
      }
    });
    el.innerHTML = html;
  }

  function renderVision() {
    const el = document.getElementById("chart-vision");
    if (!el) return;
    let html = "";
    D.benchVision.forEach(b => {
      if (b.opus46 != null)
        html += row(b.name + " 4.6", b.opus46 + "%", "barchart__fill--gray", b.opus46, 100);
      if (b.opus47 != null)
        html += row(b.name + " 4.7", b.opus47 + "%", "", b.opus47, 100);
    });
    el.innerHTML = html;
  }

  function renderCyber() {
    const el = document.getElementById("chart-cyber");
    if (!el) return;
    let html = "";
    D.benchCyber.forEach(b => {
      const MAX = 100;
      if (b.opus46 != null)
        html += row(b.name + " 4.6", b.opus46 + "%", "barchart__fill--gray", b.opus46, MAX);
      if (b.opus47 != null)
        html += row(b.name + " 4.7", b.opus47 + "%", "", b.opus47, MAX);
      if (b.mythos != null)
        html += row(b.name + " Mythos", b.mythos + "%", "barchart__fill--gold", b.mythos, MAX);
    });
    el.innerHTML = html;
  }

  function initAll() {
    renderCoding();
    renderKnowledge();
    renderVision();
    renderCyber();
    // 初期化後、progressFill の IntersectionObserver をもう一度発火させる必要がある
    setTimeout(() => {
      document.querySelectorAll("[data-fill]").forEach(el => {
        const v = parseFloat(el.getAttribute("data-fill"));
        if (Number.isFinite(v)) el.style.width = v + "%";
      });
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
