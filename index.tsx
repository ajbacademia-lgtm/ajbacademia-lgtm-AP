import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global Unhandled Rejection & Error Protection
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Global Unhandled Rejection Caught]:', event.reason?.message || event.reason || event);
    // Prevent default browser crash dialog while logging for diagnostics
    if (event.reason && typeof event.reason === 'object' && event.reason.message?.includes('ResizeObserver')) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    console.warn('[Global Client Error Caught]:', event.message || event.error || event);
    if (event.message?.includes('ResizeObserver loop')) {
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);