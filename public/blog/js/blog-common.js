/**
 * We Diet Blog - Common JavaScript
 * 全ブログ記事で共通のスクリプト
 */

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-J3JE0T4ZFM');

// Load blog i18n script dynamically (for article pages that don't include it in HTML)
(function() {
  if (!document.querySelector('script[src*="blog-i18n"]')) {
    var s = document.createElement('script');
    s.src = '/blog/js/blog-i18n.js';
    s.defer = true;
    document.head.appendChild(s);
  }
})();

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  // RSSフィード自動検出タグを<head>に追加
  if (!document.querySelector('link[type="application/rss+xml"]')) {
    var rssLink = document.createElement('link');
    rssLink.rel = 'alternate';
    rssLink.type = 'application/rss+xml';
    rssLink.title = 'We Diet ブログ RSS';
    rssLink.href = '/feed.xml';
    document.head.appendChild(rssLink);
  }

  // フッターをフル版に統一（簡易フッターの場合はindex.htmlと同じ構造に差し替え）
  var footer = document.querySelector('.footer');
  if (footer && !footer.querySelector('.footer-inner')) {
    footer.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-brand">' +
          '<h3>We Diet</h3>' +
          '<p>一人じゃないから、続けられる。仲間と一緒に、楽しくダイエット。</p>' +
          '<div class="ranking-banners">' +
            '<a href="https://diet.blogmura.com/ranking/in?p_cid=11211987" target="_blank" rel="noopener"><img src="https://b.blogmura.com/diet/88_31.gif" width="88" height="31" alt="にほんブログ村 ダイエットブログへ" loading="lazy"></a>' +
            '<a href="https://blog.with2.net/link/?id=2138563" target="_blank" rel="noopener" title="人気ブログランキング"><img src="https://blog.with2.net/img/banner/banner_13.svg" width="80" height="15" alt="人気ブログランキング" loading="lazy"></a>' +
            '<a href="https://blogranking.fc2.com/in.php?id=1072821" target="_blank" rel="noopener"><img src="https://static.fc2.com/blogranking/ranking_banner/b_03.gif" alt="FC2 Blog Ranking" loading="lazy"></a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-links">' +
          '<h4>サービス</h4>' +
          '<ul>' +
            '<li><a href="/">トップページ</a></li>' +
            '<li><a href="/blog/">ブログ</a></li>' +
            '<li><a href="/faq">よくある質問</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-links">' +
          '<h4>法的情報</h4>' +
          '<ul>' +
            '<li><a href="/privacy-policy">プライバシーポリシー</a></li>' +
            '<li><a href="/terms-of-service">利用規約</a></li>' +
            '<li><a href="/cookie-policy">Cookieポリシー</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; 2025 We Diet. All rights reserved.</p>' +
      '</div>';
  }

  // Fix external images for Firefox - add referrerpolicy to prevent blocking
  document.querySelectorAll('img').forEach(function(img) {
    var src = img.src || '';
    // Check if it's an external image (Pexels, Unsplash, etc.)
    if (src.includes('pexels.com') || src.includes('unsplash.com') || src.includes('images.pexels.com') || src.includes('images.unsplash.com')) {
      img.setAttribute('referrerpolicy', 'no-referrer');
      img.setAttribute('crossorigin', 'anonymous');
    }
  });

  // Handle image load errors with fallback
  document.querySelectorAll('.affiliate-card-image img').forEach(function(img) {
    img.onerror = function() {
      // Set a placeholder background color and hide the broken image
      this.style.display = 'none';
      this.parentElement.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
      this.parentElement.innerHTML = '<span style="color: #6366f1; font-size: 24px;">📦</span>';
    };
  });
  // Translate button
  (function() {
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:flex;align-items:center;';

    var btn = document.createElement('button');
    btn.className = 'translate-btn';
    btn.setAttribute('aria-label', 'Translate this page');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>' +
      '</svg>' +
      '<span>翻訳</span>';

    var dropdown = document.createElement('div');
    dropdown.className = 'translate-dropdown';

    var languages = [
      { code: 'en', label: 'English' },
      { code: 'zh-CN', label: '中文（简体）' },
      { code: 'zh-TW', label: '中文（繁體）' },
      { code: 'ko', label: '한국어' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'pt', label: 'Português' }
    ];

    languages.forEach(function(lang) {
      var a = document.createElement('a');
      a.href = 'https://translate.google.com/translate?sl=ja&tl=' + lang.code + '&u=' + encodeURIComponent(window.location.href);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = lang.label;
      dropdown.appendChild(a);
    });

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(dropdown);
    headerInner.appendChild(wrapper);
  })();

  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Lazy loading for images (fallback for browsers without native support)
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Reading progress indicator (optional)
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // Table of contents highlight (optional)
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length > 0) {
    const headings = document.querySelectorAll('.article-content h2, .content h2');

    window.addEventListener('scroll', () => {
      let current = '';
      headings.forEach(heading => {
        const sectionTop = heading.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = heading.getAttribute('id');
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }
});

// Copy to clipboard for code blocks (optional)
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
}

// Share functions
function shareOnTwitter(title, url) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnFacebook(url) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnLine(title, url) {
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  window.open(lineUrl, '_blank', 'width=600,height=400');
}
