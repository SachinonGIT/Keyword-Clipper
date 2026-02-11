
import React, { useState, useEffect } from 'react';

interface KeywordChipProps {
  text: string;
  onCopy: (text: string) => void;
  isRecentlyCopied: boolean;
}

const KeywordChip: React.FC<KeywordChipProps> = ({ text, onCopy, isRecentlyCopied }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);
    onCopy(text);
    setTimeout(() => setActive(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 
        flex items-center justify-center min-w-[80px] select-none active:scale-95
        shadow-sm border
        ${isRecentlyCopied 
          ? 'bg-green-100 border-green-300 text-green-700' 
          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 active:bg-indigo-50'}
        ${active ? 'scale-95' : 'scale-100'}
      `}
    >
      <span className="truncate max-w-[150px]">{text}</span>
      {isRecentlyCopied && (
        <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
          COPIED
        </span>
      )}
    </button>
  );
};

export default KeywordChip;
