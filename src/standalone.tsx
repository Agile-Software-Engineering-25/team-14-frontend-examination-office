import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/context/AuthContext';

const container = document.getElementById('root');

createRoot(container!).render(
  <StrictMode>
    <AuthProvider>
      <App basename={import.meta.env.BASE_URL || '/'} />
    </AuthProvider>
  </StrictMode>
);
