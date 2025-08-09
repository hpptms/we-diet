// 多言語ファイル分割ツール
const fs = require('fs');
const path = require('path');

// 分割する言語リスト
const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
    { code: 'es', name: 'Spanish' }
];

// モジュール分割の定義
const moduleStructure = {
    'common': ['common', 'time', 'errors'],
    'auth-nav': ['auth', 'navigation', 'dashboard', 'search', 'settings'],
    'profile': ['profile', 'posts', 'notifications', 'messages'],
    'weight': ['weight'],
    'exercise': ['exercise'],
    'food-dieter': ['food', 'dieter', 'pages']
};

// 各言語のファイルを分割する
languages.forEach(language => {
    const inputFile = path.join(__dirname, '../languages', `${language.code}.json`);

    // 元ファイルを読み込み
    if (!fs.existsSync(inputFile)) {
        console.log(`Skipping ${language.code}: file not found`);
        return;
    }

    const originalData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    // 各モジュールファイルを作成
    Object.entries(moduleStructure).forEach(([moduleName, sections]) => {
        const moduleData = {};

        sections.forEach(section => {
            if (originalData[section]) {
                moduleData[section] = originalData[section];
            }
        });

        // モジュールファイルを書き出し
        const outputFile = path.join(__dirname, '../languages/modules', `${language.code}-${moduleName}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(moduleData, null, 4));
        console.log(`Created: ${outputFile}`);
    });
});

console.log('Language file splitting completed!');
