import React, { useState } from 'react';
import { BrandingPanel } from './components/BrandingPanel';
import { LoginForm } from './components/LoginForm';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-background-dark text-white overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-noise w-full h-full" />

      {/* Left Side: Branding and Visualization */}
      <BrandingPanel />

      {/* Right Side: Login Form */}
      <div className="relative flex-1 flex items-center justify-center p-6 lg:p-12 z-10">
        <LoginForm />
      </div>

      {/* Footer Meta */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-20 lg:translate-x-0 z-10 hidden lg:block opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-slate-500 text-[10px] tracking-[0.2em] uppercase font-bold">
          © 2024 DevFlow Systems • Enterprise R&D v4.2
        </p>
      </div>
    </div>
  );
};

export default App;