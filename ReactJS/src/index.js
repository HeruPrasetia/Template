import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { SocketProvider } from "./SocketProvider.js";
import { injectFaviconAndManifest } from "./inject-head";

// Misalnya domain ambil dari hostname
const domain = window.location.hostname;
injectFaviconAndManifest(domain);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <SocketProvider> */}
    <App />
    {/* </SocketProvider> */}
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch((err) => {
      console.log('Service worker registration failed, error:', err);
    });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
