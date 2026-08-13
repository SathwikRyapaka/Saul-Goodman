import React, { useState } from 'react';
import { Bell, Calendar, FileText, Activity, Trash2, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockNotifications } from '../data/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

const Notifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type) => {
    switch(type) {
      case 'hearing': return <Calendar size={20} className="text-orange-600" />;
      case 'document': return <FileText size={20} className="text-indigo-600" />;
      case 'update': return <Activity size={20} className="text-blue-600" />;
      default: return <Bell size={20} className="text-slate-400" />;
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'hearing': return 'bg-orange-100';
      case 'document': return 'bg-indigo-100';
      case 'update': return 'bg-blue-100';
      default: return 'bg-white/5';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {t('notifications')}
            {unreadCount > 0 && (
              <span className="bg-amber-500/20 text-amber-400 py-0.5 px-2.5 rounded-full text-sm font-bold">
                {unreadCount} New
              </span>
            )}
          </h1>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="text-sm">
            <CheckCircle size={16} className="mr-2" /> {t('markAllAsRead')}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="text-center py-12">
            <Bell className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-white mb-1">No notifications</h3>
            <p className="text-slate-500">You're all caught up!</p>
          </Card>
        ) : (
          notifications.map(n => (
            <Card key={n.id} className={cn("flex gap-4 p-5 transition-colors", !n.read ? "bg-amber-500/20/50 border-amber-500/30" : "")}>
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1", getBg(n.type))}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={cn("font-semibold", !n.read ? "text-amber-400" : "text-white")}>
                    {n.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-4">
                    {new Date(n.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{n.message}</p>
                
                <div className="flex gap-4">
                  {!n.read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="text-xs font-medium text-amber-400 hover:text-amber-400"
                    >
                      {t('markAsRead')}
                    </button>
                  )}
                  <button 
                    onClick={() => clearNotification(n.id)}
                    className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> {t('clearNotification')}
                  </button>
                </div>
              </div>
              
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-2"></div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
