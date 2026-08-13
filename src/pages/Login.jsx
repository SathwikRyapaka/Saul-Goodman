import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import ladyJusticeImg from '../assets/lady-justice.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('citizen.telangana@nyayasetu.gov.in');
  const [password, setPassword] = useState('demo1234');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate login API flow and route to the newly designed dashboard
    setTimeout(() => {
      setIsSubmitting(false);
      login(email, password);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 py-10 bg-[#07090e] overflow-hidden select-none dark-scrollbar">
      
      {/* ================= BACKGROUND AMBIENT LAYER ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -inset-20 bg-cover bg-center filter blur-[110px] brightness-[0.35] saturate-[0.6] opacity-70 scale-110 transition-all duration-1000"
          style={{ backgroundImage: `url(${ladyJusticeImg})` }}
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 vignette-overlay" />
      </div>

      {/* ================= TOP HEADER ================= */}
      <header className="relative z-10 w-full max-w-7xl flex justify-between items-center text-xs tracking-tighter uppercase text-white font-sans font-extrabold leading-[0.95]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer font-black tracking-tighter leading-[0.95]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-white font-bold tracking-tighter leading-[0.95]">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>eCourts Encrypted Auth</span>
        </div>
      </header>

      {/* ================= LOGIN FORM CONTAINER ================= */}
      <main className="relative z-10 w-full max-w-md flex flex-col items-center justify-center my-auto py-8">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
            LOGIN
          </h2>
          <p className="text-xs text-white/90 font-extrabold uppercase tracking-tighter leading-[0.95] mt-3 font-sans">
            Telangana Judiciary Intelligence Layer
          </p>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full glass-login rounded-2xl p-8 border border-white/10 relative overflow-hidden"
        >
          {/* Top Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-tighter leading-[0.95] text-white block font-sans">
                Email Address / Username
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@domain.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white font-bold tracking-tighter leading-[0.95] placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-tighter leading-[0.95] text-white block font-sans">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white font-bold tracking-tighter leading-[0.95] placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-white text-black font-black text-sm tracking-tighter leading-[0.95] hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg shadow-black/50 font-sans uppercase"
            >
              {isSubmitting ? (
                <span className="inline-block animate-pulse font-extrabold text-xs uppercase tracking-tighter leading-[0.95]">Authenticating...</span>
              ) : (
                <>
                  <span>Access Platform</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full max-w-7xl flex justify-between items-center text-[11px] text-slate-400 font-mono border-t border-white/10 pt-4">
        <span>Protected by eCourts Encrypted Auth Layer</span>
        <span>Demux Open Innovation</span>
      </footer>

    </div>
  );
}
