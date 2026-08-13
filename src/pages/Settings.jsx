import React, { useState } from 'react';
import { Bell, Globe, Accessibility, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  
  const [notifications, setNotifications] = useState({
    hearings: true,
    caseUpdates: true,
    documents: false,
    email: true,
    sms: true
  });

  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
    voiceAssistance: true
  });

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAccess = (key) => {
    setAccessibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ checked, onChange }) => (
    <button 
      type="button" 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${checked ? 'bg-amber-500' : 'bg-white/10'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white/5 shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('settings')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-1 sticky top-6">
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg font-medium text-sm">
              <Bell size={18} /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
              <Globe size={18} /> Language
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
              <Accessibility size={18} /> Accessibility
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
              <Lock size={18} /> Privacy
            </button>
          </nav>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Bell className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Notification Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Hearing Reminders</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Get notified about upcoming hearings.</p>
                </div>
                <Toggle checked={notifications.hearings} onChange={() => toggleNotif('hearings')} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Case Updates</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Get notified when proceedings are added.</p>
                </div>
                <Toggle checked={notifications.caseUpdates} onChange={() => toggleNotif('caseUpdates')} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Document Updates</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Get notified when new documents are available.</p>
                </div>
                <Toggle checked={notifications.documents} onChange={() => toggleNotif('documents')} />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-medium text-white mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Email Notifications</span>
                    <Toggle checked={notifications.email} onChange={() => toggleNotif('email')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">SMS Notifications</span>
                    <Toggle checked={notifications.sms} onChange={() => toggleNotif('sms')} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Globe className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Language</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-white/5 transition-colors border-white/10">
                <input 
                  type="radio" 
                  name="language" 
                  checked={language === 'en'} 
                  onChange={() => setLanguage('en')}
                  className="w-4 h-4 text-amber-400 focus:ring-amber-500 border-white/20"
                />
                <div className="ml-3">
                  <span className="block font-medium text-white">English</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-white/5 transition-colors border-white/10">
                <input 
                  type="radio" 
                  name="language" 
                  checked={language === 'te'} 
                  onChange={() => setLanguage('te')}
                  className="w-4 h-4 text-amber-400 focus:ring-amber-500 border-white/20"
                />
                <div className="ml-3">
                  <span className="block font-medium text-white">Telugu (తెలుగు)</span>
                </div>
              </label>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Accessibility className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Accessibility</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Larger Text</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Increase the base font size of the application.</p>
                </div>
                <Toggle checked={accessibility.largeText} onChange={() => toggleAccess('largeText')} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">High Contrast</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Increase contrast for better readability.</p>
                </div>
                <Toggle checked={accessibility.highContrast} onChange={() => toggleAccess('highContrast')} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Voice Assistance Support</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Enable spoken feedback for actions.</p>
                </div>
                <Toggle checked={accessibility.voiceAssistance} onChange={() => toggleAccess('voiceAssistance')} />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
