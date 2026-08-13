import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BrainCircuit, FileText } from 'lucide-react';
import { getCases } from '../services/caseService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const CaseCard = ({ data, t, onNavigate }) => {
  return (
    <Card className="hover:border-primary-300 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h3 className="font-bold text-lg text-white">{data.caseNumber}</h3>
          <p className="text-sm text-slate-500 font-mono">CNR: {data.cnrNumber}</p>
        </div>
        <Badge status={data.status === 'Pending' ? 'warning' : 'success'}>
          {data.status === 'Pending' ? '● ' : '✓ '} {data.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
        <div>
          <span className="block text-slate-500 mb-0.5">{t('court')}</span>
          <span className="font-medium text-slate-200">{data.court}</span>
        </div>
        <div>
          <span className="block text-slate-500 mb-0.5">{t('category')}</span>
          <span className="font-medium text-slate-200">{data.category}</span>
        </div>
        <div>
          <span className="block text-slate-500 mb-0.5">{t('petitioner')}</span>
          <span className="font-medium text-slate-200">{data.petitioner}</span>
        </div>
        <div>
          <span className="block text-slate-500 mb-0.5">{t('respondent')}</span>
          <span className="font-medium text-slate-200">{data.respondent}</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{t('currentStage')}</span>
          <span className="font-semibold text-primary-700">{data.currentStage}</span>
        </div>
        <div className="text-right">
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{t('nextHearing')}</span>
          <span className="font-semibold text-slate-200">{new Date(data.nextHearing).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" onClick={() => onNavigate(`/cases/${data.id}`)}>{t('viewCase')}</Button>
        <Button variant="outline" className="flex-1" onClick={() => onNavigate(`/cases/${data.id}?tab=timeline`)}>{t('timeline')}</Button>
        <Button variant="secondary" className="flex-none text-primary-700 border-primary-200 bg-primary-50" onClick={() => onNavigate('/ai-explain')}>
          <BrainCircuit size={18} />
        </Button>
      </div>
    </Card>
  );
};

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('All');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    getCases().then(setCases);
  }, []);

  const categories = ['All', 'Civil', 'Consumer', 'Family', 'Property', 'Motor Accident'];
  const filteredCases = filter === 'All' ? cases : cases.filter(c => c.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('myCases')}</h1>
          <p className="text-slate-500 mt-1">Manage and track your active cases.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === c 
                ? 'bg-primary-700 text-white' 
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/5'
            }`}
          >
            {t(c.toLowerCase()) || c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map(c => (
          <CaseCard key={c.id} data={c} t={t} onNavigate={navigate} />
        ))}
      </div>
    </div>
  );
};

export default MyCases;
