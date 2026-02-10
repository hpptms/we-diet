// モジュールローダー - 分割された翻訳ファイルを動的に読み込み統合する

// 日本語モジュールのインポート
import jaCommonModule from './languages/modules/ja-common.json';
import jaAuthNavModule from './languages/modules/ja-auth-nav.json';
import jaProfileModule from './languages/modules/ja-profile.json';
import jaWeightModule from './languages/modules/ja-weight.json';
import jaExerciseModule from './languages/modules/ja-exercise.json';
import jaFoodDieterModule from './languages/modules/ja-food-dieter.json';

// 英語モジュールのインポート
import enCommonModule from './languages/modules/en-common.json';
import enAuthNavModule from './languages/modules/en-auth-nav.json';
import enProfileModule from './languages/modules/en-profile.json';
import enWeightModule from './languages/modules/en-weight.json';
import enExerciseModule from './languages/modules/en-exercise.json';
import enFoodDieterModule from './languages/modules/en-food-dieter.json';

// 中国語モジュールのインポート
import zhCNCommonModule from './languages/modules/zh-CN-common.json';
import zhCNAuthNavModule from './languages/modules/zh-CN-auth-nav.json';
import zhCNProfileModule from './languages/modules/zh-CN-profile.json';
import zhCNWeightModule from './languages/modules/zh-CN-weight.json';
import zhCNExerciseModule from './languages/modules/zh-CN-exercise.json';
import zhCNFoodDieterModule from './languages/modules/zh-CN-food-dieter.json';

// 韓国語モジュールのインポート
import koCommonModule from './languages/modules/ko-common.json';
import koAuthNavModule from './languages/modules/ko-auth-nav.json';
import koProfileModule from './languages/modules/ko-profile.json';
import koWeightModule from './languages/modules/ko-weight.json';
import koExerciseModule from './languages/modules/ko-exercise.json';
import koFoodDieterModule from './languages/modules/ko-food-dieter.json';

// スペイン語モジュールのインポート
import esCommonModule from './languages/modules/es-common.json';
import esAuthNavModule from './languages/modules/es-auth-nav.json';
import esProfileModule from './languages/modules/es-profile.json';
import esWeightModule from './languages/modules/es-weight.json';
import esExerciseModule from './languages/modules/es-exercise.json';
import esFoodDieterModule from './languages/modules/es-food-dieter.json';

// ポルトガル語モジュールのインポート
import ptCommonModule from './languages/modules/pt-common.json';
import ptAuthNavModule from './languages/modules/pt-auth-nav.json';
import ptProfileModule from './languages/modules/pt-profile.json';
import ptWeightModule from './languages/modules/pt-weight.json';
import ptExerciseModule from './languages/modules/pt-exercise.json';
import ptFoodDieterModule from './languages/modules/pt-food-dieter.json';

/**
 * オブジェクトをディープマージする関数
 */
function deepMerge<T = any>(...objects: any[]): T {
    const result: any = {};

    for (const obj of objects) {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (result[key] && typeof result[key] === 'object' && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        result[key] = deepMerge(result[key], obj[key]);
                    } else {
                        result[key] = obj[key];
                    }
                }
            }
        }
    }

    return result;
}

/**
 * 日本語翻訳データを統合して返す
 */
export function loadJapaneseTranslations() {
    return deepMerge(
        jaCommonModule,
        jaAuthNavModule,
        jaProfileModule,
        jaWeightModule,
        jaExerciseModule,
        jaFoodDieterModule
    );
}

/**
 * 英語翻訳データを統合して返す
 */
export function loadEnglishTranslations() {
    return deepMerge(
        enCommonModule,
        enAuthNavModule,
        enProfileModule,
        enWeightModule,
        enExerciseModule,
        enFoodDieterModule
    );
}

/**
 * 中国語翻訳データを統合して返す
 */
export function loadChineseTranslations() {
    return deepMerge(
        zhCNCommonModule,
        zhCNAuthNavModule,
        zhCNProfileModule,
        zhCNWeightModule,
        zhCNExerciseModule,
        zhCNFoodDieterModule
    );
}

/**
 * 韓国語翻訳データを統合して返す
 */
export function loadKoreanTranslations() {
    return deepMerge(
        koCommonModule,
        koAuthNavModule,
        koProfileModule,
        koWeightModule,
        koExerciseModule,
        koFoodDieterModule
    );
}

/**
 * スペイン語翻訳データを統合して返す
 */
export function loadSpanishTranslations() {
    return deepMerge(
        esCommonModule,
        esAuthNavModule,
        esProfileModule,
        esWeightModule,
        esExerciseModule,
        esFoodDieterModule
    );
}

/**
 * ポルトガル語翻訳データを統合して返す
 */
export function loadPortugueseTranslations() {
    return deepMerge(
        ptCommonModule,
        ptAuthNavModule,
        ptProfileModule,
        ptWeightModule,
        ptExerciseModule,
        ptFoodDieterModule
    );
}

/**
 * 言語コードに基づいて適切な翻訳データを読み込む
 */
export async function loadTranslationsForLanguage(languageCode: string) {
    switch (languageCode) {
        case 'ja':
            return loadJapaneseTranslations();
        case 'en':
            return loadEnglishTranslations();
        case 'zh-CN':
            return loadChineseTranslations();
        case 'ko':
            return loadKoreanTranslations();
        case 'es':
            return loadSpanishTranslations();
        case 'pt':
            return loadPortugueseTranslations();
        default:
            // デフォルトは日本語
            return loadJapaneseTranslations();
    }
}

/**
 * 全言語の翻訳データを読み込む（従来の方式との互換性のため）
 */
export async function loadAllTranslations() {
    const [ja, en, zhCN, ko, es, pt] = await Promise.all([
        loadJapaneseTranslations(),
        loadEnglishTranslations(),
        loadChineseTranslations(),
        loadKoreanTranslations(),
        loadSpanishTranslations(),
        loadPortugueseTranslations()
    ]);

    return {
        ja,
        en,
        'zh-CN': zhCN,
        ko,
        es,
        pt
    };
}
