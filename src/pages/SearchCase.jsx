import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchCases } from '../services/caseService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const SearchCase = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const data = await searchCases(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('searchCase')}</h1>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? 'Searching...' : t('searchCase')}
          </Button>
        </form>
      </Card>

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-white">{t('noResults')}</h3>
          <p className="text-slate-500 mt-1">Try searching with a different CNR or case number.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-300">Search Results ({results.length})</h3>
          {results.map(caseItem => (
            <Card 
              key={caseItem.id} 
              className="cursor-pointer hover:border-primary-300 transition-colors group"
              onClick={() => navigate(`/cases/${caseItem.id}`)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-lg text-primary-700 group-hover:text-primary-800">{caseItem.caseNumber}</h4>
                  <p className="text-sm text-slate-500 font-mono mt-1">CNR: {caseItem.cnrNumber}</p>
                </div>
                <Badge status={caseItem.status === 'Pending' ? 'warning' : 'success'}>
                  {caseItem.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
                <div>
                  <span className="block text-slate-400 text-xs uppercase mb-1">{t('court')}</span>
                  <span className="font-medium text-slate-200">{caseItem.court}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs uppercase mb-1">{t('category')}</span>
                  <span className="font-medium text-slate-200">{caseItem.category}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs uppercase mb-1">{t('currentStage')}</span>
                  <span className="font-medium text-slate-200">{caseItem.currentStage}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs uppercase mb-1">{t('nextHearing')}</span>
                  <span className="font-medium text-slate-200">{new Date(caseItem.nextHearing).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCase;
