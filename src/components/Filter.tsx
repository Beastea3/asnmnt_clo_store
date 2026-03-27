import React from 'react';
import { useContentStore } from '../store/contentStore';
import { PriceSlider } from './PriceSlider';

export const Filter: React.FC = () => {
  const { 
    pricingOptions, 
    selectedPricing, 
    togglePricing, 
    resetFilters,
    sortBy,
    setSortBy
  } = useContentStore();

  return (
    <div className="filter-section">
      <div className="filter-row">
        <div className="filter-pills">
          <span className="filter-label">Price Option</span>
          {pricingOptions.map((option) => (
            <button
              key={option}
              className={`filter-pill ${selectedPricing.includes(option) ? 'selected' : ''}`}
              onClick={() => togglePricing(option)}
            >
              <span className="filter-checkbox" />
              <span>{option}</span>
            </button>
          ))}
        </div>
        
        <PriceSlider />
        
        <div className="sort-section">
          <span className="sort-label">Sort by</span>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name-asc">Item Name</option>
            <option value="price-asc">Higher Price</option>
            <option value="price-desc">Lower Price</option>
          </select>
        </div>
        
        <button className="filter-pill reset-btn" onClick={resetFilters}>
          RESET
        </button>
      </div>
    </div>
  );
};
