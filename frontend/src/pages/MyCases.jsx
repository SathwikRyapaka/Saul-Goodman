import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BrainCircuit, FileText, Bookmark, X } from 'lucide-react';
import { getMyCases, removeFromMyCases } from '../services/myCaseService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const CaseCard = ({ caseItem, t, onNavigate, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (window.confirm("Remove this case from My Cases?")) {
      setRemoving(true);
      try {
        await onRemove(caseItem._id);
      } catch (err) {
        console.error("Failed to remove case", err);
      } finally {
        setRemoving(false);
      }
    }
  };

  const petitioner = caseItem.petitioners && caseItem.petitioners.length > 0 ? caseItem.petitioners[0].name : "Unknown";
  const respondent = caseItem.respondents && caseItem.respondents.length > 0 ? caseItem.respondents[0].name : "Unknown";

  return (
    <Card className="hover:border-amber-500/50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h3 className="font-bold text-lg text-amber-400">{caseItem.case_number}</h3>
          <p className="text-sm text-slate-500 font-mono">CNR: {caseItem.cnr_number}</p>
        </div>
        <Badge status={caseItem.case_status === 'Pending' ? 'warning' : 'success'}>
          {caseItem.case_status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 text-sm mb-6 pt-4 border-t border-slate-100/10">
        <div>
          <span className="block text-slate-500 text-xs uppercase mb-0.5">{t('court')}</span>
          <span className="font-medium text-slate-200">{caseItem.court_name}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs uppercase mb-0.5">{t('category')}</span>
          <span className="font-medium text-slate-200">{caseItem.case_type}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs uppercase mb-0.5">{t('petitioner')}</span>
          <span className="font-medium text-slate-200">{petitioner}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs uppercase mb-0.5">{t('respondent')}</span>
          <span className="font-medium text-slate-200">{respondent}</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Saved On</span>
          <span className="font-semibold text-slate-300">{new Date(caseItem.saved_at).toLocaleDateString()}</span>
        </div>
        <div className="text-right">
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Next Hearing</span>
          <span className="font-semibold text-slate-200">{caseItem.first_hearing_date || 'N/A'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100/10">
        <Button className="flex-1" onClick={() => onNavigate(`/cases/${caseItem._id}`)}>{t('viewCase')}</Button>
        <Button 
          variant="outline" 
          className="flex-1 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
          onClick={handleRemove}
          disabled={removing}
        >
          {removing ? 'Removing...' : 'Remove from My Cases'}
        </Button>
      </div>
    </Card>
  );
};

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    setLoading(true);
    try {
      const data = await getMyCases();
      setCases(data.cases || []);
    } catch (err) {
      setError("Failed to load saved cases.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (caseId) => {
    await removeFromMyCases(caseId);
    setCases(prev => prev.filter(c => c._id !== caseId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">My Cases</h1>
          <p className="text-slate-500 mt-1">Cases you have saved for quick access</p>
        </div>
        <div className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-lg text-sm font-bold border border-amber-500/20">
          Cases Saved: {cases.length}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {cases.length === 0 && !error ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">My Cases is empty</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            You haven't saved any cases yet. Search for a case and click 
            <span className="text-amber-400 mx-1 font-bold">+ Add to My Cases</span> 
            to save it here.
          </p>
          <Button onClick={() => navigate('/search')}>Search Cases</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map(c => (
            <CaseCard key={c._id} caseItem={c} t={t} onNavigate={navigate} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCases;
