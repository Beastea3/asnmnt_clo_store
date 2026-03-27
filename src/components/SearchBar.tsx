import React, { useState } from 'react';
import { useContentStore } from '../store/contentStore';

export const SearchBar: React.FC = () => {
  const { keyword, setKeyword } = useContentStore();
  const [focused, setFocused] = useState(false);

  return (
    <div className="search-row">
      <div className="search-bar-wrapper">
        <div className={`search-pill ${focused ? 'focused' : ''}`}>
          <input
            type="text"
            placeholder="Find the Items you're lookng for"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>
      </div>
      <div className="search-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Keyword search</span>
      </div>
    </div>
  );
};
