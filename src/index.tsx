import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts.css';
import App from './App';
import { RecoilRoot } from 'recoil';

// SPAフォールバック: 404.htmlからのリダイレクトを処理
// React Routerが初期化される前にURLを復元することで、正しいルートが表示される
const spaUrlParams = new URLSearchParams(window.location.search);
const spaPath = spaUrlParams.get('spa_path');
if (spaPath) {
  window.history.replaceState(null, '', spaPath);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
