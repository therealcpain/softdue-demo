/* Conglomerate feedback FAB — include before </body>. Set window.CG_FEEDBACK = { product, pageUrl } */
(function () {
  var cfg = window.CG_FEEDBACK || {};
  var product = cfg.product || "Unknown";
  var pageUrl = cfg.pageUrl || (typeof location !== "undefined" ? location.href : "");
  var to = cfg.to || "steward@brewcityblockchain.com";
  var chips = ["Confused", "Don't like", "Bad deal", "Too much work", "Feature request", "Other"];

  var style = document.createElement("style");
  style.textContent = [
    "#cg-fb-btn{position:fixed;right:1.1rem;bottom:1.1rem;z-index:9999;width:64px;height:64px;border-radius:999px;border:0;cursor:pointer;",
    "background:#0f766e;color:#fff;box-shadow:0 8px 28px rgba(15,118,110,.45);display:flex;align-items:center;justify-content:center;",
    "transition:transform .15s ease,filter .15s ease}",
    "#cg-fb-btn:hover{transform:scale(1.06);filter:brightness(1.08)}",
    "#cg-fb-btn svg{width:30px;height:30px;display:block}",
    "#cg-fb-label{position:fixed;right:5.2rem;bottom:1.55rem;z-index:9999;background:#1c1917;color:#fff;font:700 12px/1.2 system-ui,sans-serif;",
    "padding:.45rem .7rem;border-radius:8px;pointer-events:none;opacity:.95}",
    "#cg-fb-backdrop{position:fixed;inset:0;background:rgba(28,25,23,.45);z-index:10000;display:none;align-items:flex-end;justify-content:center;padding:1rem}",
    "#cg-fb-backdrop.open{display:flex}",
    "#cg-fb-modal{background:#fff;color:#1c1917;width:min(440px,100%);border-radius:16px 16px 12px 12px;padding:1.15rem 1.15rem 1rem;",
    "box-shadow:0 20px 50px rgba(0,0,0,.25);font:15px/1.45 system-ui,sans-serif;margin-bottom:.5rem}",
    "#cg-fb-modal h2{margin:0 0 .35rem;font-size:1.15rem}",
    "#cg-fb-modal p.hint{margin:0 0 .85rem;color:#78716c;font-size:.9rem}",
    "#cg-fb-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 .75rem}",
    "#cg-fb-chips button{border:1px solid #e7e5e4;background:#fafaf9;border-radius:999px;padding:.35rem .65rem;font:600 12px system-ui;cursor:pointer}",
    "#cg-fb-chips button.on{background:#ccfbf1;border-color:#0f766e;color:#0f766e}",
    "#cg-fb-modal textarea{width:100%;min-height:110px;border:1px solid #e7e5e4;border-radius:10px;padding:.65rem;font:inherit;resize:vertical}",
    "#cg-fb-modal input[type=email]{width:100%;border:1px solid #e7e5e4;border-radius:10px;padding:.55rem .65rem;font:inherit;margin:.65rem 0}",
    "#cg-fb-actions{display:flex;gap:.5rem;justify-content:flex-end;margin-top:.75rem}",
    "#cg-fb-actions button{border:0;border-radius:10px;padding:.65rem 1rem;font:700 14px system-ui;cursor:pointer}",
    "#cg-fb-cancel{background:#f5f5f4;color:#1c1917}",
    "#cg-fb-send{background:#0f766e;color:#fff}",
    "#cg-fb-done{display:none;padding:.5rem 0 0;color:#0f766e;font-weight:700}"
  ].join("");
  document.head.appendChild(style);

  var label = document.createElement("div");
  label.id = "cg-fb-label";
  label.textContent = "Feedback";
  document.body.appendChild(label);

  var btn = document.createElement("button");
  btn.id = "cg-fb-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Send feedback — tell us anything");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-4 4v-4.5A2.5 2.5 0 0 1 4 13.5v-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  document.body.appendChild(btn);

  var backdrop = document.createElement("div");
  backdrop.id = "cg-fb-backdrop";
  backdrop.innerHTML = [
    '<div id="cg-fb-modal" role="dialog" aria-modal="true" aria-labelledby="cg-fb-title">',
    '<h2 id="cg-fb-title">Tell us anything</h2>',
    '<p class="hint">The chips below are just starter ideas — ignore them and type whatever the fuck you want. Rant, nitpick, confuse, feature wish, pricing gripe — all of it.</p>',
    '<div id="cg-fb-chips"></div>',
    '<form id="cg-fb-form" action="https://formsubmit.co/' + encodeURIComponent(to) + '" method="POST">',
    '<input type="hidden" name="_subject" value="[' + product + '] landing feedback">',
    '<input type="hidden" name="product" value="' + product.replace(/"/g, "") + '">',
    '<input type="hidden" name="page_url" value="' + String(pageUrl).replace(/"/g, "") + '">',
    '<input type="hidden" name="_captcha" value="false">',
    '<input type="hidden" name="_template" value="table">',
    '<input type="hidden" name="tags" id="cg-fb-tags" value="">',
    '<textarea name="message" required placeholder="Type anything. Seriously — chips are optional starters, not a menu."></textarea>',
    '<input type="email" name="email" placeholder="Email (optional — only if you want a reply)">',
    '<div id="cg-fb-actions"><button type="button" id="cg-fb-cancel">Close</button><button type="submit" id="cg-fb-send">Send feedback</button></div>',
    '</form><p id="cg-fb-done">Got it — thank you. This helps more than a sale.</p>',
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

  function open() { backdrop.classList.add("open"); backdrop.querySelector("textarea").focus(); }
  function close() { backdrop.classList.remove("open"); }
  btn.addEventListener("click", open);
  backdrop.querySelector("#cg-fb-cancel").addEventListener("click", close);
  backdrop.addEventListener("click", function (e) { if (e.target === backdrop) close(); });
})();
