import React from 'react';
import { User, Mail, Phone, Globe, Edit3, Key, Bell, FolderOpen, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const Profile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('profile')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center p-8">
            <div className="w-24 h-24 rounded-full bg-amber-500/20 border-4 border-white shadow-lg mx-auto flex items-center justify-center text-3xl font-bold text-amber-400 mb-4">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-sm text-slate-500 mb-6">Citizen Account</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div>
                <span className="block text-xl font-bold text-white">3</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{t('activeCases')}</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white">2</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Hearings</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg font-medium text-sm">
                <User size={18} /> Personal Info
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
                <Key size={18} /> {t('changePassword')}
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
                <Bell size={18} /> {t('notificationPreferences')}
              </button>
            </nav>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Personal Information</h3>
              <Button variant="outline" size="sm" className="h-8">
                <Edit3 size={14} className="mr-2" /> Edit
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-0.5">Full Name</span>
                  <span className="font-medium text-white">{user?.name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-0.5">Email Address</span>
                  <span className="font-medium text-white">{user?.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-0.5">Mobile Number</span>
                  <span className="font-medium text-white">+91 98765 43210</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-0.5">Preferred Language</span>
                  <span className="font-medium text-white">{language === 'en' ? 'English' : 'Telugu (తెలుగు)'}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
