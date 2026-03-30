import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AdminApp } from './admin/AdminApp';
import './index.css';

const pathname = window.location.pathname.replace(/\/+$/, '');
const search = new URLSearchParams(window.location.search);
const isAdminRoute = pathname === '/admin' || search.get('admin') === '1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? <AdminApp /> : <App />}
  </StrictMode>,
);
