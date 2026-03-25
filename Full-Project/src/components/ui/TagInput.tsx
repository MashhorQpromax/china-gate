'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  label_ar?: string;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
  error?: string;
  required?: boolean;
  dir?: 'ltr' | 'rtl';
}

export function TagInput({
  value,
  onChange,
  label = 'Tags',
  label_ar = 'الوسوم',
  placeholder = 'Type and press Enter',
  suggestions = [],
  maxTags = 10,
  error,
  required = false,
  dir = 'rtl',
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const isRTL = dir === 'rtl';

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !value.includes(s) &&
      s.toLowerCase().includes(input.toLowerCase()),
  );

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (
      trimmed &&
      !value.includes(trimmed) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmed]);
      setInput('');
      setOpenSuggestions(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(input);
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      handleRemoveTag(value.length - 1);
    }
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {isRTL ? label_ar : label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {/* Tags Container */}
        <div className="min-h-11 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg flex flex-wrap gap-2 items-center focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition">
          {value.map((tag, index) => (
            <div
              key={index}
              className="bg-red-600 text-white text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="hover:opacity-70 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setOpenSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpenSuggestions(true)}
            onBlur={() => setTimeout(() => setOpenSuggestions(false), 200)}
            placeholder={value.length >= maxTags ? 'Max tags reached' : placeholder}
            disabled={value.length >= maxTags}
            className="flex-1 min-w-32 bg-transparent text-white focus:outline-none placeholder-gray-500 disabled:opacity-50"
          />
        </div>

        {/* Suggestions Dropdown */}
        {openSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddTag(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-gray-700 transition text-gray-200 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helpers */}
      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs text-gray-400">
          {value.length} / {maxTags}
        </p>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
