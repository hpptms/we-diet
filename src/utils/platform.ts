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
 * 外部URLをブラウザで開く（ブログなど）
 * ネイティブ: In-App Browser で開く
 * Web: 通常のナビゲーション
 */
export const openExternalUrl = (url: string): void => {
  if (isNativePlatform()) {
    import('@capacitor/browser').then(({ Browser }) => {
      Browser.open({ url });
    }).catch(() => {
      window.open(url, '_blank');
    });
  } else {
    window.location.href = url;
  }
};

export const openAuthUrl = (url: string): void => {
  if (isNativePlatform()) {
    const platform = isIOSNative() ? 'ios' : 'android';
    const separator = url.includes('?') ? '&' : '?';
    const nativeUrl = `${url}${separator}platform=${platform}`;
    import('@capacitor/browser').then(({ Browser }) => {
      Browser.open({ url: nativeUrl });
    }).catch(() => {
      window.location.href = nativeUrl;
    });
  } else {
    window.location.href = url;
  }
};
