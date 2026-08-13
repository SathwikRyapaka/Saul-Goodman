import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Search, File, Download, BrainCircuit, Loader2 } from 'lucide-react';
import { getDocuments, uploadDocument, summarizeDocument } from '../services/documentService';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const DocumentCenter = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [summarizingId, setSummarizingId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const { t, language } = useLanguage();

  const fileInputRef = useRef(null);

  useEffect(() => {
    getDocuments().then(setDocuments);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    await uploadDocument(file);
    
    // Mock adding the new document to the list
    const newDoc = {
      id: Date.now().toString(),
      name: file.name,
      type: 'Uploaded Document',
      caseNumber: 'N/A',
      date: new Date().toISOString(),
      format: file.name.split('.').pop().toUpperCase() || 'FILE',
      file: file // Store the actual file for downloading/viewing
    };
    
    setDocuments(prev => [newDoc, ...prev]);
    setUploading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSummarize = async (doc) => {
    setSummarizingId(doc.id);
    const data = await summarizeDocument(doc);
    setSummaryData(data);
    setSummarizingId(null);
  };

  const handleDownload = (doc) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const content = `Mock content for ${doc.name}\nType: ${doc.type}\nCase: ${doc.caseNumber}\nDate: ${new Date(doc.date).toLocaleDateString()}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleView = (doc) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      window.open(url, '_blank');
    } else {
      alert(`Viewing document details:\n\nName: ${doc.name}\nType: ${doc.type}\nCase Number: ${doc.caseNumber}`);
    }
  };

  if (summaryData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{t('documentSummary')}</h1>
          <Button variant="outline" onClick={() => setSummaryData(null)}>Back to Documents</Button>
        </div>

        <Card className="bg-slate-900 text-white border-none">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="block text-slate-400 text-sm mb-1">Document Type</span>
              <span className="font-medium">{summaryData.documentType}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-sm mb-1">Case Number</span>
              <span className="font-medium">{summaryData.caseNumber}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-sm mb-1">Order Date</span>
              <span className="font-medium">{summaryData.orderDate}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-sm mb-1">Current Stage</span>
              <span className="font-medium">{summaryData.currentStage}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
              <p className="text-slate-300 leading-relaxed">{summaryData.summary}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-3">Key Points</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                {summaryData.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-amber-500/20 border-amber-500/30">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Important Events</h3>
              <ul className="space-y-3">
                {summaryData.importantEvents.map((evt, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-400">
                    <span className="text-amber-400">•</span> {evt}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-orange-50 border-orange-100">
              <h3 className="text-sm font-semibold text-orange-900 uppercase tracking-wider mb-3">Important Dates</h3>
              <ul className="space-y-3">
                {summaryData.importantDates.map((dt, i) => (
                  <li key={i} className="flex gap-2 text-sm text-orange-800">
                    <span className="text-orange-400">•</span> {dt}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('documents')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input icon={Search} placeholder="Search documents..." />
            </div>
            <select className="border border-white/20 rounded-lg px-4 bg-white/5 outline-none focus:ring-2 focus:ring-amber-500">
              <option>All Types</option>
              <option>Court Order</option>
              <option>Petition</option>
              <option>Notice</option>
            </select>
          </div>

          <div className="space-y-4">
            {documents.map(doc => (
              <Card key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{doc.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-medium text-slate-300">{doc.type}</span>
                      <span>•</span>
                      <span>{doc.caseNumber}</span>
                      <span>•</span>
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <Badge status="default">{doc.format}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <Button variant="ghost" className="px-2" title={t('view')} onClick={() => handleView(doc)}>
                    <File size={18} />
                  </Button>
                  <Button variant="ghost" className="px-2" title={t('download')} onClick={() => handleDownload(doc)}>
                    <Download size={18} />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-none text-sm bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                    onClick={() => handleSummarize(doc)}
                    disabled={summarizingId === doc.id}
                  >
                    {summarizingId === doc.id ? (
                      <><Loader2 size={16} className="mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <><BrainCircuit size={16} className="mr-2" /> {t('summarize')}</>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <h3 className="font-semibold text-lg text-white mb-4">Upload Document</h3>
            
            <div 
              className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-white/5 hover:bg-white/5 transition-colors cursor-pointer mb-4"
              onClick={handleUploadClick}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <UploadCloud className="mx-auto text-amber-400 mb-3" size={32} />
              <p className="font-medium text-slate-300 mb-1">Drag & Drop your document here</p>
              <p className="text-sm text-slate-500 mb-4">or</p>
              <Button variant="secondary" size="sm" onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Browse Files'}
              </Button>
            </div>
            
            <div className="flex justify-center gap-2">
              <Badge status="default">PDF</Badge>
              <Badge status="default">DOC</Badge>
              <Badge status="default">DOCX</Badge>
              <Badge status="default">JPG</Badge>
              <Badge status="default">PNG</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentCenter;
