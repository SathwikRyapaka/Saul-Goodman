import React from 'react';
import { Calendar, Bell, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { mockCases } from '../data/mockData';

const Hearings = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{t('hearingsReminders')}</h1>
        <Button variant="outline"><Bell size={18} className="mr-2" /> Reminder Preferences</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-slate-200">Upcoming Hearings</h2>
          
          <div className="space-y-4">
            {mockCases.map(c => (
              <Card key={c.id} className="flex flex-col sm:flex-row gap-6 p-0 overflow-hidden">
                <div className="bg-amber-500/20 p-6 flex flex-col justify-center items-center min-w-[120px] border-r border-amber-500/30">
                  <span className="text-4xl font-bold text-amber-400">
                    {new Date(c.nextHearing).getDate()}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-amber-400 mt-1">
                    {new Date(c.nextHearing).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white">{c.caseNumber}</h3>
                    <p className="text-slate-500 font-medium">{c.category}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <span className="block text-slate-400 mb-0.5">Court</span>
                        <span className="font-medium text-slate-300">{c.court}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 mb-0.5">Stage</span>
                        <span className="font-medium text-amber-400">{c.currentStage}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <Button variant="secondary" className="text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
                      <Bell size={16} className="mr-2" /> Set Reminder
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-200">Calendar</h3>
              <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-slate-400">&lt;</button>
                <span className="font-medium text-sm">August 2026</span>
                <button className="text-slate-400 hover:text-slate-400">&gt;</button>
              </div>
            </div>
            
            {/* Simple mock calendar view */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({length: 31}).map((_, i) => {
                const isHearingDay = [20, 25].includes(i + 1);
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center rounded-full cursor-pointer hover:bg-white/5 transition-colors ${
                      isHearingDay ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/50' : 'text-slate-300'
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Legend</h4>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></span>
                Hearing Scheduled
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hearings;
