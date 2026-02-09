/**
 * We Diet Blog - Internationalization (i18n) Engine
 * Translates blog UI, article titles, categories, and meta tags.
 * Shares language preference with the app via localStorage key "preferredLanguage".
 * Article body translation is delegated to Google Translate.
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['ja', 'en', 'zh-CN', 'ko', 'es'];
  var DEFAULT_LANG = 'ja';
  var LS_KEY = 'preferredLanguage';
  var currentLang = DEFAULT_LANG;
  var translations = null;
  var affiliateData = null;
  var isLoadingTranslations = false;
  var originalMeta = null;

  /** Save original text of an element before translation */
  function saveOriginalText(el) {
    if (!el.hasAttribute('data-original-text')) {
      el.setAttribute('data-original-text', el.textContent);
    }
  }

  /** Save original href of an element before translation */
  function saveOriginalHref(el) {
    if (!el.hasAttribute('data-original-href')) {
      el.setAttribute('data-original-href', el.getAttribute('href'));
    }
  }

  /** Restore all elements to their original Japanese text */
  function restoreOriginals() {
    var textEls = document.querySelectorAll('[data-original-text]');
    for (var i = 0; i < textEls.length; i++) {
      textEls[i].textContent = textEls[i].getAttribute('data-original-text');
    }
    var hrefEls = document.querySelectorAll('[data-original-href]');
    for (var j = 0; j < hrefEls.length; j++) {
      hrefEls[j].setAttribute('href', hrefEls[j].getAttribute('data-original-href'));
    }
    if (originalMeta) {
      document.title = originalMeta.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', originalMeta.description);
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', originalMeta.ogTitle);
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', originalMeta.ogDescription);
    }
    document.documentElement.lang = 'ja';
  }

  /**
   * Detect language: localStorage > navigator.languages > default
   */
  function detectLanguage() {
    var stored = localStorage.getItem(LS_KEY);
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
      return stored;
    }
    var navLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
    for (var i = 0; i < navLangs.length; i++) {
      var lang = navLangs[i];
      if (SUPPORTED_LANGS.indexOf(lang) !== -1) return lang;
      // Check zh-CN variants
      if (lang === 'zh' || lang.indexOf('zh-CN') === 0 || lang.indexOf('zh-Hans') === 0) return 'zh-CN';
      // Check base language
      var base = lang.split('-')[0];
      if (base === 'en') return 'en';
      if (base === 'ko') return 'ko';
      if (base === 'es') return 'es';
      if (base === 'ja') return 'ja';
    }
    return DEFAULT_LANG;
  }

  /**
   * Load translations JSON for specific language
   */
  function loadTranslations(lang, callback) {
    // Japanese is the default, no need to load translations
    if (lang === DEFAULT_LANG) {
      translations = {};
      callback(null);
      return;
    }

    var script = document.currentScript || document.querySelector('script[src*="blog-i18n"]');
    var basePath = script ? script.src.replace(/js\/blog-i18n\.js.*$/, '') : '/blog/';
    var url = basePath + 'i18n/blog-translations-' + lang + '.json';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            translations = JSON.parse(xhr.responseText);
            callback(null);
          } catch (e) {
            callback(e);
          }
        } else {
          callback(new Error('Failed to load translations: ' + xhr.status));
        }
      }
    };
    xhr.send();
  }

  /**
   * Apply translations to the page
   */
  function applyTranslations(lang) {
    // Save original meta values before first translation
    if (!originalMeta) {
      var md = document.querySelector('meta[name="description"]');
      var ot = document.querySelector('meta[property="og:title"]');
      var od = document.querySelector('meta[property="og:description"]');
      originalMeta = {
        title: document.title,
        description: md ? md.getAttribute('content') : '',
        ogTitle: ot ? ot.getAttribute('content') : '',
        ogDescription: od ? od.getAttribute('content') : ''
      };
    }

    // Restore all elements to original Japanese text first
    restoreOriginals();

    // For Japanese (default), restoration is sufficient
    if (!translations || lang === DEFAULT_LANG) return;

    var uiData = translations.ui;
    var sectionData = translations.sections;
    var categoryData = translations.categories;
    var articleData = translations.articles;
    var metaData = translations.meta;

    // 1. Translate [data-i18n] elements
    if (uiData) {
      var elements = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-i18n');
        if (uiData[key]) {
          saveOriginalText(elements[i]);
          elements[i].textContent = uiData[key];
        }
      }
    }

    // 2. Translate section titles [data-i18n-section]
    if (sectionData) {
      var sectionElements = document.querySelectorAll('[data-i18n-section]');
      for (var j = 0; j < sectionElements.length; j++) {
        var sectionKey = sectionElements[j].getAttribute('data-i18n-section');
        if (sectionData[sectionKey]) {
          saveOriginalText(sectionElements[j]);
          sectionElements[j].textContent = sectionData[sectionKey];
        }
      }
    }

    // 3. Translate article titles
    if (articleData) {
      // Featured articles
      var featuredTitles = document.querySelectorAll('.featured-title');
      for (var k = 0; k < featuredTitles.length; k++) {
        var featuredLink = featuredTitles[k].closest('a');
        if (featuredLink) {
          var featuredHref = featuredLink.getAttribute('href');
          if (articleData[featuredHref]) {
            saveOriginalText(featuredTitles[k]);
            featuredTitles[k].textContent = articleData[featuredHref];
          }
        }
      }

      // Regular articles
      var articleTitles = document.querySelectorAll('.article-title');
      for (var l = 0; l < articleTitles.length; l++) {
        var articleLink = articleTitles[l].closest('a');
        if (articleLink) {
          var articleHref = articleLink.getAttribute('href');
          if (articleData[articleHref]) {
            saveOriginalText(articleTitles[l]);
            articleTitles[l].textContent = articleData[articleHref];
          }
        }
      }
    }

    // 4. Translate categories
    if (categoryData) {
      var categoryElements = document.querySelectorAll('.featured-category, .article-category');
      for (var m = 0; m < categoryElements.length; m++) {
        var originalCategory = categoryElements[m].textContent.trim();
        if (categoryData[originalCategory]) {
          saveOriginalText(categoryElements[m]);
          categoryElements[m].textContent = categoryData[originalCategory];
        }
      }
    }

    // 5. Translate featured excerpts
    if (uiData) {
      var excerpts = document.querySelectorAll('.featured-excerpt[data-i18n-excerpt]');
      for (var n = 0; n < excerpts.length; n++) {
        var excerptKey = excerpts[n].getAttribute('data-i18n-excerpt');
        if (uiData[excerptKey]) {
          saveOriginalText(excerpts[n]);
          excerpts[n].textContent = uiData[excerptKey];
        }
      }
    }

    // 6. Update meta tags
    if (metaData) {
      if (metaData.title) {
        document.title = metaData.title;
        var ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', metaData.title);
      }
      if (metaData.description) {
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', metaData.description);
        var ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', metaData.description);
      }
    }

    // 7. Update <html lang>
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-Hans' : lang;
  }

  /**
   * Load affiliate translations JSON for specific language
   */
  function loadAffiliateTranslations(lang, callback) {
    // Japanese is the default, no need to load translations
    if (lang === DEFAULT_LANG) {
      affiliateData = {};
      callback(null);
      return;
    }

    var script = document.currentScript || document.querySelector('script[src*="blog-i18n"]');
    var basePath = script ? script.src.replace(/js\/blog-i18n\.js.*$/, '') : '/blog/';
    var url = basePath + 'i18n/affiliate-translations-' + lang + '.json';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            affiliateData = JSON.parse(xhr.responseText);
            callback(null);
          } catch (e) {
            callback(e);
          }
        } else {
          callback(new Error('Failed to load affiliate translations: ' + xhr.status));
        }
      }
    };
    xhr.send();
  }

  /**
   * Apply affiliate link translations
   * Transforms Amazon affiliate links and product names based on language
   */
  function applyAffiliateTranslations(lang) {
    if (!affiliateData || lang === DEFAULT_LANG) return;

    var domainConfig = affiliateData.domains;
    var keywordData = affiliateData.keywords;
    var productNameData = affiliateData.productNames;

    if (!domainConfig || !keywordData) return;

    var buttons = document.querySelectorAll('.affiliate-button');
    for (var i = 0; i < buttons.length; i++) {
      var href = buttons[i].getAttribute('href') || '';
      // Extract keyword from URL: amazon.co.jp/s?k=[keyword]&tag=...
      var kMatch = href.match(/[?&]k=([^&]+)/);
      if (!kMatch) continue;

      var originalKeyword = decodeURIComponent(kMatch[1].replace(/\+/g, ' '));
      var translatedKeyword = keywordData[originalKeyword];
      if (!translatedKeyword) continue;

      // Build new URL
      var newUrl = 'https://www.' + domainConfig.domain + '/s?k=' + encodeURIComponent(translatedKeyword);
      if (domainConfig.tag) {
        newUrl += '&tag=' + domainConfig.tag;
      }
      saveOriginalHref(buttons[i]);
      buttons[i].setAttribute('href', newUrl);

      // Translate product name (h4) in the same card
      if (productNameData) {
        var card = buttons[i].closest('.affiliate-card');
        if (card) {
          var h4 = card.querySelector('h4');
          if (h4) {
            var originalName = h4.textContent.trim();
            if (productNameData[originalName]) {
              saveOriginalText(h4);
              h4.textContent = productNameData[originalName];
            }
          }
        }
      }
    }
  }

  /**
   * Switch language dynamically without page reload
   */
  function switchLanguage(newLang, button, langNames) {
    if (newLang === currentLang) return;

    isLoadingTranslations = true;

    // Update button to show loading state
    var originalButtonText = button.innerHTML;
    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Loading...';
    button.disabled = true;

    // Load translations for new language
    loadTranslations(newLang, function (err) {
      if (err) {
        console.warn('[blog-i18n] Failed to load translations:', err);
        button.innerHTML = originalButtonText;
        button.disabled = false;
        isLoadingTranslations = false;
        return;
      }

      // Apply translations
      applyTranslations(newLang);

      // Update <html lang>
      document.documentElement.lang = newLang === 'zh-CN' ? 'zh-Hans' : newLang;

      // Load and apply affiliate translations if needed
      var hasAffiliateLinks = document.querySelector('.affiliate-button');
      if (hasAffiliateLinks) {
        loadAffiliateTranslations(newLang, function (affErr) {
          if (!affErr) {
            applyAffiliateTranslations(newLang);
          }
          finalizeSwitching();
        });
      } else {
        finalizeSwitching();
      }

      function finalizeSwitching() {
        // Update button text
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> ' + langNames[newLang];
        button.disabled = false;

        // Update active state in dropdown
        var options = document.querySelectorAll('.lang-option');
        for (var i = 0; i < options.length; i++) {
          options[i].classList.remove('active');
          if (options[i].getAttribute('data-lang') === newLang) {
            options[i].classList.add('active');
          }
        }

        // Update current language
        currentLang = newLang;
        isLoadingTranslations = false;

        // Update or show translate banner for article pages
        var existingBanner = document.querySelector('.translate-banner');
        if (existingBanner) {
          existingBanner.remove();
        }
        if (newLang !== DEFAULT_LANG) {
          showTranslateBanner(newLang);
        }
      }
    });
  }

  /**
   * Create language switcher dropdown
   */
  function createLanguageSwitcher(currentLang) {
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    var langNames = {
      'ja': '日本語',
      'en': 'English',
      'zh-CN': '中文(简体)',
      'ko': '한국어',
      'es': 'Español'
    };

    var switcher = document.createElement('div');
    switcher.className = 'lang-switcher';

    var button = document.createElement('button');
    button.className = 'lang-switcher-btn';
    button.setAttribute('aria-label', 'Language');
    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> ' + langNames[currentLang];

    var dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    dropdown.style.display = 'none';

    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      var lang = SUPPORTED_LANGS[i];
      var option = document.createElement('a');
      option.href = '#';
      option.className = 'lang-option' + (lang === currentLang ? ' active' : '');
      option.setAttribute('data-lang', lang);
      option.textContent = langNames[lang];
      option.addEventListener('click', (function (selectedLang) {
        return function (e) {
          e.preventDefault();

          // Prevent multiple simultaneous language switches
          if (isLoadingTranslations) return;

          localStorage.setItem(LS_KEY, selectedLang);
          switchLanguage(selectedLang, button, langNames);
        };
      })(lang));
      dropdown.appendChild(option);
    }

    button.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', function () {
      dropdown.style.display = 'none';
    });

    switcher.appendChild(button);
    switcher.appendChild(dropdown);
    headerInner.appendChild(switcher);
  }

  /**
   * Show Google Translate banner on article pages (not index)
   */
  function showTranslateBanner(lang) {
    // Only show on individual article pages (pages with .content or .article-body)
    var isArticlePage = document.querySelector('.content, .article-body, .blog-article');
    var isIndexPage = document.querySelector('.article-grid, .featured');
    if (!isArticlePage || isIndexPage) return;

    var uiData = translations && translations.ui && translations.ui[lang];
    var bannerText = uiData && uiData.translateBanner || 'This article can be translated with Google Translate';
    var buttonText = uiData && uiData.translateButton || 'Read with Google Translate';

    var banner = document.createElement('div');
    banner.className = 'translate-banner';
    banner.innerHTML =
      '<div class="translate-banner-inner">' +
      '<span class="translate-banner-text">' + bannerText + '</span>' +
      '<a href="https://translate.google.com/translate?sl=ja&tl=' + (lang === 'zh-CN' ? 'zh-CN' : lang) +
      '&u=' + encodeURIComponent(window.location.href) +
      '" target="_blank" rel="noopener" class="translate-banner-btn">' + buttonText + '</a>' +
      '<button class="translate-banner-close" aria-label="Close">&times;</button>' +
      '</div>';

    banner.querySelector('.translate-banner-close').addEventListener('click', function () {
      banner.style.display = 'none';
      sessionStorage.setItem('translateBannerDismissed', '1');
    });

    if (!sessionStorage.getItem('translateBannerDismissed')) {
      var articleHeader = document.querySelector('.article-header, .content h1, h1');
      if (articleHeader && articleHeader.parentNode) {
        articleHeader.parentNode.insertBefore(banner, articleHeader.nextSibling);
      } else {
        document.body.insertBefore(banner, document.body.firstChild);
      }
    }
  }

  /**
   * Inject CSS for language switcher and translate banner
   */
  function injectStyles() {
    var css = '' +
      '.lang-switcher{position:relative;margin-left:auto}' +
      '.lang-switcher-btn{display:flex;align-items:center;gap:6px;background:none;border:1px solid rgba(255,255,255,.3);color:inherit;padding:6px 12px;border-radius:20px;cursor:pointer;font-size:13px;white-space:nowrap;transition:border-color .2s}' +
      '.lang-switcher-btn:hover{border-color:rgba(255,255,255,.6)}' +
      '.lang-switcher-btn svg{flex-shrink:0}' +
      '.lang-dropdown{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:140px;z-index:1000;overflow:hidden}' +
      '.lang-option{display:block;padding:10px 16px;color:#333;text-decoration:none;font-size:14px;transition:background .2s}' +
      '.lang-option:hover{background:#f0f0f0}' +
      '.lang-option.active{background:#e8f0fe;color:#1a73e8;font-weight:600}' +
      '.translate-banner{background:linear-gradient(135deg,#e8f4fd,#d1ecf9);border-bottom:1px solid #b8daff;padding:12px 0;text-align:center}' +
      '.translate-banner-inner{display:flex;align-items:center;justify-content:center;gap:12px;max-width:800px;margin:0 auto;padding:0 16px;flex-wrap:wrap}' +
      '.translate-banner-text{color:#0c5460;font-size:14px}' +
      '.translate-banner-btn{display:inline-block;background:#1a73e8;color:#fff;padding:6px 16px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:500;transition:background .2s}' +
      '.translate-banner-btn:hover{background:#1557b0}' +
      '.translate-banner-close{background:none;border:none;color:#0c5460;font-size:20px;cursor:pointer;padding:0 4px;line-height:1}' +
      '@media(max-width:768px){' +
      '.lang-switcher-btn{padding:5px 10px;font-size:12px}' +
      '.translate-banner-inner{flex-direction:column;gap:8px}' +
      '}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Initialize i18n
   */
  function init() {
    var lang = detectLanguage();
    currentLang = lang;

    // Listen for dynamic content rendering (blog-renderer.js, blog-category.js)
    document.addEventListener('blog:rendered', function () {
      if (translations && currentLang !== DEFAULT_LANG) {
        applyTranslations(currentLang);
      }
    });

    // Inject styles first
    injectStyles();

    // Skip translation loading if Japanese (default)
    if (lang === DEFAULT_LANG) {
      // Still show language switcher for Japanese users who might want other languages
      loadTranslations(lang, function (err) {
        if (!err) {
          createLanguageSwitcher(lang);
        }
      });
      return;
    }

    // Load translations for non-default language
    loadTranslations(lang, function (err) {
      if (err) {
        console.warn('[blog-i18n] Failed to load translations:', err);
        return;
      }
      applyTranslations(lang);
      createLanguageSwitcher(lang);
      showTranslateBanner(lang);

      // Load and apply affiliate translations for article pages
      var hasAffiliateLinks = document.querySelector('.affiliate-button');
      if (hasAffiliateLinks) {
        loadAffiliateTranslations(lang, function (affErr) {
          if (!affErr) {
            applyAffiliateTranslations(lang);
          }
        });
      }
    });
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
