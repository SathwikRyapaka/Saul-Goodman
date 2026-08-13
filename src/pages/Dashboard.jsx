import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderOpen, Calendar, FileText, Bell, Mic } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../services/caseService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const pieData = [
    { name: 'Civil', value: 400, color: '#6366f1' },
    { name: 'Family', value: 300, color: '#ec4899' },
    { name: 'Property', value: 300, color: '#14b8a6' },
    { name: 'Consumer', value: 200, color: '#f59e0b' },
  ];

  const barData = [
    { name: 'Notice', value: 4 },
    { name: 'Evidence', value: 3 },
    { name: 'Mediation', value: 2 },
    { name: 'Arguments', value: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('goodMorning')}, {user?.name}</h1>
        <p className="text-slate-500 mt-1">{t('overviewSubtitle')}</p>
      </div>

      {/* Main Action Bar */}
      <Card className="flex flex-col sm:flex-row items-center gap-4 bg-amber-500/10 text-white border-none">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={() => navigate('/search')}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-500 text-white" onClick={() => navigate('/search')}>
            {t('searchCase')}
          </Button>
          <Button className="flex-1 sm:flex-none bg-white/5 text-amber-400 hover:bg-white/5" onClick={() => navigate('/voice')}>
            <Mic size={18} className="mr-2" /> {t('useVoice')}
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('activeCases'), value: stats?.activeCases || 0, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('upcomingHearings'), value: stats?.upcomingHearings || 0, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: t('documents'), value: stats?.documents || 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: t('recentUpdates'), value: stats?.recentUpdates || 0, icon: Bell, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stat.value === null ? '-' : stat.value}</p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-lg text-slate-200 mb-6">Case Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm mt-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-400">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg text-slate-200 mb-6">Case Stages</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
