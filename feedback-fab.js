/* Conglomerate feedback FAB — human, informal, question-first. window.CG_FEEDBACK = { product, pageUrl } */
(function () {
  var cfg = window.CG_FEEDBACK || {};
  var product = cfg.product || "this kit";
  var pageUrl = cfg.pageUrl || (typeof location !== "undefined" ? location.href : "");
  var to = cfg.to || "steward@brewcityblockchain.com";
  var chips = ["Confused AF", "Don't like it", "Bad deal", "Too much work", "Want a feature", "Just vibing"];

  var style = document.createElement("style");
  style.textContent = [
    "#cg-fb-btn{position:fixed;right:1.1rem;bottom:1.1rem;z-index:9999;width:64px;height:64px;border-radius:999px;border:0;cursor:pointer;",
    "background:#0f766e;color:#fff;box-shadow:0 8px 28px rgba(15,118,110,.45);display:flex;align-items:center;justify-content:center;",
    "transition:transform .15s ease,filter .15s ease;font-size:1.6rem;line-height:1}",
    "#cg-fb-btn:hover{transform:scale(1.06);filter:brightness(1.08)}",
    "#cg-fb-nudge{position:fixed;right:5.4rem;bottom:1.35rem;z-index:9998;max-width:220px;background:#1c1917;color:#fff;",
    "font:600 13px/1.35 system-ui,sans-serif;padding:.7rem .85rem;border-radius:14px 14px 4px 14px;",
    "box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:pointer;opacity:0;pointer-events:none;transition:opacity .25s}",
    "#cg-fb-nudge.show{opacity:.97;pointer-events:auto}",
    "#cg-fb-nudge small{display:block;font-weight:500;opacity:.7;margin-top:.25rem;font-size:11px}",
    "#cg-fb-backdrop{position:fixed;inset:0;background:rgba(28,25,23,.45);z-index:10000;display:none;align-items:flex-end;justify-content:center;padding:1rem}",
    "#cg-fb-backdrop.open{display:flex}",
    "#cg-fb-modal{background:#fff;color:#1c1917;width:min(440px,100%);border-radius:18px;padding:1.2rem 1.15rem 1rem;",
    "box-shadow:0 20px 50px rgba(0,0,0,.25);font:15px/1.45 system-ui,sans-serif;margin-bottom:.5rem}",
    "#cg-fb-modal h2{margin:0 0 .35rem;font-size:1.2rem;letter-spacing:-.02em}",
    "#cg-fb-modal p.hint{margin:0 0 .85rem;color:#78716c;font-size:.92rem}",
    "#cg-fb-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 .75rem}",
    "#cg-fb-chips button{border:1px solid #e7e5e4;background:#fafaf9;border-radius:999px;padding:.4rem .7rem;font:600 12px system-ui;cursor:pointer}",
    "#cg-fb-chips button.on{background:#ccfbf1;border-color:#0f766e;color:#0f766e}",
    "#cg-fb-modal textarea{width:100%;min-height:120px;border:1px solid #e7e5e4;border-radius:12px;padding:.7rem;font:inherit;resize:vertical}",
    "#cg-fb-modal input[type=email]{width:100%;border:1px solid #e7e5e4;border-radius:12px;padding:.55rem .65rem;font:inherit;margin:.65rem 0}",
    "#cg-fb-actions{display:flex;gap:.5rem;justify-content:flex-end;margin-top:.75rem}",
    "#cg-fb-actions button{border:0;border-radius:12px;padding:.7rem 1.05rem;font:700 14px system-ui;cursor:pointer}",
    "#cg-fb-cancel{background:#f5f5f4;color:#1c1917}",
    "#cg-fb-send{background:#0f766e;color:#fff}",
    "#cg-fb-done{display:none;padding:.5rem 0 0;color:#0f766e;font-weight:700}"
  ].join("");
  document.head.appendChild(style);

  var nudge = document.createElement("div");
  nudge.id = "cg-fb-nudge";
  nudge.innerHTML = "Honest take — what's off?<small>Tap me. Rants welcome.</small>";
  document.body.appendChild(nudge);

  var btn = document.createElement("button");
  btn.id = "cg-fb-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Say something — feedback");
  btn.textContent = "💬";
  document.body.appendChild(btn);

  var backdrop = document.createElement("div");
  backdrop.id = "cg-fb-backdrop";
  backdrop.innerHTML = [
    '<div id="cg-fb-modal" role="dialog" aria-modal="true" aria-labelledby="cg-fb-title">',
    '<h2 id="cg-fb-title">Be honest with us</h2>',
    '<p class="hint">What\'s confusing, lame, overpriced, or too much work? Type whatever — chips are optional starters, not a menu.</p>',
    '<div id="cg-fb-chips"></div>',
    '<form id="cg-fb-form" action="https://formsubmit.co/' + encodeURIComponent(to) + '" method="POST">',
    '<input type="hidden" name="_subject" value="[' + product + '] human feedback">',
    '<input type="hidden" name="product" value="' + String(product).replace(/"/g, "") + '">',
    '<input type="hidden" name="page_url" value="' + String(pageUrl).replace(/"/g, "") + '">',
    '<input type="hidden" name="_captcha" value="false">',
    '<input type="hidden" name="_template" value="table">',
    '<input type="hidden" name="tags" id="cg-fb-tags" value="">',
    '<textarea name="message" required placeholder="Lay it on us…"></textarea>',
    '<input type="email" name="email" placeholder="Email only if you want a reply (optional)">',
    '<div id="cg-fb-actions"><button type="button" id="cg-fb-cancel">Nah</button><button type="submit" id="cg-fb-send">Send it</button></div>',
    '</form><p id="cg-fb-done">Hell yeah — thanks. That helps more than a sale.</p>',
    "</div>"
  ].join("");
  document.body.appendChild(backdrop);

  var chipBox = backdrop.querySelector("#cg-fb-chips");
  var selected = [];
  chips.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = c;
    b.addEventListener("click", function () {
      var i = selected.indexOf(c);
      if (i >= 0) { selected.splice(i, 1); b.classList.remove("on"); }
      else { selected.push(c); b.classList.add("on"); }
      backdrop.querySelector("#cg-fb-tags").value = selected.join(", ");
    });
    chipBox.appendChild(b);
  });

  function open() {
    nudge.classList.remove("show");
    backdrop.classList.add("open");
    backdrop.querySelector("textarea").focus();
  }
  function close() { backdrop.classList.remove("open"); }
  btn.addEventListener("click", open);
  nudge.addEventListener("click", open);
  backdrop.querySelector("#cg-fb-cancel").addEventListener("click", close);
  backdrop.addEventListener("click", function (e) { if (e.target === backdrop) close(); });

  // Soft question nudge after ~8s (not auto-open modal)
  setTimeout(function () {
    if (!backdrop.classList.contains("open")) nudge.classList.add("show");
  }, 8000);
  setTimeout(function () { nudge.classList.remove("show"); }, 20000);
})();
