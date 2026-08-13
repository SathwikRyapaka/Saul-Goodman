import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe, Search, Loader2 } from 'lucide-react';
import { getLegalAuthorities } from '../services/legalService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
  "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
  "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
  "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
  "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet",
  "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
];

const LegalAuthorityFinder = () => {
  const { t } = useLanguage();
  const [district, setDistrict] = useState('');
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!district) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await getLegalAuthorities('Telangana', district);
      setAuthorities(data);
    } catch (error) {
      console.error(error);
      setAuthorities([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-6">
        <MapPin size={48} className="mx-auto text-orange-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Find Legal Services Authority</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Locate the official District Legal Services Authority in your area.</p>
      </div>

      <Card className="bg-slate-900 border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
            <select disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-300 opacity-70">
              <option>Telangana</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">District</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {TELANGANA_DISTRICTS.sort().map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button 
              className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 font-bold"
              onClick={handleSearch}
              disabled={loading || !district}
            >
              {loading ? <><Loader2 className="animate-spin mr-2" size={18} /> Searching...</> : 'Find Authority'}
            </Button>
          </div>
        </div>
      </Card>

      {hasSearched && !loading && authorities.length === 0 && (
        <Card className="text-center py-12 bg-white/5 border-dashed border-white/10">
          <p className="text-slate-400">Official contact information is not currently available in Nyaya Setu for this district.</p>
        </Card>
      )}

      {authorities.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-slate-300">Official Authority Information</h3>
          {authorities.map((auth, idx) => (
            <Card key={idx} className="border-l-4 border-l-orange-500 bg-slate-900">
              <h2 className="text-xl font-bold text-white mb-4">{auth.authority_name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {auth.address && (
                  <div className="flex gap-3">
                    <MapPin className="text-slate-400 shrink-0" size={20} />
                    <p className="text-slate-300 text-sm">{auth.address}</p>
                  </div>
                )}
                
                {auth.phone && (
                  <div className="flex gap-3">
                    <Phone className="text-slate-400 shrink-0" size={20} />
                    <p className="text-slate-300 text-sm">{auth.phone}</p>
                  </div>
                )}

                {auth.email && (
                  <div className="flex gap-3">
                    <Mail className="text-slate-400 shrink-0" size={20} />
                    <p className="text-slate-300 text-sm">{auth.email}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {auth.phone && (
                  <Button variant="outline" className="text-sm gap-2 border-white/20 hover:bg-white/10">
                    <Phone size={16} /> Call
                  </Button>
                )}
                {auth.website && (
                  <Button 
                    variant="outline" 
                    className="text-sm gap-2 border-white/20 hover:bg-white/10"
                    onClick={() => window.open(auth.website, '_blank')}
                  >
                    <Globe size={16} /> Official Website
                  </Button>
                )}
              </div>
              
              {auth.source && (
                <p className="text-xs text-slate-500 mt-4 text-right">Source: {auth.source}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LegalAuthorityFinder;
