import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

/**
 * Authentication Layout
 * Centered container for Login/Register pages
 * @returns Auth layout component
 */
export function AuthLayout() {
  const { t } = useTranslation();
  return (
    <div className="bg-background-dark font-display min-h-screen overflow-x-hidden text-white">
      <div className="noise-overlay" />
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Side: Branding and Visualization */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-8 lg:p-20">
          {/* Background Visualization (Stylized R&D Graph) */}
          <div className="absolute inset-0 z-0 opacity-40">
            <svg
              className="h-full w-full scale-125"
              fill="none"
              height="100%"
              viewBox="0 0 800 800"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="400"
                cy="400"
                r="120"
                stroke="#137fec"
                strokeOpacity="0.3"
                strokeWidth="0.5"
              />
              <circle
                cx="400"
                cy="400"
                r="220"
                stroke="#137fec"
                strokeOpacity="0.2"
                strokeWidth="0.5"
              />
              <circle
                cx="400"
                cy="400"
                r="320"
                stroke="#137fec"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />
              {/* Nodes */}
              <circle className="text-glow" cx="400" cy="280" fill="#137fec" r="6" />
              <circle cx="510" cy="350" fill="#137fec" fillOpacity="0.6" r="4" />
              <circle cx="290" cy="450" fill="#137fec" fillOpacity="0.8" r="5" />
              <circle cx="550" cy="500" fill="#137fec" fillOpacity="0.4" r="3" />
              {/* Connectivity Lines */}
              <path
                className="graph-line"
                d="M400 280 L510 350 L550 500 L290 450 Z"
                stroke="#137fec"
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
              <path d="M400 280 L290 450" stroke="#137fec" strokeOpacity="0.2" strokeWidth="1" />
            </svg>
          </div>
          {/* Content Overlay */}
          <div className="relative z-10 flex max-w-lg flex-col items-start">
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-accent shadow-accent/40 glow-effect flex size-14 items-center justify-center rounded-xl shadow-2xl">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-glow text-4xl font-extrabold tracking-tighter">
                {t('authLayout.brandName')}
              </h1>
            </div>
            <h2 className="mb-6 text-3xl leading-tight font-extrabold lg:text-5xl">
              {t('authLayout.headlinePrefix')} <br />
              <span className="text-accent">{t('authLayout.headlineSuffix')}</span>
            </h2>
            <p className="mb-10 max-w-sm text-lg leading-relaxed text-slate-400">
              {t('authLayout.description')}
            </p>
            <div className="flex gap-4">
              <div className="glass-card flex items-center justify-center rounded-lg p-3">
                {/* eslint-disable-next-line i18next/no-literal-string */}
                <span className="material-symbols-outlined text-accent">auto_mode</span>
              </div>
              <div className="glass-card flex items-center justify-center rounded-lg p-3">
                {/* eslint-disable-next-line i18next/no-literal-string */}
                <span className="material-symbols-outlined text-accent">schedule</span>
              </div>
              <div className="glass-card flex items-center justify-center rounded-lg p-3">
                {/* eslint-disable-next-line i18next/no-literal-string */}
                <span className="material-symbols-outlined text-accent">hub</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Login Form */}
        <div className="bg-background-dark/80 relative flex flex-1 items-center justify-center p-6 lg:bg-transparent">
          <Outlet />
        </div>
      </div>
      {/* Footer Meta */}
      <div className="fixed bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:left-20 lg:block lg:translate-x-0">
        <p className="text-xs font-bold tracking-widest text-slate-600 uppercase">
          {t('authLayout.footer')}
        </p>
      </div>
    </div>
  );
}
