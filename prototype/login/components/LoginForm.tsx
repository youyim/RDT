import React, { useState } from 'react';
import { AtSign, Lock, ArrowRight, Shield } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // Add logic here
  };

  return (
    <div className="w-full max-w-[440px] bg-white/5 backdrop-blur-xl border border-white/10 p-8 lg:p-12 rounded-2xl shadow-2xl relative overflow-hidden group">
      
      {/* Decorative Sweep Animation */}
      <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 pointer-events-none transition-transform duration-1000 group-hover:translate-x-full" />
      
      <div className="relative z-10">
        <div className="mb-10 text-center lg:text-left">
          <h3 className="text-white text-3xl font-extrabold tracking-tight mb-2">Sign In</h3>
          <p className="text-slate-400 text-sm">Access your enterprise R&D workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-slate-200 text-xs uppercase font-bold tracking-wider px-1">Corporate Email</label>
            <div className="relative group/input">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-accent transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-base hover:bg-black/30"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between px-1 items-center">
              <label className="text-slate-200 text-xs uppercase font-bold tracking-wider">Password</label>
              <a href="#" className="text-accent text-xs font-semibold hover:text-white hover:underline transition-colors">Forgot?</a>
            </div>
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-accent transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-base hover:bg-black/30"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-accent to-[#0e6ed2] text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2 group/btn"
          >
            <span>Sign In to DevFlow</span>
            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121218] px-2 text-slate-500 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <SocialButton 
            icon={<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQi_F9h7I1KxVP6KnLHmIsHKi9_KP994iIFv0EgpEoy4RhjO6S3IUty2HWUVkfhX_gnstWz32I60yDiQ6fdjNSdf38yBiRcV4O6_lU17WHd_AwxRwPmr0Iuu0Wqj1kZ3YEkmU6BG9CJ_YDwFuGCLx4fccPtZ3whRE_0k-_MBdrSa2Jz2g9CpwY1MW_j84w-_qtGisaHl4KRzOaP4zUZIAruvlOaub3QMGccDdKgV7JfIBK0PqzRI5CmPGOHq7GKRltNs9BbBLqPXJS" alt="GitLab" className="w-5 h-5" />}
            label="GitLab"
          />
          <SocialButton 
            icon={<Shield size={20} className="text-slate-300" />}
            label="LDAP"
          />
        </div>

        <p className="mt-10 text-center text-slate-500 text-xs">
          Don't have an account?{' '}
          <a href="#" className="text-slate-300 font-bold hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 hover:decoration-white">Request access</a>
        </p>
      </div>
    </div>
  );
};

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
    {icon}
    <span className="text-slate-300 font-semibold text-sm">{label}</span>
  </button>
);