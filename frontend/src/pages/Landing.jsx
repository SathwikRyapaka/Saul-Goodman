import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Sparkles, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ladyJusticeImg from '../assets/lady-justice.jpg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 py-10 bg-[#07090e] overflow-hidden select-none dark-scrollbar">
      
      {/* ================= BACKGROUND AMBIENT LAYER ================= */}
      {/* 1. Recognizable Lady Justice background image with subtle focus blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -inset-10 bg-cover bg-center filter blur-[8px] brightness-[0.42] saturate-[1.35] opacity-75 scale-105 transition-all duration-1000"
          style={{ backgroundImage: `url(${ladyJusticeImg})` }}
        />

        {/* 2. Cozy Ambient Blue & Gold Light Flow mesh */}
        <div className="absolute -top-32 right-10 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-sky-500/25 via-blue-600/15 to-amber-500/10 blur-[80px] animate-ambient-blue" />

        {/* 3. Tactile Film Grain / Micro-Pixelated Texture Overlay */}
        <div className="absolute inset-0 grain-overlay opacity-60 mix-blend-overlay" />

        {/* 4. Soft Dark Vignette Frame */}
        <div className="absolute inset-0 vignette-overlay" />
      </div>

      {/* ================= TOP HEADER ================= */}
      <header className="relative z-10 w-full max-w-7xl flex justify-between items-center text-xs tracking-tighter uppercase text-white font-sans font-extrabold leading-[0.95]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-black text-white tracking-tighter leading-[0.95]">Telangana Judiciary Layer</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-white/80 text-[11px] font-bold tracking-tighter leading-[0.95]">2026 Edition</span>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-black tracking-tighter leading-[0.95] flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/40"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Login to Portal</span>
          </button>
        </div>
      </header>

      {/* ================= HERO MIDDLE SECTION ================= */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center text-center my-auto py-12 px-4">
        
        {/* Top Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wider uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Stateful Legal Intelligence Platform</span>
        </motion.div>

        {/* MASSIVE HERO TITLE */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-[0.95] drop-shadow-2xl font-hero">
            NYAYA SETU
          </h1>
        </motion.div>

        {/* ONE LINE DESCRIPTION */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="text-sm sm:text-base md:text-lg font-bold text-white max-w-xl leading-[0.95] font-sans tracking-tighter"
        >
          An AI accessibility layer transforming dense court orders into plain-language summaries, visual stage trackers, and advocate preparation checklists.
        </motion.p>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 font-mono gap-2 border-t border-white/10 pt-4">
        <span>Privacy Policy & Legal Terms</span>
        <span>Telangana Revenue & Civil Court Protocol</span>
        <span>Demux Open Innovation</span>
      </footer>

    </div>
  );
}
