
import React, { useState, useMemo, useCallback } from 'react';
import { Keyword } from './types';
import KeywordChip from './components/KeywordChip';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const processKeywords = useCallback((input: string) => {
    const rawList = input.split(/[,;\n]/);
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.includes(',') || val.includes(';') || val.includes('\n')) {
      processKeywords(val);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-row">
          <h1 className="app-title">
            Keyword <span>Clipper</span>
          </h1>
          <div className="counter-badge">
            {keywords.length} TOTAL
          </div>
        </div>
        <p className="app-subtitle">Tap any chip to copy instantly.</p>
      </header>

      <section className="input-section">
        <label className="label">
          Paste keywords (Comma separated)
        </label>
        <textarea
          value={inputValue}
          onChange={handleTextChange}
          placeholder="Keyword 1, Keyword 2, Keyword 3..."
          className="textarea"
        />
        <div className="button-group">
          <button
            onClick={() => processKeywords(inputValue)}
            className="btn btn-primary"
          >
            Generate List
          </button>
          <button
            onClick={handleClear}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      </section>

      {keywords.length > 0 && (
        <div className="search-container">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      <main style={{ flex: 1 }}>
        {keywords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-circle">
              <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>No keywords yet.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: '0 2.5rem' }}>Paste a list above to get started.</p>
          </div>
        ) : (
          <div className="keywords-grid">
            {filteredKeywords.map((keyword) => (
              <KeywordChip
                key={keyword.id}
                text={keyword.text}
                onCopy={handleCopy}
                isRecentlyCopied={copiedId === keyword.text}
              />
            ))}
            {filteredKeywords.length === 0 && (
              <p style={{ textAlign: 'center', width: '100%', padding: '2.5rem 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No matches found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </main>

      {keywords.length > 20 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-top-btn"
          aria-label="Scroll to top"
        >
          <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
