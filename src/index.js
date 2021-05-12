import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*
 * 讓各家瀏覽器一致的樣式
 * >>> npm install --save normalize.css
 */
import 'normalize.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// 把即時天氣 APP 包成 PWA(Progressive Web App)
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
 * Service Worker 可以把網頁應用程式暫存(cache)下來，提升瀏覽速度
 * 讓網頁就像 App 一樣不用透過 Google Play 就安裝在手機上
 */
serviceWorker.register();