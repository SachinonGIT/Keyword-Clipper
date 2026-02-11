
import React from 'react';

interface KeywordChipProps {
  text: string;
  onCopy: (text: string) => void;
  isRecentlyCopied: boolean;
}

const KeywordChip: React.FC<KeywordChipProps> = ({ text, onCopy, isRecentlyCopied }) => {
  return (
    <button
      onClick={() => onCopy(text)}
      className={`keyword-chip ${isRecentlyCopied ? 'keyword-chip--copied' : ''}`}
    >
      <span className="truncate">{text}</span>
      {isRecentlyCopied && (
        <span className="copied-toast">
          COPIED
        </span>
      )}
    </button>
  );
};

export default KeywordChip;
