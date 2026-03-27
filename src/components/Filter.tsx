import type { FC } from 'react';
import { useContentStore } from '../store/contentStore';
import { PriceSlider } from './PriceSlider';

export const Filter: FC = () => {
  const { 
    pricingOptions, 
    selectedPricing, 
    togglePricing, 
    resetFilters,
  } = useContentStore();

  return (
    <div className="filter-section">
      <div className="filter-toolbar">
        <div className="filter-toolbar-row filter-toolbar-main">
          <div className="filter-pills" role="group" aria-label="Pricing">
            {pricingOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={`filter-pill ${selectedPricing.includes(option) ? 'selected' : ''}`}
                onClick={() => togglePricing(option)}
              >
                <span className="filter-checkbox" aria-hidden />
                <span>{option}</span>
              </button>
            ))}
          </div>
          <div className="filter-slider-region">
            <PriceSlider />
          </div>
          <button type="button" className="reset-btn" onClick={resetFilters}>
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};
