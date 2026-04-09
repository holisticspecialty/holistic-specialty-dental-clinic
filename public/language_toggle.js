(function (global) {
  "use strict";

  var STORAGE_KEY = "site_language";
  var DEFAULT_LANG = "en";
  var TOGGLE_BTN_ID = "lang-toggle";
  var SUPPORTED = ["en", "am"];

  var currentLang = DEFAULT_LANG;

  function applyLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;

    // 1. Swap all elements with data-en / data-am
    var elements = document.querySelectorAll("[data-en]");
    elements.forEach(function (el) {
      var text = el.getAttribute("data-" + lang);
      if (text !== null && text !== undefined) {
        var allowHtml = el.getAttribute("data-allow-html") === "true";
        var hasChildElements = el.querySelector("svg, img, i, span.icon, [data-icon]");
        
        if (allowHtml) {
          el.innerHTML = text;
        } else if (hasChildElements) {
          var textNodes = [];
          el.childNodes.forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              textNodes.push(node);
            }
          });
          if (textNodes.length > 0) {
            textNodes[0].textContent = text;
          }
        } else {
          el.textContent = text;
        }
      }
    });

    // 2. Swap placeholders
    var inputs = document.querySelectorAll("[data-placeholder-en]");
    inputs.forEach(function (el) {
      var placeholder = el.getAttribute("data-placeholder-" + lang);
      if (placeholder) el.setAttribute("placeholder", placeholder);
    });

    // 3. Swap aria-labels
    var ariaEls = document.querySelectorAll("[data-aria-en]");
    ariaEls.forEach(function (el) {
      var label = el.getAttribute("data-aria-" + lang);
      if (label) el.setAttribute("aria-label", label);
    });

    // 4. Update html lang
    document.documentElement.setAttribute("lang", lang === "am" ? "am-ET" : "en");

    // 5. Apply body classes
    if (lang === "am") {
      document.body.classList.add("lang-am");
      document.body.classList.remove("lang-en");
    } else {
      document.body.classList.add("lang-en");
      document.body.classList.remove("lang-am");
    }

    // 6. Update the toggle button
    var btn = document.getElementById(TOGGLE_BTN_ID);
    if (btn) {
      var span = btn.querySelector("span");
      if (span) {
        span.textContent = lang === "en" ? "AM" : "EN";
      } else {
        btn.textContent = lang === "en" ? "AM" : "EN";
      }
      btn.setAttribute("aria-label", lang === "en" ? "Switch to Amharic" : "Switch to English");
      btn.setAttribute("data-current-lang", lang);
    }

    // 7. Persist
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // 8. Event
    var event = new CustomEvent("languageChanged", {
      detail: { language: lang },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  function swapLanguage() {
    var next = currentLang === "en" ? "am" : "en";
    applyLanguage(next);
  }

  function initLanguageToggle() {
    var saved = DEFAULT_LANG;
    try {
      saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {}
    applyLanguage(saved);

    // Watch for DOM changes (Next.js page swaps)
    if (typeof MutationObserver !== "undefined") {
      var debounceTimeout;
      var observer = new MutationObserver(function (mutations) {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(function() {
          // Re-sync currentLang from storage just in case multiple scripts are running
          try {
            var latest = localStorage.getItem(STORAGE_KEY) || currentLang;
            applyLanguage(latest);
          } catch(e) {
            applyLanguage(currentLang);
          }
        }, 150); // Small delay to let React/Next.js hydration finish
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false // Don't watch for attr changes to avoid infinite loops
      });
    }

    // Sync on back/forward
    window.addEventListener("popstate", function() {
      var saved = localStorage.getItem(STORAGE_KEY) || currentLang;
      applyLanguage(saved);
    });

    // Check again after a second just to be sure
    setTimeout(function() {
       var saved = localStorage.getItem(STORAGE_KEY) || currentLang;
       applyLanguage(saved);
    }, 1000);
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initLanguageToggle);
    } else {
      initLanguageToggle();
    }
  }

  global.swapLanguage = swapLanguage;
  global.initLanguageToggle = initLanguageToggle;
})(typeof window !== "undefined" ? window : this);
