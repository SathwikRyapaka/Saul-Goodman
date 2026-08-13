import React, { useState, useEffect } from 'react';
import { BrainCircuit, Volume2, Search, Loader2 } from 'lucide-react';
import { explainCase } from '../services/aiService';
import { getCases } from '../services/caseService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const AIExplanation = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();

  useEffect(() => {
    getCases().then(data => {
      setCases(data);
      if (data.length > 0) {
        setSelectedCase(data[0].id);
      }
    });
  }, []);

  const handleExplain = async () => {
    if (!selectedCase) return;
    setLoading(true);
    const data = await explainCase(selectedCase, language);
    setExplanation(data);
    setLoading(false);
  };

  const handleListen = () => {
    if (!explanation) return;
    const text = Object.values(explanation).join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-IN' : 'te-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <BrainCircuit size={48} className="mx-auto text-amber-400 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">{t('aiCaseExplanation')}</h1>
        <p className="text-slate-400 max-w-lg mx-auto">{t('aiExplanationSubtitle')}</p>
      </div>

      <Card className="bg-amber-500/10 border-none">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select 
            className="flex-1 w-full bg-white/5 border-0 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.caseNumber} - {c.category}</option>
            ))}
          </select>
          <Button 
            className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-500"
            onClick={handleExplain}
            disabled={loading}
          >
            {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Analyzing...</> : 'Generate Explanation'}
          </Button>
        </div>
      </Card>

      {explanation && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${language === 'en' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-white/5'}`}
                onClick={() => language !== 'en' && toggleLanguage()}
              >
                English
              </button>
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${language === 'te' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-white/5'}`}
                onClick={() => language !== 'te' && toggleLanguage()}
              >
                తెలుగు
              </button>
            </div>
            
            <Button variant="outline" className="gap-2" onClick={handleListen}>
              <Volume2 size={18} /> {t('listen')}
            </Button>
          </div>

          <Card className="border-t-4 border-t-primary-500">
            <h3 className="text-xl font-bold text-white mb-3">{t('caseSummary')}</h3>
            <p className="text-slate-300 text-lg leading-relaxed">{explanation.caseSummary}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-bold text-white mb-3">{t('currentPosition')}</h3>
              <p className="text-slate-300 leading-relaxed">{explanation.currentPosition}</p>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-white mb-3">{t('recentProceedings')}</h3>
              <p className="text-slate-300 leading-relaxed">{explanation.recentProceedings}</p>
            </Card>
            <Card className="md:col-span-2 bg-orange-50 border-orange-100">
              <h3 className="text-lg font-bold text-orange-900 mb-3">{t('nextHearing')}</h3>
              <p className="text-orange-800 leading-relaxed font-medium">{explanation.nextHearing}</p>
            </Card>
            <Card className="bg-amber-500/20 border-amber-500/30">
              <h3 className="text-lg font-bold text-amber-400 mb-3">{t('importantPoints')}</h3>
              <ul className="list-disc pl-5 space-y-2 text-amber-400">
                {explanation.importantPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <h3 className="text-lg font-bold text-green-900 mb-3">{t('whatThisMeans')}</h3>
              <p className="text-green-800 leading-relaxed">{explanation.whatThisMeans}</p>
            </Card>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8 mb-4 max-w-2xl mx-auto">
            {t('disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIExplanation;
