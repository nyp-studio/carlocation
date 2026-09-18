(function () {
  var KEY = "carlocation-lang";

  function basePath() {
    var el = document.querySelector("base");
    var href = (el && el.getAttribute("href")) || "/carlocation/";
    return href.replace(/\/+$/, "") || "";
  }

  function normalizePath(pathname) {
    return pathname.replace(/\/index\.html$/i, "/").replace(/\/+$/, "") || "/";
  }

  function isEnglishPath(pathname) {
    return /\/en(?:\/|$)/.test(pathname);
  }

  function pageKind(pathname) {
    return /privacy\.html$/i.test(pathname) ? "privacy" : "support";
  }

  function urlFor(lang, kind) {
    var root = basePath();
    var file = kind === "privacy" ? "privacy.html" : "";
    return lang === "en" ? root + "/en/" + file : root + "/" + file;
  }

  function browserPrefersEnglish() {
    var list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || ""];
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i] || "").toLowerCase();
      if (tag === "en" || tag.indexOf("en-") === 0) return true;
      if (tag === "ko" || tag.indexOf("ko-") === 0) return false;
    }
    return false;
  }

  function readPref() {
    try {
      return localStorage.getItem(KEY);
    } catch (err) {
      return null;
    }
  }

  function writePref(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (err) {}
  }

  var path = location.pathname;
  var current = isEnglishPath(path) ? "en" : "ko";
  var kind = pageKind(path);
  var saved = readPref();
  var target = null;

  if (saved === "en" || saved === "ko") {
    if (saved !== current) target = saved;
  } else if (browserPrefersEnglish() && current !== "en") {
    target = "en";
  }

  if (target) {
    var next = urlFor(target, kind);
    if (normalizePath(path) !== normalizePath(next)) {
      location.replace(next);
      return;
    }
  }

  document.addEventListener("click", function (event) {
    var el = event.target;
    if (!el) return;
    if (el.nodeType !== 1) el = el.parentElement;
    var link = el && el.closest ? el.closest("a[data-lang]") : null;
    if (!link) return;
    writePref(link.getAttribute("data-lang"));
  });
})();
