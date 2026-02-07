/**
 * We Diet Blog - Common JavaScript
 * 全ブログ記事で共通のスクリプト
 */

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-J3JE0T4ZFM');

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

  // ブログランキングバナーをフッターに追加
  var footer = document.querySelector('.footer');
  if (footer && !footer.querySelector('.ranking-banners')) {
    var rankings = document.createElement('div');
    rankings.className = 'ranking-banners';
    rankings.innerHTML =
      '<a href="https://diet.blogmura.com/ranking/in?p_cid=11211987" target="_blank" rel="noopener"><img src="https://b.blogmura.com/diet/88_31.gif" width="88" height="31" alt="にほんブログ村 ダイエットブログへ" loading="lazy"></a>' +
      '<a href="https://blog.with2.net/link/?id=2138563" target="_blank" rel="noopener" title="人気ブログランキング"><img src="https://blog.with2.net/img/banner/banner_13.svg" width="80" height="15" alt="人気ブログランキング" loading="lazy"></a>' +
      '<a href="https://blogranking.fc2.com/in.php?id=1072821" target="_blank" rel="noopener"><img src="https://static.fc2.com/blogranking/ranking_banner/b_03.gif" alt="FC2 Blog Ranking" loading="lazy"></a>';
    footer.appendChild(rankings);
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
