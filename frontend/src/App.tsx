import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';
import { ToastProvider } from './hooks/useToast';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="ticket/:id" element={<TicketDetailPage />} />
            <Route path="dashboard" element={<CustomerDashboardPage />} />
            <Route path="agent" element={<AgentDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
