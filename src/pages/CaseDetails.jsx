import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { BrainCircuit, Download, FileText, CheckCircle2, Clock, Circle } from 'lucide-react';
import { getCaseById, getCaseTimeline, getCaseProceedings } from '../services/caseService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

const TimelineTab = ({ caseId }) => {
  const [timeline, setTimeline] = useState([]);
  
  useEffect(() => {
    getCaseTimeline(caseId).then(setTimeline);
  }, [caseId]);

  return (
    <div className="py-4">
      <div className="relative border-l-2 border-white/10 ml-4 space-y-8">
        {timeline.map((item, index) => (
          <div key={item.id} className="relative pl-8">
            <div className={`absolute -left-[11px] bg-white/5 p-1 rounded-full 
              ${item.status === 'completed' ? 'text-green-500' : 
                item.status === 'current' ? 'text-primary-600' : 'text-slate-300'}`}
            >
              {item.status === 'completed' ? <CheckCircle2 size={16} /> : 
               item.status === 'current' ? <Circle size={16} fill="currentColor" /> : 
               <Circle size={16} />}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
              <h4 className={`font-semibold text-lg ${item.status === 'upcoming' ? 'text-slate-500' : 'text-white'}`}>
                {item.stage}
              </h4>
              {item.date && <span className="text-sm font-medium text-slate-500">{new Date(item.date).toLocaleDateString()}</span>}
            </div>
            
            {item.status === 'current' && (
              <Badge status="primary" className="mb-2 uppercase text-[10px]">Current Stage</Badge>
            )}
            
            <p className="text-slate-400 text-sm mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProceedingsTab = ({ caseId }) => {
  const [proceedings, setProceedings] = useState([]);

  useEffect(() => {
    getCaseProceedings(caseId).then(setProceedings);
  }, [caseId]);

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-200">Recent Proceedings</h3>
        <select className="border border-white/20 rounded-lg text-sm px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500 outline-none">
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {proceedings.map(proc => (
        <Card key={proc.id} className="hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-primary-700 font-semibold">{proc.stage}</span>
            </div>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <Clock size={14} /> {new Date(proc.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{proc.description}</p>
        </Card>
      ))}
    </div>
  );
};

const CaseDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [caseData, setCaseData] = useState(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const tab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    getCaseById(id).then(setCaseData);
  }, [id]);

  if (!caseData) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'timeline', label: t('timeline') },
    { id: 'proceedings', label: t('proceedings') },
    { id: 'documents', label: t('documents') },
    { id: 'ai', label: t('aiExplain') },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{caseData.category}</h1>
            <div className="flex items-center gap-3 text-slate-300">
              <span className="font-medium text-lg">{caseData.caseNumber}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="font-mono text-sm">CNR: {caseData.cnrNumber}</span>
            </div>
          </div>
          <Button className="bg-white/5 text-white hover:bg-white/5" onClick={() => navigate('/ai-explain')}>
            <BrainCircuit size={18} className="mr-2 text-primary-600" />
            {t('aiExplain')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="border-b border-white/10">
            <nav className="flex space-x-6 overflow-x-auto">
              {tabs.map((tItem) => (
                <button
                  key={tItem.id}
                  onClick={() => setSearchParams({ tab: tItem.id })}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    tab === tItem.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/20'
                  }`}
                >
                  {tItem.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-2">
            {tab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-sm">
                    <div>
                      <span className="block text-slate-500 mb-1">Filing Date</span>
                      <span className="font-medium text-white">{new Date(caseData.filingDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">{t('status')}</span>
                      <Badge status={caseData.status === 'Pending' ? 'warning' : 'success'}>{caseData.status}</Badge>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">{t('currentStage')}</span>
                      <span className="font-medium text-primary-700">{caseData.currentStage}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3 pt-4 border-t border-slate-100">
                      <span className="block text-slate-500 mb-1">{t('court')}</span>
                      <span className="font-medium text-white">{caseData.court}, {caseData.district}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Parties Involved</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-lg border border-slate-100">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">{t('petitioner')}</span>
                      <span className="text-lg font-medium text-white">{caseData.petitioner}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-slate-100">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">{t('respondent')}</span>
                      <span className="text-lg font-medium text-white">{caseData.respondent}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {tab === 'timeline' && <TimelineTab caseId={caseData.id} />}
            
            {tab === 'proceedings' && <ProceedingsTab caseId={caseData.id} />}
            
            {tab === 'documents' && (
              <div className="text-center py-12">
                <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-white mb-2">View Documents</h3>
                <p className="text-slate-500 mb-6">Access all documents related to this case in the Document Center.</p>
                <Button onClick={() => navigate('/documents')}>Go to Document Center</Button>
              </div>
            )}

            {tab === 'ai' && (
              <div className="text-center py-12 bg-primary-50 rounded-xl border border-primary-100">
                <BrainCircuit className="mx-auto text-primary-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-primary-900 mb-2">AI Case Explanation</h3>
                <p className="text-primary-700/80 mb-6 max-w-md mx-auto">Get a simple, easy-to-understand summary of your case status and what it means for you.</p>
                <Button onClick={() => navigate('/ai-explain')}>Generate Explanation</Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card className="bg-primary-50 border-primary-100">
            <h3 className="font-semibold text-primary-900 mb-2">Next Hearing</h3>
            <div className="flex items-center gap-3 text-primary-700 mb-4">
              <Calendar size={20} />
              <span className="text-lg font-bold">{new Date(caseData.nextHearing).toLocaleDateString()}</span>
            </div>
            <Button variant="outline" className="w-full bg-white/5">Set Reminder</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
