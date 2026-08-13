import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Mail, User, ShieldCheck, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ladyJusticeImg from '../assets/lady-justice.jpg';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 py-10 bg-[#07090e] overflow-hidden select-none dark-scrollbar">
      
      {/* BACKGROUND AMBIENT LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -inset-20 bg-cover bg-center filter blur-[110px] brightness-[0.35] saturate-[0.6] opacity-70 scale-110 transition-all duration-1000"
          style={{ backgroundImage: `url(${ladyJusticeImg})` }}
        />
        <div className="absolute inset-0 vignette-overlay" />
      </div>

      {/* TOP HEADER */}
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

      {/* REGISTER FORM CONTAINER */}
      <main className="relative z-10 w-full max-w-md flex flex-col items-center justify-center my-auto py-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl font-black text-white tracking-tighter leading-[0.95]">
            CREATE ACCOUNT
          </h2>
          <p className="text-xs text-white/90 font-extrabold uppercase tracking-tighter leading-[0.95] mt-3 font-sans">
            Citizen Registration Portal
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full glass-login rounded-2xl p-8 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-tighter leading-[0.95] text-white block font-sans">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Citizen Name"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white font-bold tracking-tighter leading-[0.95] placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-tighter leading-[0.95] text-white block font-sans">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@domain.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white font-bold tracking-tighter leading-[0.95] placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white font-bold tracking-tighter leading-[0.95] placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-tighter leading-[0.95] text-white block font-sans">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white font-bold tracking-tighter leading-[0.95] placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-white text-black font-black text-sm tracking-tighter leading-[0.95] hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg shadow-black/50 font-sans uppercase"
            >
              {isSubmitting ? (
                <span className="inline-block animate-pulse font-extrabold text-xs uppercase tracking-tighter leading-[0.95]">Registering...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-sans font-medium text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
              Login
            </button>
          </div>
        </motion.div>

      </main>

      <footer className="relative z-10 w-full max-w-7xl flex justify-between items-center text-[11px] text-slate-400 font-mono border-t border-white/10 pt-4">
        <span>Protected by eCourts Encrypted Auth Layer</span>
        <span>Demux Open Innovation</span>
      </footer>

    </div>
  );
}
