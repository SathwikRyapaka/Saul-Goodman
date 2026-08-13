import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Search, Loader2, Info, Users, MapPin, Calendar, Activity, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { searchCases } from '../services/caseService';
import { explainCaseById } from '../services/aiService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';

const AIExplanation = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  
  const [explanationData, setExplanationData] = useState(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setError(null);
    setSelectedCase(null);
    setExplanationData(null);
    setSearchResults([]);

    try {
      const data = await searchCases(query);
      if (data && data.length > 0) {
        setSearchResults(data);
        if (data.length === 1) {
          setSelectedCase(data[0]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError("We couldn't find a case matching your search. Please check the Case Number or CNR Number.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleExplain = async () => {
    if (!selectedCase) return;
    setIsExplaining(true);
    setError(null);
    setExplanationData(null);

    try {
      const response = await explainCaseById(selectedCase._id);
      if (response && response.success && response.explanation) {
        setExplanationData(response);
      } else {
        setError("Could not generate an explanation at this time.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while preparing the explanation.");
    } finally {
      setIsExplaining(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'warning';
    return status.toLowerCase().includes('disposed') || status.toLowerCase().includes('decided') ? 'success' : 'warning';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center py-6">
        <BrainCircuit size={48} className="mx-auto text-amber-400 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">AI Case Explanation</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Understand your case information in simple language.</p>
      </div>

      {/* Search Box */}
      <Card className="bg-slate-900 border border-white/10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Search size={16} /> Search Case Number / CNR / Party
        </h3>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder="e.g. OS/118/2024 or TSME0A0018422024"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSearching || isExplaining}
            />
          </div>
          <Button type="submit" disabled={isSearching || isExplaining} className="px-8 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
            {isSearching ? <><Loader2 size={18} className="mr-2 animate-spin" /> Searching...</> : 'Search Case'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {hasSearched && !isSearching && searchResults.length === 0 && !error && (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-white">No case found.</h3>
          <p className="text-slate-500 mt-1">Please check the Case Number, CNR Number or party name.</p>
        </div>
      )}

      {/* Search Results (if > 1) */}
      {!selectedCase && searchResults.length > 1 && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-300">Select your case ({searchResults.length} found)</h3>
          {searchResults.map(caseItem => (
            <Card key={caseItem._id} className="border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-lg text-amber-400">{caseItem.case_number}</h4>
                <p className="text-sm text-slate-400 mt-1">CNR: {caseItem.cnr_number}</p>
                <p className="text-sm text-slate-500 mt-1">{caseItem.court_name}</p>
              </div>
              <Button onClick={() => setSelectedCase(caseItem)} className="bg-white/10 hover:bg-white/20 text-white">Select Case</Button>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Case Summary before Explanation */}
      {selectedCase && !explanationData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Search Result</h3>
          <Card className="border border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">{selectedCase.case_number}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                  <span className="font-mono bg-black/20 px-2 py-1 rounded">CNR: {selectedCase.cnr_number}</span>
                  <span className="bg-black/20 px-2 py-1 rounded">Court: {selectedCase.district}</span>
                </div>
                
                <div className="pt-3 flex items-center gap-2">
                  <span className="text-slate-500 text-sm">Status:</span>
                  <Badge status={getStatusColor(selectedCase.case_status)}>{selectedCase.case_status}</Badge>
                </div>
              </div>
              
              <div className="text-sm text-slate-300 space-y-2 bg-black/20 p-4 rounded-lg w-full md:w-auto min-w-[250px]">
                <div><span className="text-slate-500">Petitioner:</span> <span className="font-medium">{selectedCase.petitioners?.[0]?.name || 'N/A'}</span></div>
                <div><span className="text-slate-500">Respondent:</span> <span className="font-medium">{selectedCase.respondents?.[0]?.name || 'N/A'}</span></div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-amber-500/20 flex justify-end">
              <Button onClick={handleExplain} disabled={isExplaining} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-4 w-full md:w-auto text-lg shadow-lg shadow-amber-500/20">
                {isExplaining ? (
                  <><Loader2 size={20} className="mr-2 animate-spin" /> Reading case information...</>
                ) : (
                  <><BrainCircuit size={20} className="mr-2" /> Explain This Case</>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AI Explanation Result */}
      {explanationData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
          
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mt-8">
            <BrainCircuit className="text-amber-400" size={28} />
            <h2 className="text-2xl font-bold text-white">AI Case Explanation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Overview Card */}
            <Card className="bg-slate-900 border border-slate-800 md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                <Info size={18} /> 1. What is this case about?
              </h3>
              <p className="text-slate-200 text-lg leading-relaxed">
                {explanationData.explanation.case_overview}
              </p>
            </Card>

            {/* People Involved Card */}
            <Card className="bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                <Users size={18} /> 2. Who is involved?
              </h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {explanationData.explanation.people_involved}
              </p>
            </Card>

            {/* Where is the case Card */}
            <Card className="bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                <MapPin size={18} /> 3. Where is the case being heard?
              </h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {explanationData.explanation.court_information}
              </p>
            </Card>

            {/* Case Type & Identifiers */}
            <Card className="bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
                4. What type of case is it?
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                {explanationData.explanation.case_type}
              </p>
              
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
                5. Case Numbers
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {explanationData.explanation.case_identifiers}
              </p>
            </Card>

            {/* Status & Outcome */}
            <Card className="bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
                6. What is the current status?
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                {explanationData.explanation.current_status}
              </p>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
                7. Case Outcome
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {explanationData.explanation.outcome}
              </p>
            </Card>

            {/* Case Progress Timeline */}
            <Card className="bg-slate-900 border border-slate-800 md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-6 flex items-center gap-2">
                <Activity size={18} /> 8. What happened in the case?
              </h3>
              
              {explanationData.explanation.case_progress && explanationData.explanation.case_progress.length > 0 ? (
                <div className="relative border-l-2 border-white/10 ml-4 space-y-8 py-2">
                  {explanationData.explanation.case_progress.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500"></div>
                      <h4 className="font-bold text-white text-lg">{item.date}</h4>
                      {item.stage && <p className="text-amber-400 font-medium mt-1">{item.stage}</p>}
                      <p className="text-slate-400 mt-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No history available in the case record.</p>
              )}
            </Card>

            {/* Latest Update */}
            <Card className="bg-amber-500/10 border border-amber-500/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                <CheckCircle size={18} /> 9. What happened most recently?
              </h3>
              <p className="text-slate-200 leading-relaxed">
                {explanationData.explanation.latest_update}
              </p>
            </Card>

            {/* Next Step */}
            <Card className="bg-blue-500/10 border border-blue-500/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
                <ArrowRight size={18} /> 10. What happens next?
              </h3>
              <p className="text-slate-200 leading-relaxed">
                {explanationData.explanation.next_step}
              </p>
            </Card>

            {/* Legal Services Integration */}
            <Card className="bg-orange-500/10 border border-orange-500/30 md:col-span-2 flex flex-col sm:flex-row items-center justify-between p-6">
              <div className="flex items-start gap-4 mb-4 sm:mb-0">
                <Shield className="text-orange-400 shrink-0 mt-1" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Need Legal Assistance?</h3>
                  <p className="text-sm text-slate-300 max-w-lg">
                    Discover official legal services, free legal aid eligibility, mediation, and contact your local Legal Services Authority.
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate('/legal-services')} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto shrink-0 whitespace-nowrap">
                Explore Legal Services
              </Button>
            </Card>
            
            {/* Acts and Sections */}
            {explanationData.explanation.acts_and_sections && explanationData.explanation.acts_and_sections.length > 0 && (
              <Card className="bg-slate-900 border border-slate-800 md:col-span-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                  11. Acts and Sections
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {explanationData.explanation.acts_and_sections.map((act, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white font-medium">{act.act}</p>
                      {act.sections && <p className="text-slate-400 text-sm mt-1">Sections: {act.sections}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Disclaimer */}
            <div className="md:col-span-2 pt-8">
              <p className="text-center text-sm text-slate-500 max-w-3xl mx-auto p-4 bg-white/5 rounded-lg border border-white/5">
                {explanationData.disclaimer}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AIExplanation;
