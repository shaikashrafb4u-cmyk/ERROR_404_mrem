import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ToastContainer } from '../components/Toast';

export const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
