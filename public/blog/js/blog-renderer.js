(function () {
  function categoryUrl(category) {
    return '/blog/category.html?cat=' + encodeURIComponent(category);
  }

  function createFeaturedCard(article) {
    return '<article class="featured-card">' +
      '<a href="' + article.href + '">' +
      '<img src="' + article.img + '" alt="' + article.alt + '" class="featured-image" loading="lazy">' +
      '<div class="featured-content">' +
      '<span class="featured-category category-link" data-category="' + article.category + '">' + article.category + '</span>' +
      '<h3 class="featured-title">' + article.title + '</h3>' +
      '<p class="featured-excerpt">' + article.excerpt + '</p>' +
      '</div></a></article>';
  }

  function createArticleCard(article) {
    return '<article class="article-card">' +
      '<a href="' + article.href + '">' +
      '<img src="' + article.img + '" alt="' + article.alt + '" class="article-image" loading="lazy">' +
      '<div class="article-content">' +
      '<span class="article-category category-link" data-category="' + article.category + '">' + article.category + '</span>' +
      '<h3 class="article-title">' + article.title + '</h3>' +
      '<p class="article-meta">' + article.date + '</p>' +
      '</div></a></article>';
  }

  function createSection(section) {
    var html = '<div class="section-title">' +
      '<h2 data-i18n-section="' + section.i18nKey + '">' + section.title + '</h2>' +
      '</div>' +
      '<div class="article-grid">';
    for (var i = 0; i < section.articles.length; i++) {
      html += createArticleCard(section.articles[i]);
    }
    html += '</div>';
    return html;
  }

  function render(data) {
    var featuredContainer = document.getElementById('featured-articles');
    if (featuredContainer && data.featured) {
      var featuredHtml = '';
      for (var i = 0; i < data.featured.length; i++) {
        featuredHtml += createFeaturedCard(data.featured[i]);
      }
      featuredContainer.innerHTML = featuredHtml;
    }

    var sectionsContainer = document.getElementById('article-sections');
    if (sectionsContainer && data.sections) {
      var sectionsHtml = '';
      for (var i = 0; i < data.sections.length; i++) {
        sectionsHtml += createSection(data.sections[i]);
      }
      sectionsContainer.innerHTML = sectionsHtml;
    }
  }

  document.addEventListener('click', function (e) {
    var tag = e.target.closest('.category-link');
    if (tag) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = categoryUrl(tag.getAttribute('data-category'));
    }
  });

  fetch('/blog/blog-data.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      render(data);
      document.dispatchEvent(new CustomEvent('blog:rendered'));
    })
    .catch(function (err) { console.error('Failed to load blog data:', err); });
})();
