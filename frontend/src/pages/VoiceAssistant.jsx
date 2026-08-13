import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { processVoiceQuery } from '../services/aiService';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { t, language } = useLanguage();
  
  // Basic Speech Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(SpeechRecognition ? new SpeechRecognition() : null);

  const startListening = () => {
    if (!recognition.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    setTranscript('');
    setResponse('');
    setIsListening(true);
    
    recognition.current.lang = language === 'en' ? 'en-IN' : 'te-IN';
    recognition.current.start();

    recognition.current.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      setIsListening(false);
      handleProcessQuery(transcriptText);
    };

    recognition.current.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const handleProcessQuery = async (query) => {
    setIsProcessing(true);
    const result = await processVoiceQuery(query);
    setResponse(result);
    setIsProcessing(false);
    
    // Auto speak response
    const utterance = new SpeechSynthesisUtterance(result);
    utterance.lang = language === 'en' ? 'en-IN' : 'te-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">{t('howCanIHelp')}</h1>
        <p className="text-slate-500">{t('voiceAssistant')}</p>
      </div>

      <div className="relative flex justify-center items-center h-48 w-48">
        {isListening && (
          <>
            <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-4 bg-primary-200 rounded-full animate-pulse"></div>
          </>
        )}
        
        <button
          onClick={isListening ? stopListening : startListening}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${
            isListening ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-amber-500 text-white shadow-amber-500/20'
          }`}
        >
          {isListening ? <Square size={32} fill="currentColor" /> : <Mic size={40} />}
        </button>
      </div>

      <div className="text-center w-full max-w-lg min-h-[120px]">
        {isListening && <p className="text-lg text-amber-400 font-medium animate-pulse">{t('listening')}</p>}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-amber-400 font-medium">
            <Loader2 className="animate-spin" /> {t('processing')}
          </div>
        )}
        
        {!isListening && !isProcessing && transcript && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm text-left mb-6 relative">
            <div className="absolute -top-3 left-6 bg-white/5 text-xs font-bold px-2 py-0.5 rounded text-slate-500">You</div>
            <p className="text-slate-300 italic">"{transcript}"</p>
          </div>
        )}

        {!isListening && !isProcessing && response && (
          <div className="bg-amber-500/20 p-6 rounded-xl border border-amber-500/30 shadow-sm text-left relative">
            <div className="absolute -top-3 left-6 bg-amber-500 text-xs font-bold px-2 py-0.5 rounded text-white">Nyaya Setu</div>
            <p className="text-amber-400 font-medium leading-relaxed">{response}</p>
            <button 
              className="mt-4 flex items-center gap-2 text-sm text-amber-400 hover:text-amber-400 font-medium"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(response);
                utterance.lang = language === 'en' ? 'en-IN' : 'te-IN';
                window.speechSynthesis.speak(utterance);
              }}
            >
              <Volume2 size={16} /> Listen Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 mb-4">Try asking:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["What is my next hearing date?", "Explain my case.", "Show my active cases."].map((suggestion, i) => (
            <button 
              key={i} 
              onClick={() => handleProcessQuery(suggestion)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-400 hover:bg-white/5 hover:border-white/20 transition-colors"
            >
              "{suggestion}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
