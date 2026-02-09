#!/usr/bin/env node
/**
 * Split translation files by language
 * Usage: node split-translations.js
 */

const fs = require('fs');
const path = require('path');

const SUPPORTED_LANGS = ['ja', 'en', 'zh-CN', 'ko', 'es'];

// Read blog-translations.json
const blogTranslationsPath = path.join(__dirname, 'blog-translations.json');
const blogTranslations = JSON.parse(fs.readFileSync(blogTranslationsPath, 'utf8'));

// Read affiliate-translations.json
const affiliateTranslationsPath = path.join(__dirname, 'affiliate-translations.json');
const affiliateTranslations = JSON.parse(fs.readFileSync(affiliateTranslationsPath, 'utf8'));

// Split blog translations
SUPPORTED_LANGS.forEach(lang => {
  const langData = {};

  // Extract data for this language from each section
  if (blogTranslations.ui && blogTranslations.ui[lang]) {
    langData.ui = blogTranslations.ui[lang];
  }

  if (blogTranslations.sections && blogTranslations.sections[lang]) {
    langData.sections = blogTranslations.sections[lang];
  }

  if (blogTranslations.categories && blogTranslations.categories[lang]) {
    langData.categories = blogTranslations.categories[lang];
  }

  if (blogTranslations.articles && blogTranslations.articles[lang]) {
    langData.articles = blogTranslations.articles[lang];
  }

  if (blogTranslations.meta && blogTranslations.meta[lang]) {
    langData.meta = blogTranslations.meta[lang];
  }

  // Write to separate file
  const outputPath = path.join(__dirname, `blog-translations-${lang}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(langData, null, 2));
  console.log(`✓ Created ${outputPath}`);
});

// Split affiliate translations
SUPPORTED_LANGS.forEach(lang => {
  const langData = {};

  if (affiliateTranslations.domains && affiliateTranslations.domains[lang]) {
    langData.domains = affiliateTranslations.domains[lang];
  }

  if (affiliateTranslations.keywords && affiliateTranslations.keywords[lang]) {
    langData.keywords = affiliateTranslations.keywords[lang];
  }

  if (affiliateTranslations.productNames && affiliateTranslations.productNames[lang]) {
    langData.productNames = affiliateTranslations.productNames[lang];
  }

  // Write to separate file
  const outputPath = path.join(__dirname, `affiliate-translations-${lang}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(langData, null, 2));
  console.log(`✓ Created ${outputPath}`);
});

console.log('\n✓ All translation files split successfully!');
console.log(`\nCreated files for languages: ${SUPPORTED_LANGS.join(', ')}`);
