import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Download, BrainCircuit, Loader2, Volume2, ShieldAlert } from 'lucide-react';
import { uploadDocument, getDocumentSummary } from '../services/documentService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const DocumentCenter = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, failed
  const [processStep, setProcessStep] = useState(0); // 0: Reading, 1: Extracting, 2: OCR, 3: Analyzing
  const [errorMsg, setErrorMsg] = useState('');
  const [docData, setDocData] = useState(null);
  const [viewLanguage, setViewLanguage] = useState('en');

  // Simulated processing steps just for UX while we poll or wait
  useEffect(() => {
    let interval;
    if (status === 'processing') {
      interval = setInterval(() => {
        setProcessStep(prev => prev < 3 ? prev + 1 : prev);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit.");
      return;
    }
    if (selectedFile.type !== 'application/pdf') {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }

    setFile(selectedFile);
    setErrorMsg('');
    setStatus('uploading');

    try {
      // 1. Upload to backend
      const res = await uploadDocument(selectedFile);
      if (!res.documentId) throw new Error("Upload failed.");
      
      setStatus('processing');
      setProcessStep(0);

      // 2. The backend orchestrates parsing & Gemini completely asynchronously or synchronously during the upload request.
      // Since our uploadAndProcess controller blocks until complete, the above `uploadDocument` call actually waits for the whole flow!
      // But in case we refactor to pure async, we would poll here. We will just fetch the summary immediately.
      const summary = await getDocumentSummary(res.documentId);
      
      if (summary.processingStatus === 'failed') {
        throw new Error("Unable to extract readable content from this document.");
      }

      setDocData(summary);
      setStatus('completed');
    } catch (err) {
      console.error(err);
      setStatus('failed');
      setErrorMsg(err.response?.data?.error || err.message || "An unexpected error occurred.");
    }
  };

  const handleListen = (textToSpeak) => {
    if (!textToSpeak) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = viewLanguage === 'en' ? 'en-IN' : 'te-IN';
    window.speechSynthesis.speak(utterance);
  };

  const getProcessingText = () => {
    switch(processStep) {
      case 0: return "Reading document...";
      case 1: return "Extracting text...";
      case 2: return "Checking document structure and OCR...";
      case 3: return "Generating AI summary...";
      default: return "Processing...";
    }
  };

  if (status === 'completed' && docData) {
    const { structuredCaseData: scd, aiSummary: ai } = docData;
    
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Processed Document Results</h1>
          <Button variant="outline" onClick={() => { setStatus('idle'); setDocData(null); setFile(null); }}>Upload Another</Button>
        </div>

        {/* AI Case Summary Section */}
        <Card className="bg-slate-900 border-amber-500/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <BrainCircuit size={28} /> AI Case Summary
            </h2>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
                <button 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewLanguage === 'en' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-white/5'}`}
                  onClick={() => setViewLanguage('en')}
                >
                  English
                </button>
                <button 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewLanguage === 'te' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-white/5'}`}
                  onClick={() => setViewLanguage('te')}
                >
                  తెలుగు
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleListen(viewLanguage === 'en' ? ai.simpleEnglishExplanation : ai.teluguExplanation)}>
                <Volume2 size={16} className="mr-2"/> Listen
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{viewLanguage === 'en' ? 'What is this case about?' : 'కేసు సారాంశం'}</h3>
                <p className="text-slate-300 leading-relaxed p-4 bg-white/5 rounded-lg">
                  {viewLanguage === 'en' ? ai.simpleEnglishExplanation : ai.teluguExplanation}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Current Status</h3>
                <Badge status="success" className="text-base px-3 py-1">{ai.caseStatus || "Not available"}</Badge>
              </div>
              {ai.disposalDetails && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Final/Disposal Information</h3>
                  <p className="text-slate-300 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{ai.disposalDetails}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">What happened?</h3>
                <ul className="space-y-2">
                  {(ai.importantProceedings || []).map((proc, i) => (
                    <li key={i} className="flex gap-2 text-slate-300 bg-white/5 p-3 rounded-lg">
                      <span className="text-amber-400 mt-1">•</span> {proc}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Important Dates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(ai.importantDates || []).map((dt, i) => (
                    <div key={i} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="text-xs text-orange-400 uppercase tracking-wider">{dt.label}</div>
                      <div className="font-semibold text-white mt-1">{dt.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-xl font-bold text-white pt-6 border-t border-white/10">Extracted Case Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Court Info */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Court Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-400">Court</span><span className="text-white font-medium text-right">{scd?.courtDetails?.courtName || "Not available"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">District</span><span className="text-white font-medium">{scd?.courtDetails?.district || "Not available"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">State</span><span className="text-white font-medium">{scd?.courtDetails?.state || "Not available"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Judge</span><span className="text-white font-medium">{scd?.caseDetails?.judge || "Not available"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Court Number</span><span className="text-white font-medium">{scd?.caseDetails?.courtNumber || "Not available"}</span></div>
            </div>
          </Card>

          {/* Case Info */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Case Information</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div><span className="block text-xs text-slate-400">Case Type</span><span className="text-white font-medium">{scd?.caseDetails?.caseType || "Not available"}</span></div>
              <div><span className="block text-xs text-slate-400">Case Number</span><span className="text-white font-medium">{scd?.caseDetails?.caseNumber || "Not available"}</span></div>
              <div><span className="block text-xs text-slate-400">CNR Number</span><span className="text-white font-medium">{scd?.caseDetails?.cnrNumber || "Not available"}</span></div>
              <div><span className="block text-xs text-slate-400">Filing Date</span><span className="text-white font-medium">{scd?.caseDetails?.filingDate || "Not available"}</span></div>
              <div><span className="block text-xs text-slate-400">Status</span><span className="text-white font-medium">{scd?.caseDetails?.caseStatus || "Not available"}</span></div>
              <div><span className="block text-xs text-slate-400">Decision Date</span><span className="text-white font-medium">{scd?.caseDetails?.decisionDate || "Not available"}</span></div>
            </div>
          </Card>

          {/* Parties */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Parties</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-amber-400 mb-2">Petitioner(s)</h4>
                {scd?.parties?.petitioner?.length > 0 ? scd.parties.petitioner.map((p, i) => (
                  <div key={i} className="text-white">{p.name}</div>
                )) : <span className="text-slate-400 text-sm">Not available</span>}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Respondent(s)</h4>
                {scd?.parties?.respondent?.length > 0 ? scd.parties.respondent.map((p, i) => (
                  <div key={i} className="text-white">{p.name}</div>
                )) : <span className="text-slate-400 text-sm">Not available</span>}
              </div>
            </div>
          </Card>

          {/* Acts and History */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Acts & Sections</h3>
              {scd?.actsAndSections?.length > 0 ? (
                <ul className="space-y-2">
                  {scd.actsAndSections.map((act, i) => (
                    <li key={i} className="text-white bg-white/5 p-2 rounded">{act.act}</li>
                  ))}
                </ul>
              ) : <span className="text-slate-400 text-sm">Not available</span>}
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Case History</h3>
              {scd?.caseHistory?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-white/5">
                      <tr>
                        <th className="px-4 py-2">Business Date</th>
                        <th className="px-4 py-2">Next Hearing Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scd.caseHistory.map((h, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="px-4 py-2">{h.businessDate}</td>
                          <td className="px-4 py-2">{h.nextHearingDate || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <span className="text-slate-400 text-sm">Not available</span>}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Upload Court Document</h1>
        <p className="text-slate-400">Process PDF court records to extract structured information and generate AI summaries.</p>
      </div>

      <Card className="p-0 overflow-hidden bg-slate-900 border-white/10">
        <div 
          className={`border-2 border-dashed ${errorMsg ? 'border-red-500/50 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'} transition-all cursor-pointer m-6 rounded-2xl p-12 text-center`}
          onClick={status === 'idle' || status === 'failed' ? handleUploadClick : undefined}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf"
          />

          {(status === 'idle' || status === 'failed') && (
            <div className="space-y-4">
              <UploadCloud className={`mx-auto ${errorMsg ? 'text-red-400' : 'text-amber-400'}`} size={48} />
              <div>
                <p className="text-xl font-medium text-white mb-1">Drag & Drop PDF here</p>
                <p className="text-slate-400">OR</p>
              </div>
              <Button onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}>
                Browse PDF
              </Button>
              <p className="text-sm text-slate-500 pt-2">Maximum file size: 10 MB</p>
              
              {errorMsg && (
                <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg mt-4">
                  <ShieldAlert size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div className="space-y-6 py-8">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-ping"></div>
                <Loader2 className="text-amber-500 animate-spin relative z-10" size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{status === 'uploading' ? 'Uploading File...' : 'Processing Document'}</h3>
                <p className="text-amber-400 font-medium animate-pulse">{status === 'uploading' ? 'Transferring securely...' : getProcessingText()}</p>
              </div>
              {/* Progress Bar Visualization */}
              <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: status === 'uploading' ? '25%' : `${(processStep + 1) * 25}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentCenter;
