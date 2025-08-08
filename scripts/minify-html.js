const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');
const { glob } = require('glob');

// HTML圧縮の設定
const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
    preserveLineBreaks: false,
    removeAttributeQuotes: true,
    removeOptionalTags: false, // AMPページの場合は安全のためfalse
    minifyURLs: true,
    sortAttributes: true,
    sortClassName: true
};

async function minifyHtmlFiles() {
    try {
        console.log('🚀 Starting HTML minification for amp/ directory...');

        // amp以下のすべてのHTMLファイルを取得
        const htmlFiles = await glob('public/amp/**/*.html', {
            cwd: process.cwd(),
            absolute: true
        });

        if (htmlFiles.length === 0) {
            console.log('❌ No HTML files found in public/amp/ directory');
            return;
        }

        console.log(`📁 Found ${htmlFiles.length} HTML files to minify:`);
        htmlFiles.forEach(file => console.log(`   - ${path.relative(process.cwd(), file)}`));

        let totalOriginalSize = 0;
        let totalMinifiedSize = 0;
        let processedFiles = 0;

        for (const filePath of htmlFiles) {
            try {
                // ファイル内容を読み込み
                const originalContent = fs.readFileSync(filePath, 'utf8');
                const originalSize = Buffer.byteLength(originalContent, 'utf8');

                // HTML圧縮を実行
                const minifiedContent = await minify(originalContent, minifyOptions);
                const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');

                // 圧縮されたファイルに書き戻し
                fs.writeFileSync(filePath, minifiedContent, 'utf8');

                // 統計情報を計算
                const savings = originalSize - minifiedSize;
                const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

                totalOriginalSize += originalSize;
                totalMinifiedSize += minifiedSize;
                processedFiles++;

                console.log(`✅ ${path.basename(filePath)}: ${originalSize} → ${minifiedSize} bytes (${savingsPercent}% reduction)`);

            } catch (fileError) {
                console.error(`❌ Error processing ${filePath}:`, fileError.message);
            }
        }

        // 全体の統計情報を表示
        const totalSavings = totalOriginalSize - totalMinifiedSize;
        const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);

        console.log('\n📊 Minification Summary:');
        console.log(`   Files processed: ${processedFiles}/${htmlFiles.length}`);
        console.log(`   Original total size: ${totalOriginalSize.toLocaleString()} bytes`);
        console.log(`   Minified total size: ${totalMinifiedSize.toLocaleString()} bytes`);
        console.log(`   Total reduction: ${totalSavings.toLocaleString()} bytes (${totalSavingsPercent}%)`);
        console.log('\n🎉 HTML minification completed successfully!');

    } catch (error) {
        console.error('❌ Error during HTML minification:', error.message);
        process.exit(1);
    }
}

// スクリプトが直接実行された場合
if (require.main === module) {
    minifyHtmlFiles();
}

module.exports = { minifyHtmlFiles };
