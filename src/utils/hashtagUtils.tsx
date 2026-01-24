import React from 'react';

/**
 * ハッシュタグクリック時のコールバック型
 */
export type HashtagClickHandler = (hashtag: string) => void;

/**
 * ハッシュタグ抽出用の正規表現（日本語対応）
 */
const HASHTAG_REGEX = /#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g;

/**
 * テキスト内の#ハッシュタグをハイライト表示するための関数
 * @param text - 元のテキスト
 * @param onHashtagClick - ハッシュタグクリック時のコールバック（オプション）
 * @returns ハッシュタグがハイライトされたReact要素の配列
 */
export const highlightHashtags = (
  text: string,
  onHashtagClick?: HashtagClickHandler
): React.ReactNode[] => {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // 正規表現のインデックスをリセット
  HASHTAG_REGEX.lastIndex = 0;

  // テキスト内のすべてのハッシュタグを検索
  while ((match = HASHTAG_REGEX.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;
    const hashtag = match[0]; // #を含むハッシュタグ

    // ハッシュタグ前のテキストを追加
    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    // ハッシュタグ部分をハイライト表示
    parts.push(
      <span
        key={`hashtag-${matchStart}`}
        style={{
          color: '#1da1f2',
          fontWeight: 600,
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onHashtagClick) {
            onHashtagClick(hashtag);
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline';
          e.currentTarget.style.color = '#0d8bd9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
          e.currentTarget.style.color = '#1da1f2';
        }}
      >
        {hashtag}
      </span>
    );

    lastIndex = matchEnd;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

/**
 * テキスト内のハッシュタグを抽出する関数
 * @param text - 元のテキスト
 * @returns ハッシュタグの配列（#を含む）
 */
export const extractHashtags = (text: string): string[] => {
  if (!text) return [];

  const matches = text.match(HASHTAG_REGEX);
  return matches ? Array.from(new Set(matches)) : [];
};

/**
 * ハッシュタグを正規化する関数（小文字に変換）
 * @param hashtag - ハッシュタグ
 * @returns 正規化されたハッシュタグ
 */
export const normalizeHashtag = (hashtag: string): string => {
  return hashtag.toLowerCase();
};

/**
 * メンションクリック時のコールバック型（mentionUtilsからインポート避けるため再定義）
 */
export type MentionClickHandler = (username: string) => void;

/**
 * テキスト内のメンションとハッシュタグの両方をハイライト表示する関数
 * @param text - 元のテキスト
 * @param onMentionClick - メンションクリック時のコールバック（オプション）
 * @param onHashtagClick - ハッシュタグクリック時のコールバック（オプション）
 * @returns ハイライトされたReact要素の配列
 */
export const highlightMentionsAndHashtags = (
  text: string,
  onMentionClick?: MentionClickHandler,
  onHashtagClick?: HashtagClickHandler
): React.ReactNode[] => {
  if (!text) return [];

  // メンションとハッシュタグを検出する正規表現
  const combinedRegex = /(@[a-zA-Z0-9_-]+|#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;
    const matched = match[0];

    // マッチ前のテキストを追加
    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    if (matched.startsWith('@')) {
      // メンション
      const username = matched.substring(1);
      parts.push(
        <span
          key={`mention-${matchStart}`}
          style={{
            color: '#1976d2',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onMentionClick) {
              onMentionClick(username);
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.color = '#0d47a1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
            e.currentTarget.style.color = '#1976d2';
          }}
        >
          {matched}
        </span>
      );
    } else if (matched.startsWith('#')) {
      // ハッシュタグ
      parts.push(
        <span
          key={`hashtag-${matchStart}`}
          style={{
            color: '#1da1f2',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onHashtagClick) {
              onHashtagClick(matched);
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.color = '#0d8bd9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
            e.currentTarget.style.color = '#1da1f2';
          }}
        >
          {matched}
        </span>
      );
    }

    lastIndex = matchEnd;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
