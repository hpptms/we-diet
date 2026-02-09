(function () {
  var params = new URLSearchParams(window.location.search);
  var category = params.get('cat');

  if (!category) {
    document.getElementById('category-name').textContent = 'カテゴリが指定されていません';
    return;
  }

  document.getElementById('category-name').textContent = category;
  document.getElementById('breadcrumb-category').textContent = category;
  document.getElementById('page-title').textContent = category + ' の記事一覧 | We Diet ブログ';
  document.getElementById('page-description').setAttribute('content',
    'We Dietブログの「' + category + '」カテゴリの記事一覧です。');

  function createArticleCard(article) {
    return '<article class="article-card">' +
      '<a href="' + article.href + '">' +
      '<img src="' + article.img + '" alt="' + article.alt + '" class="article-image" loading="lazy">' +
      '<div class="article-content">' +
      '<span class="article-category">' + (article.category || '') + '</span>' +
      '<h3 class="article-title">' + article.title + '</h3>' +
      '<p class="article-meta">' + (article.date || '') + '</p>' +
      '</div></a></article>';
  }

  fetch('/blog/blog-data.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var matched = [];

      if (data.featured) {
        for (var i = 0; i < data.featured.length; i++) {
          if (data.featured[i].category === category) {
            matched.push({
              href: data.featured[i].href,
              img: data.featured[i].img,
              alt: data.featured[i].alt,
              category: data.featured[i].category,
              title: data.featured[i].title,
              date: ''
            });
          }
        }
      }

      for (var i = 0; i < data.sections.length; i++) {
        var articles = data.sections[i].articles;
        for (var j = 0; j < articles.length; j++) {
          if (articles[j].category === category) {
            matched.push(articles[j]);
          }
        }
      }

      var container = document.getElementById('category-articles');
      var countEl = document.getElementById('category-count');

      if (matched.length === 0) {
        container.innerHTML = '<p class="no-results">「' + category + '」に該当する記事はありません。</p>';
        countEl.textContent = '0件の記事';
        return;
      }

      countEl.textContent = matched.length + '件の記事';
      var html = '';
      for (var i = 0; i < matched.length; i++) {
        html += createArticleCard(matched[i]);
      }
      container.innerHTML = html;
      document.dispatchEvent(new CustomEvent('blog:rendered'));
    })
    .catch(function (err) {
      console.error('Failed to load blog data:', err);
    });
})();
