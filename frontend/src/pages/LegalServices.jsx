import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Users, FileSignature, Shield, Search, MessageSquare, ChevronDown, ChevronUp, ArrowRight, MapPin } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useLanguage } from '../context/LanguageContext';
import { askLegalAssistant } from '../services/legalService';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-900 mb-3">
      <button 
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-slate-200 pr-4">{question}</span>
        {isOpen ? <ChevronUp className="text-slate-400 shrink-0" /> : <ChevronDown className="text-slate-400 shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-2 text-slate-400 bg-slate-900 border-t border-white/5 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const LegalServices = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [wizardStep, setWizardStep] = useState(1);
  const [wizardSelection, setWizardSelection] = useState('');
  
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const services = [
    {
      title: "Legal Aid",
      icon: Shield,
      path: "/legal-services/legal-aid",
      desc: "Free legal services are provided to eligible citizens under the Legal Services Authorities Act.",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Mediation",
      icon: Users,
      path: "/legal-services/mediation",
      desc: "An alternative dispute resolution method where a neutral third party helps reach an agreement.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Lok Adalat",
      icon: Scale,
      path: "/legal-services/lok-adalat",
      desc: "A forum where pending cases or pre-litigation disputes are settled amicably and quickly.",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20"
    },
    {
      title: "Legal Services Authority",
      icon: MapPin,
      path: "/legal-services/authority",
      desc: "Find official contact information for the District Legal Services Authority in your area.",
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20"
    }
  ];

  const faqs = [
    { q: "What is legal aid?", a: "Legal aid means legal assistance that may be provided to eligible people who need help with a legal matter, usually at no cost." },
    { q: "How do I find a Legal Services Authority?", a: "You can use the 'Find Authority' tool on this page to search by your State and District to find official contact information." },
    { q: "What information should I keep when seeking help?", a: "Documents or information that may be requested can vary depending on the service. Generally, identity proof, income certificates (for legal aid), and any court notices or case documents are useful." }
  ];

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setIsAsking(true);
    setAiAnswer('');
    try {
      const ans = await askLegalAssistant(aiQuestion, language);
      setAiAnswer(ans);
    } catch (err) {
      setAiAnswer("Sorry, I am unable to connect to the knowledge base right now.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleWizardOption = (option) => {
    setWizardSelection(option);
    setWizardStep(2);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold text-white mb-4">LEGAL SERVICES</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">Find the right legal information and assistance.</p>
        <p className="text-slate-500 mt-2">Not sure what you need? Answer a few simple questions and Nyaya Setu will guide you.</p>
      </div>

      {/* Wizard */}
      <Card className="bg-slate-900 border-amber-500/30 p-8 shadow-lg shadow-amber-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
        
        {wizardStep === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Search className="text-amber-400" /> What do you need help with?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button onClick={() => handleWizardOption('court')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 text-left transition-all group">
                <span className="block font-medium text-slate-200 group-hover:text-amber-400">Court case</span>
              </button>
              <button onClick={() => handleWizardOption('notice')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 text-left transition-all group">
                <span className="block font-medium text-slate-200 group-hover:text-amber-400">Legal notice or document</span>
              </button>
              <button onClick={() => handleWizardOption('dispute')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 text-left transition-all group">
                <span className="block font-medium text-slate-200 group-hover:text-amber-400">Dispute settlement</span>
              </button>
              <button onClick={() => handleWizardOption('free')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 text-left transition-all group">
                <span className="block font-medium text-slate-200 group-hover:text-amber-400">Free legal assistance</span>
              </button>
              <button onClick={() => handleWizardOption('other')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 text-left transition-all group">
                <span className="block font-medium text-slate-200 group-hover:text-amber-400">Other question</span>
              </button>
            </div>
          </div>
        )}

        {wizardStep === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-2">Recommended Information</h2>
            <p className="text-slate-400 mb-6">Based on your selection, these services may be relevant.</p>
            
            <div className="space-y-4">
              {wizardSelection === 'court' && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => navigate('/search')} className="bg-white/10 hover:bg-white/20">Search my case</Button>
                  <Button onClick={() => navigate('/ai-explain')} className="bg-white/10 hover:bg-white/20">Understand my case</Button>
                  <Button onClick={() => navigate('/legal-services/authority')} className="bg-amber-600 hover:bg-amber-700">Find Legal Authority</Button>
                </div>
              )}
              {wizardSelection === 'notice' && (
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex-1">
                    <h3 className="text-blue-400 font-bold mb-1">Understand Your Document</h3>
                    <p className="text-sm text-slate-300">Upload a legal document to understand the information in simple language.</p>
                  </div>
                  <Button onClick={() => navigate('/documents')} className="bg-blue-600 hover:bg-blue-700 shrink-0">Go to Documents</Button>
                </div>
              )}
              {wizardSelection === 'dispute' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <h3 className="font-bold text-indigo-400 mb-2">Mediation</h3>
                    <p className="text-sm text-slate-300 mb-4">Learn how mediation works and when it may be considered as a dispute-resolution process.</p>
                    <Button onClick={() => navigate('/legal-services/mediation')} variant="outline" className="w-full border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300">Learn About Mediation</Button>
                  </Card>
                  <Card className="border-green-500/20 bg-green-500/5">
                    <h3 className="font-bold text-green-400 mb-2">Lok Adalat</h3>
                    <p className="text-sm text-slate-300 mb-4">Learn about Lok Adalat and available official information for amicably settling disputes.</p>
                    <Button onClick={() => navigate('/legal-services/lok-adalat')} variant="outline" className="w-full border-green-500/30 hover:bg-green-500/10 text-green-300">Learn About Lok Adalat</Button>
                  </Card>
                </div>
              )}
              {wizardSelection === 'free' && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <h3 className="font-bold text-blue-400 mb-2">Legal Aid</h3>
                  <p className="text-sm text-slate-300 mb-4">May help you learn about available legal assistance and how to seek help. Official eligibility criteria should be checked.</p>
                  <Button onClick={() => navigate('/legal-services/legal-aid')} className="bg-blue-600 hover:bg-blue-700">Learn About Legal Aid</Button>
                </Card>
              )}
              {wizardSelection === 'other' && (
                <p className="text-slate-300">Scroll down to "Ask Nyaya Setu" to ask a specific question, or browse the services below.</p>
              )}
            </div>

            <button onClick={() => setWizardStep(1)} className="mt-8 text-sm text-slate-500 hover:text-white transition-colors">
              ← Start over
            </button>
          </div>
        )}
      </Card>

      {/* Popular Services Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Popular Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <Card key={i} className="flex flex-col h-full hover:shadow-lg transition-all bg-slate-900 border-white/5 hover:border-white/20 group">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center border ${svc.bg} ${svc.color}`}>
                  <svc.icon size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{svc.desc}</p>
                </div>
              </div>
              <div className="mt-auto flex justify-end">
                <Button 
                  onClick={() => navigate(svc.path)}
                  variant="outline" 
                  className="group-hover:bg-white/10 border-white/10 text-slate-300 gap-2"
                >
                  Explore <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Ask Nyaya Setu AI */}
      <Card className="bg-[#1a1528] border-purple-500/30 shadow-lg shadow-purple-900/10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="text-purple-400" /> Ask Nyaya Setu
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Have a question about legal services? Ask our AI assistant. It provides information based exclusively on official sources.
            </p>
            <p className="text-xs text-purple-400/80 italic">
              Example: "How can I learn about legal aid?" or "Where can I find legal assistance?"
            </p>
          </div>
          
          <div className="w-full md:w-2/3">
            <form onSubmit={handleAskAI} className="space-y-4">
              <div className="relative">
                <Input 
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask a question about legal services..."
                  className="bg-black/40 border-purple-500/20 text-white placeholder-slate-500 pl-4 py-4 rounded-xl w-full"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isAsking || !aiQuestion} className="bg-purple-600 hover:bg-purple-700 font-bold px-8">
                  {isAsking ? 'Thinking...' : 'Ask Question'}
                </Button>
              </div>
            </form>
            
            {aiAnswer && (
              <div className="mt-6 p-6 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-200 leading-relaxed animate-in fade-in slide-in-from-top-2">
                {aiAnswer}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* FAQs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="max-w-3xl">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-xs text-slate-500 max-w-4xl mx-auto">
          ⚠️ Disclaimer: Nyaya Setu provides general information to assist citizens in discovering legal services. It is not a substitute for professional legal advice. Always consult with a qualified legal professional or the appropriate Legal Services Authority for official guidance.
        </p>
      </div>

    </div>
  );
};

export default LegalServices;
