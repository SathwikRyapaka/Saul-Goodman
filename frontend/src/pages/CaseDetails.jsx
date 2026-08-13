import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { BrainCircuit, Download, FileText, CheckCircle2, Clock, Circle, Calendar } from 'lucide-react';
import { getCaseById } from '../services/caseService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

const TimelineTab = ({ history }) => {
  if (!history || history.length === 0) return <div className="text-slate-400 py-4">No case history available.</div>;

  return (
    <div className="py-4">
      <div className="relative border-l-2 border-white/10 ml-4 space-y-8">
        {history.map((item, index) => {
          const isCurrent = index === history.length - 1;
          const isCompleted = index < history.length - 1;
          return (
            <div key={index} className="relative pl-8">
              <div className={`absolute -left-[11px] bg-slate-900 p-1 rounded-full 
                ${isCompleted ? 'text-green-500' : 
                  isCurrent ? 'text-amber-400' : 'text-slate-300'}`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : 
                 isCurrent ? <Circle size={16} fill="currentColor" /> : 
                 <Circle size={16} />}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                <h4 className={`font-semibold text-lg ${isCompleted ? 'text-white' : 'text-amber-400'}`}>
                  Hearing Date: {item.business_date}
                </h4>
                {item.next_hearing_date && <span className="text-sm font-medium text-slate-500">Next: {item.next_hearing_date}</span>}
              </div>
              
              {isCurrent && (
                <Badge status="primary" className="mb-2 uppercase text-[10px]">Current Status</Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CaseDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const tab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const data = await getCaseById(id);
        if (data) setCaseData(data);
        else setError("Case not found.");
      } catch (err) {
        setError("Error loading case details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-amber-500">Loading Case Details...</div>;
  if (error || !caseData) return <div className="p-8 text-center text-red-500">{error || "Case not found."}</div>;

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'timeline', label: t('timeline') }
  ];

  const getStatusColor = (status) => {
    if (!status) return 'warning';
    return status.toLowerCase().includes('disposed') || status.toLowerCase().includes('decided') ? 'success' : 'warning';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-amber-400">{caseData.case_number}</h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-300 mt-3">
              <span className="font-medium bg-white/10 px-3 py-1 rounded-md text-sm">{caseData.case_type}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden sm:block"></span>
              <span className="font-mono text-sm tracking-wider">CNR: {caseData.cnr_number}</span>
            </div>
          </div>
          <Badge status={getStatusColor(caseData.case_status)} className="text-sm px-4 py-1.5">
            {caseData.case_status}
          </Badge>
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
                      ? 'border-amber-500 text-amber-400'
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
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 border-b border-white/10 pb-2">Court Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 text-sm">
                    <div>
                      <span className="block text-slate-500 mb-1">State / District</span>
                      <span className="font-medium text-white">{caseData.state} / {caseData.district}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Court Complex</span>
                      <span className="font-medium text-white">{caseData.court_complex}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-slate-500 mb-1">Court Name</span>
                      <span className="font-medium text-white">{caseData.court_name}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 border-b border-white/10 pb-2">Case Registration Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-sm">
                    <div>
                      <span className="block text-slate-500 mb-1">Filing Number</span>
                      <span className="font-medium text-white">{caseData.filing_number}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Filing Date</span>
                      <span className="font-medium text-white">{caseData.filing_date}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Registration Date</span>
                      <span className="font-medium text-white">{caseData.registration_date}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 border-b border-white/10 pb-2">Parties Involved</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 block">{t('petitioner')}s</span>
                      {caseData.petitioners && caseData.petitioners.length > 0 ? (
                        caseData.petitioners.map((p, i) => (
                          <div key={i} className="mb-2 last:mb-0">
                            <div className="text-sm font-medium text-white">{p.name}</div>
                            {p.advocate && <div className="text-xs text-slate-400 mt-1">Advocate: {p.advocate}</div>}
                          </div>
                        ))
                      ) : <span className="text-sm text-slate-500">Not Available</span>}
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 block">{t('respondent')}s</span>
                      {caseData.respondents && caseData.respondents.length > 0 ? (
                        caseData.respondents.map((r, i) => (
                          <div key={i} className="mb-2 last:mb-0">
                            <div className="text-sm font-medium text-white">{r.name}</div>
                            {r.advocate && <div className="text-xs text-slate-400 mt-1">Advocate: {r.advocate}</div>}
                          </div>
                        ))
                      ) : <span className="text-sm text-slate-500">Not Available</span>}
                    </div>
                  </div>
                </Card>
                
                {caseData.under_acts && caseData.under_acts.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-semibold text-amber-400 mb-4 border-b border-white/10 pb-2">Acts and Sections</h3>
                    <div className="space-y-3">
                      {caseData.under_acts.map((actItem, idx) => (
                        <div key={idx} className="bg-white/5 p-3 rounded text-sm">
                          <span className="text-white font-medium block mb-1">{actItem.act}</span>
                          {actItem.sections && actItem.sections.length > 0 && (
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Sections: {actItem.sections.join(', ')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {tab === 'timeline' && <TimelineTab history={caseData.case_history} />}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card className="bg-amber-500/10 border-amber-500/30">
            <h3 className="font-semibold text-amber-400 mb-4">Case Status Details</h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-slate-500 text-xs uppercase mb-1">First Hearing Date</span>
                <span className="font-medium text-white">{caseData.first_hearing_date || 'N/A'}</span>
              </div>
              
              {caseData.decision_date && (
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">Decision Date</span>
                  <span className="font-medium text-white">{caseData.decision_date}</span>
                </div>
              )}
              
              {caseData.nature_of_disposal && (
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">Nature of Disposal</span>
                  <Badge status="success" className="text-xs">{caseData.nature_of_disposal}</Badge>
                </div>
              )}
              
              {caseData.last_order && (
                <div className="pt-2 border-t border-white/10">
                  <span className="block text-amber-400/80 text-xs uppercase mb-1">Last Order</span>
                  <span className="font-medium text-white text-sm leading-relaxed">{caseData.last_order}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-2">Need Legal Assistance?</h3>
            <p className="text-sm text-slate-300 mb-4">
              If you need help understanding this case or require legal representation, you may be eligible for free legal aid or mediation services.
            </p>
            <Button 
              onClick={() => navigate('/legal-services')} 
              className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
            >
              Explore Legal Services
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
