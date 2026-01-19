/**
 * IndexNow - 検索エンジンにサイト更新を通知するユーティリティ
 *
 * IndexNowは、Bing、Yandex、その他の検索エンジンに
 * ページの更新を即座に通知するためのプロトコルです。
 *
 * 参考: https://www.indexnow.org/
 */

// IndexNowのエンドポイント
const INDEX_NOW_ENDPOINTS = {
  bing: 'https://www.bing.com/indexnow',
  yandex: 'https://yandex.com/indexnow',
  // IndexNowプロトコルは、1つのエンドポイントに送信すれば
  // すべての参加検索エンジンに共有されます
};

// サイトのベースURL
const SITE_URL = 'https://we-diet.net';

// IndexNow APIキー
const API_KEY = '67d6ff0a14744ef39ee0fafe5a6526ee';

/**
 * IndexNowに単一のURLを送信
 *
 * @param url - 通知するURL（完全なURLまたはパス）
 * @param apiKey - IndexNow APIキー（オプション）
 * @returns Promise<boolean> - 成功したかどうか
 */
export async function submitToIndexNow(
  url: string,
  apiKey: string = API_KEY
): Promise<boolean> {
  try {
    // 相対パスの場合は絶対URLに変換
    const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;

    const payload = {
      host: new URL(SITE_URL).hostname,
      key: apiKey || undefined,
      urlList: [fullUrl],
    };

    // Bingのエンドポイントに送信（すべての参加エンジンに共有される）
    const response = await fetch(INDEX_NOW_ENDPOINTS.bing, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // IndexNowは成功時に200または202を返す
    if (response.status === 200 || response.status === 202) {
      console.log(`✓ IndexNow: Successfully submitted ${fullUrl}`);
      return true;
    } else {
      console.warn(`⚠ IndexNow: Failed to submit ${fullUrl} (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.error('✗ IndexNow: Error submitting URL', error);
    return false;
  }
}

/**
 * IndexNowに複数のURLを一括送信
 *
 * @param urls - 通知するURLの配列
 * @param apiKey - IndexNow APIキー（オプション）
 * @returns Promise<boolean> - 成功したかどうか
 */
export async function submitBulkToIndexNow(
  urls: string[],
  apiKey: string = API_KEY
): Promise<boolean> {
  try {
    // 相対パスを絶対URLに変換
    const fullUrls = urls.map(url =>
      url.startsWith('http') ? url : `${SITE_URL}${url}`
    );

    const payload = {
      host: new URL(SITE_URL).hostname,
      key: apiKey || undefined,
      urlList: fullUrls,
    };

    const response = await fetch(INDEX_NOW_ENDPOINTS.bing, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      console.log(`✓ IndexNow: Successfully submitted ${fullUrls.length} URLs`);
      return true;
    } else {
      console.warn(`⚠ IndexNow: Failed to submit URLs (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.error('✗ IndexNow: Error submitting URLs', error);
    return false;
  }
}

/**
 * ページ遷移時に自動的にIndexNowに通知する
 *
 * @param url - 通知するURL
 */
export function notifyPageView(url: string): void {
  // 本番環境のみで実行
  if (process.env.NODE_ENV === 'production' || import.meta.env.PROD) {
    // デバウンス処理（同じURLの重複送信を防ぐ）
    const key = `indexnow_submitted_${url}`;
    const lastSubmitted = sessionStorage.getItem(key);
    const now = Date.now();

    // 5分以内に送信済みの場合はスキップ
    if (lastSubmitted && now - parseInt(lastSubmitted) < 5 * 60 * 1000) {
      return;
    }

    // 非同期で送信（ページ読み込みをブロックしない）
    submitToIndexNow(url)
      .then(success => {
        if (success) {
          sessionStorage.setItem(key, now.toString());
        }
      })
      .catch(err => {
        console.error('IndexNow notification failed', err);
      });
  }
}

/**
 * サイトマップ内のすべてのURLをIndexNowに送信する
 * （管理者が手動で実行する想定）
 *
 * @param sitemapUrl - サイトマップのURL
 * @param apiKey - IndexNow APIキー
 */
export async function submitSitemapToIndexNow(
  sitemapUrl: string = `${SITE_URL}/sitemap.xml`,
  apiKey: string = API_KEY
): Promise<void> {
  try {
    console.log('📡 Fetching sitemap:', sitemapUrl);
    const response = await fetch(sitemapUrl);
    const xmlText = await response.text();

    // XMLからURLを抽出（簡易的なパース）
    const urlMatches = xmlText.matchAll(/<loc>(.*?)<\/loc>/g);
    const urls = Array.from(urlMatches).map(match => match[1]);

    console.log(`📋 Found ${urls.length} URLs in sitemap`);

    // IndexNowは最大10,000URLまで一度に送信可能
    // 安全のため、1000URLずつに分割して送信
    const chunkSize = 1000;
    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);
      console.log(`📤 Submitting chunk ${i / chunkSize + 1} (${chunk.length} URLs)`);
      await submitBulkToIndexNow(chunk, apiKey);

      // レート制限を避けるため、少し待機
      if (i + chunkSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('✓ All URLs from sitemap submitted to IndexNow');
  } catch (error) {
    console.error('✗ Error submitting sitemap to IndexNow', error);
  }
}
