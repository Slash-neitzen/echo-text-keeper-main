
import React from 'react';

interface WordCounterProps {
  content: string;
}

const WordCounter: React.FC<WordCounterProps> = ({ content }) => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characterCount = content.length;
  
  return (
    <div className="text-sm text-gray-500 flex gap-3">
      <div>Words: {wordCount}</div>
      <div>Characters: {characterCount}</div>
    </div>
  );
};

export default WordCounter;
