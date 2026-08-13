import React from 'react';
import { Scale, Users, FileSignature, Shield } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

const LegalServices = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: "Legal Aid",
      icon: Shield,
      desc: "Free legal services are provided to eligible citizens under the Legal Services Authorities Act. Find if you are eligible and how to apply.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Mediation",
      icon: Users,
      desc: "Mediation is an alternative dispute resolution method where a neutral third party helps parties reach a mutual agreement without going to trial.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Lok Adalat",
      icon: Scale,
      desc: "Lok Adalat is a forum where pending cases or pre-litigation disputes are settled amicably. It provides quick and cost-free justice.",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Legal Services Authority",
      icon: FileSignature,
      desc: "Contact the Telangana State Legal Services Authority for guidance, legal assistance, and access to justice resources.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t('legalServices')}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Explore official resources and pathways for legal assistance, alternative dispute resolution, and access to justice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc, i) => (
          <Card key={i} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${svc.bg} ${svc.color}`}>
              <svc.icon size={28} />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">{svc.title}</h2>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1">{svc.desc}</p>
            <Button variant="outline" className="w-full sm:w-auto">{t('learnMore')}</Button>
          </Card>
        ))}
      </div>

      <div className="bg-primary-900 text-white rounded-xl p-8 text-center mt-12">
        <h3 className="text-xl font-bold mb-4">Need Immediate Assistance?</h3>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">Toll-free national legal helpline for legal advice and information.</p>
        <div className="inline-flex items-center justify-center px-6 py-3 bg-white/5 text-primary-900 font-bold rounded-lg text-lg tracking-wider shadow-lg">
          15100
        </div>
      </div>
    </div>
  );
};

export default LegalServices;
