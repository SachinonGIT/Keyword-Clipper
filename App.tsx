
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Keyword } from './types';
import KeywordChip from './components/KeywordChip';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Process input whenever it changes or on demand
  const processKeywords = useCallback((input: string) => {
    const rawList = input.split(/[,;\n]/); // Split by comma, semicolon, or newline
    const cleanList = rawList
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map((item, index) => ({
        id: `${item}-${index}-${Date.now()}`,
        text: item
      }));
    setKeywords(cleanList);
  }, []);

  const handleClear = () => {
    setKeywords([]);
    setInputValue('');
    setSearchQuery('');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      // Feedback duration
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const filteredKeywords = useMemo(() => {
    if (!searchQuery) return keywords;
    return keywords.filter(k => 
      k.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [keywords, searchQuery]);

  // Quick process when text is pasted
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.includes(',') || val.includes(';') || val.includes('\n')) {
      processKeywords(val);
    }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col max-w-2xl mx-auto px-4 sm:px-6">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 py-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Keyword <span className="text-indigo-600">Clipper</span>
          </h1>
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
            {keywords.length} TOTAL
          </div>
        </div>
        <p className="text-slate-500 text-sm">Tap any chip to copy instantly.</p>
      </header>

      {/* Input Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Paste keywords (Comma separated)
        </label>
        <textarea
          value={inputValue}
          onChange={handleTextChange}
          placeholder="Keyword 1, Keyword 2, Keyword 3..."
          className="w-full h-24 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-400 transition-all outline-none"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => processKeywords(inputValue)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            Generate List
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl transition-all active:scale-[0.98]"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      {keywords.length > 0 && (
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
          />
        </div>
      )}

      {/* Keywords Grid */}
      <main className="flex-1">
        {keywords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No keywords yet.</p>
            <p className="text-sm text-slate-400 px-10">Paste a list above to get started.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredKeywords.map((keyword) => (
              <KeywordChip
                key={keyword.id}
                text={keyword.text}
                onCopy={handleCopy}
                isRecentlyCopied={copiedId === keyword.text}
              />
            ))}
            {filteredKeywords.length === 0 && (
              <p className="text-center w-full py-10 text-slate-400 italic">No matches found for "{searchQuery}"</p>
            )}
          </div>
        )}
      </main>

      {/* Persistent Mobile Action - Scroll to top if list is long */}
      {keywords.length > 20 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-4 bg-white text-indigo-600 rounded-full shadow-2xl border border-slate-100 active:scale-90 transition-transform z-30"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
