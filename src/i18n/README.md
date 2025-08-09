# 国際化 (i18n) ファイルの最適化

## 概要

このディレクトリは、アプリケーションの多言語対応を管理します。日本語の翻訳ファイルが大きくなっていたため、機能別にモジュール化して最適化しました。

## 最適化の内容

### Before（最適化前）
```
frontend/src/i18n/languages/
├── ja.json      (40,814 bytes - 大きな単一ファイル)
├── en.json      (37,744 bytes)
├── zh-CN.json   (29,971 bytes)
├── ko.json      (33,767 bytes)
└── es.json      (33,945 bytes)
```

### After（最適化後）
```
frontend/src/i18n/languages/
├── modules/
│   ├── ja-common.json      (1,844 bytes - 共通要素)
│   ├── ja-auth-nav.json    (2,596 bytes - 認証・ナビゲーション)
│   ├── ja-profile.json     (7,057 bytes - プロフィール関連)
│   ├── ja-weight.json      (3,410 bytes - 体重管理)
│   ├── ja-exercise.json    (9,745 bytes - 運動記録)
│   └── ja-food-dieter.json (15,791 bytes - 食事記録・Dieter)
├── ja.json      (40,814 bytes - 元のファイル、後方互換性のため保持)
├── en.json      (37,744 bytes)
├── zh-CN.json   (29,971 bytes)
├── ko.json      (33,767 bytes)
└── es.json      (33,945 bytes)
```

## ファイル構成

### モジュール構成

1. **ja-common.json** - 共通要素
   - `common` - 共通UI要素（保存、キャンセル、エラーなど）
   - `time` - 時間関連の表示
   - `errors` - エラーメッセージ

2. **ja-auth-nav.json** - 認証・ナビゲーション
   - `auth` - ログイン、認証関連
   - `navigation` - メニュー、ナビゲーション
   - `dashboard` - ダッシュボード
   - `search` - 検索機能
   - `settings` - 設定画面

3. **ja-profile.json** - プロフィール関連
   - `profile` - プロフィール設定、アイコン、通知設定
   - `posts` - 投稿関連
   - `notifications` - 通知
   - `messages` - メッセージ

4. **ja-weight.json** - 体重管理
   - `weight` - 体重記録、履歴、グラフ表示

5. **ja-exercise.json** - 運動記録
   - `exercise` - 運動記録、同期機能、各種エクササイズ

6. **ja-food-dieter.json** - 食事記録・Dieter
   - `food` - 食事記録、カレンダー機能
   - `dieter` - Dieterアプリ機能
   - `pages` - 利用規約、トップページなど

### 技術仕様

**モジュールローダー (`moduleLoader.ts`)**
```typescript
// 分割されたモジュールを統合
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
```

**メインファイル (`index.ts`)**
```typescript
// 新しいモジュールローダーを使用
import { loadJapaneseTranslations } from './moduleLoader';
const jaTranslations = loadJapaneseTranslations();
```

## メリット

### 1. 保守性の向上
- 機能別に分割されているため、特定の機能の翻訳を更新する際に該当するモジュールファイルのみを編集すればよい
- ファイルサイズが小さくなり、編集時の負荷が軽減

### 2. 開発効率の向上
- 大きなファイルでの検索時間の短縮
- 機能追加時に適切なモジュールに翻訳を追加するだけで済む
- VSCodeなどのエディタでの読み込み・編集が高速化

### 3. チーム開発の改善
- 複数の開発者が異なる機能の翻訳を同時に編集してもコンフリクトが発生しにくい
- レビュー時に変更対象の機能が明確

### 4. 後方互換性の保持
- 既存のコードは変更なしで動作
- 元の`ja.json`ファイルも残しているため、段階的な移行が可能

## 使用方法

### 翻訳の追加・編集

1. 該当する機能のモジュールファイルを特定
2. 適切なセクションに翻訳を追加・編集
3. 変更は自動的に統合され、既存のAPIで利用可能

### 新しい言語の分割

将来的に他の言語ファイルも分割する場合：

```typescript
// moduleLoader.ts に追加
export function loadEnglishTranslations() {
    return deepMerge(
        enCommonModule,
        enAuthNavModule,
        // ... 他のモジュール
    );
}
```

## パフォーマンス

- **総ファイルサイズ**: 変更なし（統合後は同じ内容）
- **読み込み時間**: 初回のみ統合処理が実行される
- **メモリ使用量**: 微増（モジュール管理のオーバーヘッド）
- **開発時の体感**: 大幅改善（編集対象ファイルの小型化）

## 注意事項

- 翻訳の追加時は適切なモジュールに配置すること
- モジュール間で重複する翻訳キーがないよう注意
- `deepMerge`関数により後から読み込まれるモジュールが優先される

## 今後の予定

- [ ] 他の言語ファイル（英語、中国語、韓国語、スペイン語）の同様の分割
- [ ] 翻訳キーの重複チェック機能
- [ ] 未使用翻訳キーの検出機能
