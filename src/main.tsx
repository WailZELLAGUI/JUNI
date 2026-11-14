import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Keep the shop working offline once it has been opened online. Not used in the preview build.
if ('serviceWorker' in navigator && import.meta.env.PROD && !import.meta.env.VITE_PREVIEW) {
  const sw = navigator.serviceWorker;
  // Once the worker is in charge of this page, ask again for everything the page
  // loaded, so the worker can keep a copy for offline mornings.
  const keepCopies = () => {
    const urls = [location.href, ...performance.getEntriesByType('resource').map((r) => r.name)];
    urls.forEach((u) => fetch(u).catch(() => undefined));
  };
  // The handwriting font is only fetched when a note first appears, so ask for it now.
  window.addEventListener('load', () => void document.fonts?.load('600 16px Caveat'));
  const soon = () => setTimeout(keepCopies, 2500);
  if (sw.controller) soon();
  else sw.addEventListener('controllerchange', soon, { once: true });
  sw.register('./sw.js').catch(() => undefined);
}
