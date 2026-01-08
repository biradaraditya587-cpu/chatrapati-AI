
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeEmail } from './services/geminiService';
import { ClassificationResult } from './types';

const App: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<ClassificationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeEmail(content, subject);
      setCurrentResult(result);
      setHistory(prev => [result, ...prev]);
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze email. Please check your network or API configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSubject('');
    setContent('');
    setCurrentResult(null);
    setError(null);
  };

  const selectFromHistory = (result: ClassificationResult) => {
    setCurrentResult(result);
    setSubject(result.subject);
    setContent(result.content);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar 
          history={history} 
          onSelect={selectFromHistory} 
          activeId={currentResult?.id} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-800">New Analysis</h1>
                  <p className="text-sm text-slate-500">Paste your email contents below for instant AI classification.</p>
                </div>
                <button 
                  onClick={handleClear}
                  className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-all"
                  title="Clear inputs"
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>

              <form onSubmit={handleAnalyze} className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Subject (Optional)</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject line..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Body Content</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="Paste the full email text here, including any suspicious links or signatures..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-slate-400 text-xs">
                    <i className="fas fa-info-circle mr-1"></i>
                    Your data is analyzed securely via private API calls.
                  </div>
                  <button
                    disabled={isAnalyzing || !content.trim()}
                    type="submit"
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                      isAnalyzing || !content.trim() 
                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Analyzing Patterns...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magnifying-glass-chart"></i>
                        Classify Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3 mb-8 animate-in fade-in zoom-in duration-300">
                <i className="fas fa-circle-exclamation text-xl"></i>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Empty State / Welcome */}
            {!currentResult && !isAnalyzing && (
              <div className="text-center py-12 px-4">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-envelope-open-text text-3xl text-indigo-500"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">How it works</h2>
                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Chatrapati AI uses advanced large language models to extract semantic features from emails. 
                  We analyze tone, intent, metadata patterns, and psychological triggers to identify potential threats.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
                  {[
                    { icon: 'fa-brain', title: 'NLP Extraction', desc: 'Identifies linguistic anomalies' },
                    { icon: 'fa-link-slash', title: 'URL Analysis', desc: 'Detects phishing proxies' },
                    { icon: 'fa-gauge-high', title: 'Risk Scoring', desc: 'Real-time probability calculation' }
                  ].map((feature, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <i className={`fas ${feature.icon} text-indigo-500 text-xl mb-3`}></i>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-slate-500">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {isAnalyzing && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-pulse space-y-8">
                <div className="flex gap-8 items-center">
                  <div className="w-40 h-40 bg-slate-100 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-64 bg-slate-100 rounded-2xl"></div>
                  <div className="space-y-4">
                    <div className="h-16 bg-slate-100 rounded-xl"></div>
                    <div className="h-16 bg-slate-100 rounded-xl"></div>
                    <div className="h-16 bg-slate-100 rounded-xl"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {currentResult && !isAnalyzing && (
              <AnalysisDisplay result={currentResult} />
            )}
          </div>
        </main>
      </div>

      {/* Floating Action for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => {
            const sidebar = document.querySelector('aside');
            sidebar?.classList.toggle('hidden');
          }}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
        >
          <i className="fas fa-history text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
