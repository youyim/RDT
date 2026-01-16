import React from 'react';
import { RefreshCw, Clock, Network } from 'lucide-react';

export const BrandingPanel: React.FC = () => {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-8 lg:p-20 overflow-hidden bg-background-dark border-b border-white/5 lg:border-b-0 lg:border-r">
      
      {/* Background Visualization (Stylized R&D Graph) */}
      <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none">
        <svg 
          className="w-full h-full scale-125 origin-center" 
          viewBox="0 0 800 800" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbital Rings */}
          <circle cx="400" cy="400" r="120" stroke="#137fec" strokeOpacity="0.3" strokeWidth="0.5" fill="none" />
          <circle cx="400" cy="400" r="220" stroke="#137fec" strokeOpacity="0.2" strokeWidth="0.5" fill="none" />
          <circle cx="400" cy="400" r="320" stroke="#137fec" strokeOpacity="0.1" strokeWidth="0.5" fill="none" />
          
          {/* Nodes */}
          <circle cx="400" cy="280" r="6" fill="#137fec" className="text-glow" />
          <circle cx="510" cy="350" r="4" fill="#137fec" fillOpacity="0.6" />
          <circle cx="290" cy="450" r="5" fill="#137fec" fillOpacity="0.8" />
          <circle cx="550" cy="500" r="3" fill="#137fec" fillOpacity="0.4" />
          
          {/* Connectivity Lines with Dash Animation */}
          <path 
            d="M400 280 L510 350 L550 500 L290 450 Z" 
            stroke="#137fec" 
            strokeOpacity="0.4" 
            strokeWidth="1.5" 
            fill="none"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="animate-dash"
          />
          <path 
            d="M400 280 L290 450" 
            stroke="#137fec" 
            strokeOpacity="0.2" 
            strokeWidth="1" 
            fill="none" 
          />
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-start max-w-lg w-full animate-fade-in">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="size-14 bg-accent rounded-xl flex items-center justify-center glow-effect shadow-2xl shadow-accent/40 text-white">
            <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-glow text-white">DevFlow</h1>
        </div>

        {/* Hero Text */}
        <h2 className="text-3xl lg:text-5xl font-extrabold leading-tight mb-6">
          Orchestrate <br/>
          <span className="text-accent drop-shadow-lg">R&D Lifecycle</span>
        </h2>
        
        <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10 border-l-2 border-slate-700 pl-4">
          Advanced process management and resource scheduling for high-stakes engineering environments.
        </p>

        {/* Features Pills */}
        <div className="flex gap-4">
          <FeatureIcon icon={<RefreshCw size={24} />} />
          <FeatureIcon icon={<Clock size={24} />} />
          <FeatureIcon icon={<Network size={24} />} />
        </div>
      </div>
    </div>
  );
};

const FeatureIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-accent hover:bg-white/10 hover:border-accent/50 transition-all cursor-default shadow-lg shadow-black/20">
    {icon}
  </div>
);