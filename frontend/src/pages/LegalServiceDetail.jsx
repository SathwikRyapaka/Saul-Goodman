import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, FileText, Globe, Loader2 } from 'lucide-react';
import { getLegalServiceByType } from '../services/legalService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

const LegalServiceDetail = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const data = await getLegalServiceByType(serviceType);
        if (data) {
          setService(data);
        } else {
          setError("Service information could not be found.");
        }
      } catch (err) {
        setError("Failed to load service information.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 size={48} className="animate-spin text-amber-500 mb-4" />
        <p>Loading legal service information...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Not Found</h2>
        <p className="text-slate-400 mb-6">{error || "No matching legal service was found."}</p>
        <Button onClick={() => navigate('/legal-services')} variant="outline">
          Back to Legal Services
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <button 
        onClick={() => navigate('/legal-services')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} /> Back to Services
      </button>

      <div className="border-b border-white/10 pb-6">
        <h1 className="text-4xl font-bold text-white mb-4">{service.title}</h1>
        <p className="text-lg text-slate-300 leading-relaxed bg-amber-500/10 p-6 rounded-xl border border-amber-500/20">
          {service.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Eligibility Rules */}
          {service.eligibility_information && service.eligibility_information.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-green-400" /> General Eligibility
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                This is general eligibility information. Final eligibility should be confirmed by the appropriate Legal Services Authority.
              </p>
              <div className="space-y-4">
                {service.eligibility_information.map((item, idx) => (
                  <Card key={idx} className="bg-slate-900 border-white/5">
                    <h3 className="font-bold text-amber-400 mb-1">{item.category}</h3>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                    {item.source && <p className="text-xs text-slate-500 mt-2">Source: {item.source}</p>}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Process Timeline */}
          {service.process_steps && service.process_steps.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">How it Works</h2>
              <div className="relative border-l-2 border-white/10 ml-4 space-y-8 py-2">
                {service.process_steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-xs font-bold text-white">
                      {step.stepNumber}
                    </div>
                    <h3 className="font-bold text-white text-lg">{step.title}</h3>
                    <p className="text-slate-400 mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Documents Checklist */}
          {service.documents_information && service.documents_information.length > 0 && (
            <Card className="bg-slate-900 border-blue-500/30 shadow-lg shadow-blue-900/20">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="text-blue-400" size={20} /> Documents Requested
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Documents or information that may be requested can vary depending on the service and matter.
              </p>
              <ul className="space-y-3">
                {service.documents_information.map((doc, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded border border-slate-600 shrink-0 flex items-center justify-center mt-0.5"></div>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Official Sources */}
          {service.official_sources && service.official_sources.length > 0 && (
            <Card className="bg-slate-900 border-white/10">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="text-emerald-400" size={20} /> Official Sources
              </h3>
              <div className="space-y-3">
                {service.official_sources.map((src, idx) => (
                  <a 
                    key={idx} 
                    href={src.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-emerald-400"
                  >
                    {src.title} ↗
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Find Authority Action */}
          <Card className="bg-orange-500/10 border-orange-500/30 text-center">
            <h3 className="font-bold text-white mb-2">Ready to proceed?</h3>
            <p className="text-sm text-slate-300 mb-4">Find your local authority for official guidance.</p>
            <Button onClick={() => navigate('/legal-services/authority')} className="w-full bg-orange-600 hover:bg-orange-700">
              Find Authority
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalServiceDetail;
