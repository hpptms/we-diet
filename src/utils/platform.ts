import { Capacitor } from '@capacitor/core';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const isIOSNative = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

export const isAndroidNative = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

/**
 * OAuth認証URLを開く
 * iOS ネイティブ: In-App Browser (SFSafariViewController) で開き、platform=ios パラメータを追加
 * Web: 通常の window.location.href でリダイレクト
 */
export const openAuthUrl = (url: string): void => {
  if (isNativePlatform()) {
    // iOS/Android: In-App Browser で開く + platform パラメータ追加
    const separator = url.includes('?') ? '&' : '?';
    const nativeUrl = `${url}${separator}platform=ios`;
    import('@capacitor/browser').then(({ Browser }) => {
      Browser.open({ url: nativeUrl });
    }).catch(() => {
      // fallback
      window.location.href = nativeUrl;
    });
  } else {
    window.location.href = url;
  }
};
