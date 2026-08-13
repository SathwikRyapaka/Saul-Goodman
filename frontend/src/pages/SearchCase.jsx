import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchCases } from '../services/caseService';
import { addToMyCases, checkMyCasesStatus } from '../services/myCaseService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const SearchCase = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [savedCases, setSavedCases] = useState({}); // { caseId: boolean }
  const [savingId, setSavingId] = useState(null);
  
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      const data = await searchCases(query);
      setResults(data);
      
      if (isAuthenticated && data.length > 0) {
        const ids = data.map(c => c._id);
        const checkRes = await checkMyCasesStatus(ids);
        if (checkRes.success) {
          setSavedCases(checkRes.statuses);
        }
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMyCases = async (e, caseId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setSavingId(caseId);
    try {
      await addToMyCases(caseId);
      setSavedCases(prev => ({ ...prev, [caseId]: true }));
      // Optional: Add toast notification here
    } catch (err) {
      console.error(err);
      // Optional: Add error toast here
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Search Court Cases</h1>
        <p className="text-slate-400">Search using Case Number, CNR Number, or party name</p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder="e.g. OS/118/2024 or TSME0A0018422024"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-white">No case found</h3>
          <p className="text-slate-500 mt-1">Please check the Case Number or CNR Number and try again.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-300">Search Results ({results.length})</h3>
          {results.map(caseItem => {
            const petitioner = caseItem.petitioners && caseItem.petitioners.length > 0 ? caseItem.petitioners[0].name : "Unknown";
            const respondent = caseItem.respondents && caseItem.respondents.length > 0 ? caseItem.respondents[0].name : "Unknown";
            
            return (
              <Card 
                key={caseItem._id} 
                className="cursor-pointer hover:border-amber-500/50 transition-colors group"
                onClick={() => navigate(`/cases/${caseItem._id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-lg text-amber-400 group-hover:text-amber-400">{caseItem.case_number}</h4>
                    <p className="text-sm text-slate-500 font-mono mt-1">CNR: {caseItem.cnr_number}</p>
                  </div>
                  <Badge status={caseItem.case_status === 'Pending' ? 'warning' : 'success'}>
                    {caseItem.case_status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">{t('court')}</span>
                    <span className="font-medium text-slate-200">{caseItem.court_name}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">{t('category')}</span>
                    <span className="font-medium text-slate-200">{caseItem.case_type}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">{t('petitioner')}</span>
                    <span className="font-medium text-slate-200">{petitioner}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">{t('respondent')}</span>
                    <span className="font-medium text-slate-200">{respondent}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3 items-center">
                  {isAuthenticated && (
                    <Button 
                      variant="outline" 
                      className={`text-sm ${savedCases[caseItem._id] ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-slate-500/30 text-slate-300 hover:bg-slate-500/20'}`}
                      disabled={savedCases[caseItem._id] || savingId === caseItem._id}
                      onClick={(e) => handleSaveToMyCases(e, caseItem._id)}
                    >
                      {savingId === caseItem._id ? 'Saving...' : (savedCases[caseItem._id] ? '✓ Added to My Cases' : '+ Add to My Cases')}
                    </Button>
                  )}
                  {!isAuthenticated && (
                    <Button 
                      variant="outline" 
                      className="text-sm bg-white/5 border-slate-500/30 text-slate-300 hover:bg-slate-500/20"
                      onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
                    >
                      Login to Save
                    </Button>
                  )}
                  <Button variant="outline" className="text-sm bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
                    View Case Details
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default SearchCase;
