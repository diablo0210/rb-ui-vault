// ==========================================================================
// RED BANANA UNIVERSAL CIRCULAR STAMP WIDGET (rb-stamp.js)
// Drop-in standard widget for all Red Banana websites:
// 1. Bilingual Toggle: English (EN) / Hindi (हिं)
// 2. Theme Toggle: Dark Mode / Light Mode
// 3. Render Quality Toggle: HD 3D Mode / Lite Fast Mode
// 4. Accessibility Suite: Font Scale (100% / 115% / 130%), High Contrast,
//    Underline Links, and Reduced Motion.
// Strictly zero external dependencies and zero em/en-dashes.
// ==========================================================================

(function () {
  const STORAGE_KEY = "rb_universal_stamp_v1";

  const DEFAULT_STATE = {
    lang: "en",          // "en" | "hi"
    theme: "dark",       // "dark" | "light"
    quality: "hd",       // "hd" | "lite"
    fontScale: "100",    // "100" | "115" | "130"
    contrast: "normal",  // "normal" | "high"
    links: "normal",     // "normal" | "underline"
    motion: "normal",    // "normal" | "reduced"
    pos: "bottom-right"  // "bottom-right" | "bottom-left"
  };

  // Built-in bilingual phrase dictionary so any host page gets automatic Hindi UI translation
  // in addition to explicit [data-rb-hi] / [data-hi] attributes.
  const BUILTIN_HI_MAP = {
    "All Categories": "सभी श्रेणियां",
    "Handicrafts": "हस्तशिल्प",
    "Textiles": "हथकरघा",
    "Masterclasses": "मास्टरक्लास",
    "Gifts Under Rs 2,500": "रु 2,500 से कम उपहार",
    "Clear": "हटाएं",
    "Search": "खोजें",
    "3D Wall & Drape": "3D दीवार और ड्रेप",
    "Room Studio": "रूम स्टूडियो",
    "Curated Ideas": "चुनिंदा सूचियां",
    "Cart": "कार्ट",
    "All Heritage (12)": "सभी धरोहर (12)",
    "Today's Express Deals": "आज के एक्सप्रेस ऑफ़र",
    "Under Rs 2,500 Store": "रु 2,500 से कम स्टोर",
    "Fine Art & Crafts (5)": "कला और हस्तशिल्प (5)",
    "GI Textiles (4)": "GI हथकरघा (4)",
    "Live Masterclasses & Kits (3)": "लाइव मास्टरक्लास और किट (3)",
    "Collector Vault": "कलेक्टर वॉल्ट",
    "EXPRESS 24-HR DISPATCH": "24-घंटे एक्सप्रेस डिस्पैच",
    "80%+ CREATOR PAYOUT (SAMPLE)": "80%+ कलाकार आय हिस्सा (नमूना)",
    "Authentic Indian Crafts, Textiles & Live Workshops. Built for One-Tap Buying.": "प्रामाणिक भारतीय हस्तशिल्प, हथकरघा और लाइव मास्टरक्लास। वन-टैप खरीदारी के लिए निर्मित।",
    "Filters & Departments (Price, Cluster, Express)": "फ़िल्टर और विभाग (मूल्य, राज्य, एक्सप्रेस)",
    "Shop Under Rs 2,500 Store": "रु 2,500 से कम स्टोर देखें",
    "View 24-Hr Express Deals": "24-घंटे एक्सप्रेस डील देखें",
    "Explore Live Masterclasses": "लाइव मास्टरक्लास देखें",
    "Inspect Spec & Buy Box": "विवरण और बाय-बॉक्स देखें",
    "Preview Kit & Book Seat": "किट देखें और सीट बुक करें",
    "Department & Filters": "विभाग और फ़िल्टर",
    "Reset All": "सब रीसेट करें",
    "Price Tier": "मूल्य श्रेणी",
    "All Price Tiers (12)": "सभी मूल्य श्रेणियां (12)",
    "Under Rs 2,500 (Everyday & Gifts)": "रु 2,500 से कम (उपहार)",
    "Rs 2,500 to Rs 7,500 (Originals)": "रु 2,500 से रु 7,500 (मौलिक कृतियां)",
    "Rs 7,500 to Rs 25,000 (Heirloom)": "रु 7,500 से रु 25,000 (धरोहर)",
    "Rs 25,000+ (Collector Vault)": "रु 25,000+ (कलेक्टर वॉल्ट)",
    "Delivery & Ratings": "डिलीवरी और रेटिंग",
    "24-Hr Express Dispatch": "24-घंटे एक्सप्रेस डिस्पैच",
    "4.8 Stars & Up (Sample)": "4.8 स्टार और ऊपर (नमूना)",
    "Craft Cluster / State": "शिल्प क्लस्टर / राज्य",
    "Room / Buying Intent": "कमरा / खरीदारी उद्देश्य",
    "Sort by:": "क्रमबद्ध करें:",
    "Featured": "विशेष रुप से प्रदर्शित",
    "Price: Low to High": "मूल्य: कम से अधिक",
    "Price: High to Low": "मूल्य: अधिक से कम",
    "Highest Creator Share": "सर्वाधिक कलाकार हिस्सा",
    "Add to Cart": "कार्ट में जोड़ें",
    "Buy Now (UPI)": "अभी खरीदें (UPI)",
    "Try on Wall": "दीवार पर परखें",
    "Provenance Spec": "प्रामाणिकता विवरण",
    "Back to top": "शीर्ष पर वापस जाएं",
    "Close [X]": "बंद करें [X]",
    "Buy Now with 1-Tap UPI": "1-टैप UPI से अभी खरीदें",
    "Pay via GPay / PhonePe": "GPay / PhonePe से भुगतान करें",
    "Paytm / BHIM UPI": "Paytm / BHIM UPI",
    "Card / No-Cost EMI": "कार्ड / नो-कॉस्ट EMI",
    "Global NRI Checkout": "ग्लोबल NRI चेकआउट"
  };

  class RedBananaUniversalStamp {
    constructor() {
      this.state = this.loadState();
      this.isOpen = false;
      this.init();
    }

    defaultState() {
      const fresh = Object.assign({}, DEFAULT_STATE);
      try {
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          fresh.motion = "reduced";
        }
      } catch (e) {}
      return fresh;
    }

    loadState() {
      const fallback = this.defaultState();
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return Object.assign({}, fallback, JSON.parse(raw));
        }
      } catch (e) {
        // Ignore storage errors in restricted contexts
      }
      return fallback;
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        // Ignore storage errors
      }
    }

    init() {
      this.mountWidget();
      this.applyAllStates();
    }

    mountWidget() {
      if (document.getElementById("rbUniversalStampRoot")) return;

      const root = document.createElement("aside");
      root.id = "rbUniversalStampRoot";
      root.className = "rb-stamp-root";
      root.setAttribute("aria-label", "Red Banana Universal Experience Stamp");
      root.setAttribute("data-pos", this.state.pos);

      root.innerHTML = `
        <button
          type="button"
          class="rb-stamp-trigger"
          id="rbStampTriggerBtn"
          aria-expanded="false"
          aria-controls="rbStampPod"
          title="Red Banana Standard Stamp: Language, Theme, HD/Lite & Accessibility"
        >
          <span class="rb-stamp-status-dot" id="rbStampStatusDot"></span>
          <span class="rb-stamp-monogram">RB</span>
          <span class="rb-stamp-sublabel" id="rbTriggerBadge">EN|HD</span>
        </button>

        <div class="rb-stamp-pod rb-hidden" id="rbStampPod" role="dialog" aria-label="Red Banana Experience Controls">
          <div class="rb-pod-header">
            <div class="rb-pod-brand">
              <div class="rb-pod-seal">RB</div>
              <div>
                <strong class="rb-pod-title" id="rbPodHeading">Red Banana Standard Stamp</strong>
                <span class="rb-pod-subtitle" id="rbPodSubheading">Language | Theme | HD/Lite | A11y</span>
              </div>
            </div>
            <button type="button" class="rb-pod-close" id="rbStampCloseBtn" aria-label="Close Red Banana Stamp">
              Close
            </button>
          </div>

          <div class="rb-quadrant-grid">
            <button type="button" class="rb-quad-btn" id="rbLangToggleBtn">
              <span class="rb-quad-kicker">1. Language / भाषा</span>
              <strong class="rb-quad-val" id="rbLangVal">English (EN)</strong>
            </button>

            <button type="button" class="rb-quad-btn" id="rbThemeToggleBtn">
              <span class="rb-quad-kicker">2. Color Mode</span>
              <strong class="rb-quad-val" id="rbThemeVal">Dark Mode</strong>
            </button>

            <button type="button" class="rb-quad-btn" id="rbQualityToggleBtn">
              <span class="rb-quad-kicker">3. Render Engine</span>
              <strong class="rb-quad-val" id="rbQualityVal">HD 3D Mode</strong>
            </button>

            <button type="button" class="rb-quad-btn" id="rbPosToggleBtn">
              <span class="rb-quad-kicker">4. Stamp Corner</span>
              <strong class="rb-quad-val" id="rbPosVal">Bottom Right</strong>
            </button>
          </div>

          <div class="rb-a11y-box">
            <span class="rb-a11y-label" id="rbScaleLabel">Text Size / Accessibility (A11y)</span>
            <div class="rb-scale-row" id="rbScaleRow">
              <button type="button" class="rb-scale-btn active" data-scale="100">100% Default</button>
              <button type="button" class="rb-scale-btn" data-scale="115">115% Large</button>
              <button type="button" class="rb-scale-btn" data-scale="130">130% Extra</button>
            </div>

            <div class="rb-a11y-toggles-grid">
              <button type="button" class="rb-a11y-chip" id="rbContrastBtn" aria-pressed="false">
                High Contrast
              </button>
              <button type="button" class="rb-a11y-chip" id="rbLinksBtn" aria-pressed="false">
                Underline Links
              </button>
              <button type="button" class="rb-a11y-chip" id="rbMotionBtn" aria-pressed="false">
                Reduced Motion
              </button>
              <button type="button" class="rb-a11y-chip" id="rbResetBtn" aria-pressed="false">
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(root);
      this.bindEvents();
    }

    bindEvents() {
      const trigger = document.getElementById("rbStampTriggerBtn");
      const closeBtn = document.getElementById("rbStampCloseBtn");
      const root = document.getElementById("rbUniversalStampRoot");

      let dragStartX = 0;
      let dragStartY = 0;
      let moved = false;
      let isDragging = false;

      trigger.addEventListener("pointerdown", (e) => {
        isDragging = true;
        moved = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      });

      window.addEventListener("pointermove", (e) => {
        if (!isDragging || !root) return;
        const dx = Math.abs(e.clientX - dragStartX);
        const dy = Math.abs(e.clientY - dragStartY);
        if (dx > 8 || dy > 8) {
          moved = true;
          this.state.pos = e.clientX < window.innerWidth / 2 ? "bottom-left" : "bottom-right";
          root.setAttribute("data-pos", this.state.pos);
        }
      });

      window.addEventListener("pointerup", () => {
        if (isDragging && moved) {
          this.saveState();
          this.updatePodUI();
        }
        isDragging = false;
      });

      trigger.addEventListener("click", () => {
        if (moved) {
          moved = false;
          return;
        }
        this.togglePod(!this.isOpen);
      });

      closeBtn.addEventListener("click", () => {
        this.togglePod(false);
      });

      document.getElementById("rbLangToggleBtn").addEventListener("click", () => {
        this.state.lang = this.state.lang === "en" ? "hi" : "en";
        this.saveState();
        this.applyAllStates();
      });

      document.getElementById("rbThemeToggleBtn").addEventListener("click", () => {
        this.state.theme = this.state.theme === "dark" ? "light" : "dark";
        this.saveState();
        this.applyAllStates();
      });

      document.getElementById("rbQualityToggleBtn").addEventListener("click", () => {
        this.state.quality = this.state.quality === "hd" ? "lite" : "hd";
        this.saveState();
        this.applyAllStates();
      });

      document.getElementById("rbPosToggleBtn").addEventListener("click", () => {
        this.state.pos = this.state.pos === "bottom-right" ? "bottom-left" : "bottom-right";
        this.saveState();
        this.applyAllStates();
      });

      document.querySelectorAll("#rbScaleRow .rb-scale-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.state.fontScale = btn.dataset.scale;
          this.saveState();
          this.applyAllStates();
        });
      });

      document.getElementById("rbContrastBtn").addEventListener("click", () => {
        this.state.contrast = this.state.contrast === "high" ? "normal" : "high";
        this.saveState();
        this.applyAllStates();
      });

      document.getElementById("rbLinksBtn").addEventListener("click", () => {
        this.state.links = this.state.links === "underline" ? "normal" : "underline";
        this.saveState();
        this.applyAllStates();
      });

      document.getElementById("rbMotionBtn").addEventListener("click", () => {
        this.state.motion = this.state.motion === "reduced" ? "normal" : "reduced";
        this.saveState();
        this.applyAllStates();
      });

      document.getElementById("rbResetBtn").addEventListener("click", () => {
        this.state = this.defaultState();
        this.saveState();
        this.applyAllStates();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.togglePod(false);
          if (trigger) {
            trigger.focus();
          }
        }
      });
    }

    togglePod(openState) {
      this.isOpen = openState;
      const pod = document.getElementById("rbStampPod");
      const trigger = document.getElementById("rbStampTriggerBtn");
      if (!pod || !trigger) return;
      pod.classList.toggle("rb-hidden", !this.isOpen);
      trigger.setAttribute("aria-expanded", String(this.isOpen));
    }

    applyAllStates() {
      const html = document.documentElement;
      html.setAttribute("lang", this.state.lang);
      html.setAttribute("data-rb-lang", this.state.lang);
      html.setAttribute("data-rb-theme", this.state.theme);
      html.setAttribute("data-rb-quality", this.state.quality);
      html.setAttribute("data-rb-font-scale", this.state.fontScale);
      html.setAttribute("data-rb-contrast", this.state.contrast);
      html.setAttribute("data-rb-links", this.state.links);
      html.setAttribute("data-rb-motion", this.state.motion);
      html.classList.toggle("rb-reduced-motion", this.state.motion === "reduced");

      window.__RB_STAMP_STATE__ = Object.assign({}, this.state);
      window.__RB_LITE_MODE__ = this.state.quality === "lite";

      const root = document.getElementById("rbUniversalStampRoot");
      if (root) {
        root.setAttribute("data-pos", this.state.pos);
      }

      // Pause or resume background videos based on HD vs Lite / Reduced Motion mode
      document.querySelectorAll("video").forEach((vid) => {
        try {
          if (this.state.quality === "lite" || this.state.motion === "reduced") {
            vid.pause();
          } else if (vid.autoplay) {
            vid.play().catch(() => {});
          }
        } catch (e) {}
      });

      this.updatePodUI();
      this.applyLanguageToDOM();

      window.dispatchEvent(
        new CustomEvent("rb:stampchange", {
          detail: Object.assign({}, this.state, {
            reducedMotion: this.state.motion === "reduced"
          })
        })
      );
    }

    updatePodUI() {
      const isHi = this.state.lang === "hi";
      const badge = document.getElementById("rbTriggerBadge");
      if (badge) {
        badge.textContent =
          (isHi ? "हिं" : "EN") + "|" + (this.state.quality === "hd" ? "HD" : "LT");
      }

      const langVal = document.getElementById("rbLangVal");
      if (langVal) {
        langVal.textContent = isHi ? "हिन्दी (HI)" : "English (EN)";
      }
      const langBtn = document.getElementById("rbLangToggleBtn");
      if (langBtn) langBtn.setAttribute("data-active", String(isHi));

      const themeVal = document.getElementById("rbThemeVal");
      if (themeVal) {
        themeVal.textContent =
          this.state.theme === "dark"
            ? isHi ? "डार्क मोड (Dark)" : "Dark Mode"
            : isHi ? "लाइट मोड (Light)" : "Light Mode";
      }
      const themeBtn = document.getElementById("rbThemeToggleBtn");
      if (themeBtn) themeBtn.setAttribute("data-active", String(this.state.theme === "light"));

      const qualityVal = document.getElementById("rbQualityVal");
      if (qualityVal) {
        qualityVal.textContent =
          this.state.quality === "hd"
            ? isHi ? "HD 3D संस्करण" : "HD 3D Mode"
            : isHi ? "लाइट तेज़ मोड" : "Lite Fast Mode";
      }
      const qualityBtn = document.getElementById("rbQualityToggleBtn");
      if (qualityBtn) qualityBtn.setAttribute("data-active", String(this.state.quality === "lite"));

      const posVal = document.getElementById("rbPosVal");
      if (posVal) {
        posVal.textContent =
          this.state.pos === "bottom-right"
            ? isHi ? "दायां कोना (Right)" : "Bottom Right"
            : isHi ? "बायां कोना (Left)" : "Bottom Left";
      }

      document.querySelectorAll("#rbScaleRow .rb-scale-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.scale === this.state.fontScale);
      });

      const contrastBtn = document.getElementById("rbContrastBtn");
      if (contrastBtn) {
        contrastBtn.setAttribute("aria-pressed", String(this.state.contrast === "high"));
      }
      const linksBtn = document.getElementById("rbLinksBtn");
      if (linksBtn) {
        linksBtn.setAttribute("aria-pressed", String(this.state.links === "underline"));
      }
      const motionBtn = document.getElementById("rbMotionBtn");
      if (motionBtn) {
        motionBtn.setAttribute("aria-pressed", String(this.state.motion === "reduced"));
      }
    }

    applyLanguageToDOM() {
      const isHi = this.state.lang === "hi";

      // 1. Explicit [data-rb-hi] or [data-hi] attributes
      document.querySelectorAll("[data-rb-hi], [data-hi]").forEach((el) => {
        const hiText = el.getAttribute("data-rb-hi") || el.getAttribute("data-hi");
        if (!hiText) return;
        if (!el.hasAttribute("data-rb-en")) {
          el.setAttribute("data-rb-en", el.textContent);
        }
        el.textContent = isHi ? hiText : el.getAttribute("data-rb-en");
      });

      // 2. Placeholders with [data-rb-hi-placeholder]
      document.querySelectorAll("[data-rb-hi-placeholder]").forEach((el) => {
        const hiPh = el.getAttribute("data-rb-hi-placeholder");
        if (!el.hasAttribute("data-rb-en-placeholder")) {
          el.setAttribute("data-rb-en-placeholder", el.getAttribute("placeholder") || "");
        }
        el.setAttribute(
          "placeholder",
          isHi ? hiPh : el.getAttribute("data-rb-en-placeholder")
        );
      });

      // 3. Automatic phrase dictionary translation for leaf UI elements
      const candidates = document.querySelectorAll("button, a, label, option, h1, h2, h3, span, strong");
      candidates.forEach((el) => {
        if (el.closest("#rbUniversalStampRoot")) return;
        if (el.children.length > 0) return;
        const current = el.textContent.trim();
        if (!current) return;

        if (isHi && BUILTIN_HI_MAP[current]) {
          el.setAttribute("data-rb-auto-en", current);
          el.textContent = BUILTIN_HI_MAP[current];
        } else if (!isHi && el.hasAttribute("data-rb-auto-en")) {
          el.textContent = el.getAttribute("data-rb-auto-en");
        }
      });
    }
  }

  function bootStamp() {
    if (!window.rbUniversalStamp) {
      window.rbUniversalStamp = new RedBananaUniversalStamp();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootStamp);
  } else {
    bootStamp();
  }
})();
