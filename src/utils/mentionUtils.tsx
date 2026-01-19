import React from 'react';

/**
 * テキスト内の@メンションをハイライト表示するための関数
 * @param text - 元のテキスト
 * @returns メンションがハイライトされたReact要素の配列
 */
export const highlightMentions = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // @username パターンにマッチする正規表現
  // ユーザー名は英数字、アンダースコア、ハイフンを許可
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // テキスト内のすべてのメンションを検索
  while ((match = mentionRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;

    // メンション前のテキストを追加
    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    // メンション部分をハイライト表示
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
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline';
          e.currentTarget.style.color = '#0d47a1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
          e.currentTarget.style.color = '#1976d2';
        }}
      >
        {match[0]}
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
 * テキスト内のメンションを抽出する関数
 * @param text - 元のテキスト
 * @returns メンションされたユーザー名の配列
 */
export const extractMentions = (text: string): string[] => {
  if (!text) return [];

  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  const mentions: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]); // @ を除いたユーザー名
  }

  return mentions;
};
