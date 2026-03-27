import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useContentStore } from '../store/contentStore';

export const PriceSlider: React.FC = () => {
  const { priceRange, setPriceRange, selectedPricing } = useContentStore();
  const [localRange, setLocalRange] = useState(priceRange);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeThumb = useRef<'min' | 'max' | null>(null);
  
  const isDisabled = !selectedPricing.includes('Paid');
  const minPrice = 0;
  const maxPrice = 999;
  
  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);
  
  const getPercentage = (value: number) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  };
  
  const getValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return minPrice;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(minPrice + percentage * (maxPrice - minPrice));
  };
  
  const handleMouseDown = useCallback((thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    setIsDragging(true);
    activeThumb.current = thumb;
  }, [isDisabled]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !activeThumb.current) return;
    
    const newValue = getValueFromPosition(e.clientX);
    const [min, max] = localRange;
    
    if (activeThumb.current === 'min') {
      const newMin = Math.min(newValue, max - 1);
      setLocalRange([Math.max(minPrice, newMin), max]);
    } else {
      const newMax = Math.max(newValue, min + 1);
      setLocalRange([min, Math.min(maxPrice, newMax)]);
    }
  }, [isDragging, localRange]);
  
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setPriceRange(localRange);
      setIsDragging(false);
      activeThumb.current = null;
    }
  }, [isDragging, localRange, setPriceRange]);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  const leftPercent = getPercentage(localRange[0]);
  const rightPercent = getPercentage(localRange[1]);
  
  return (
    <div className={`price-slider ${isDisabled ? 'disabled' : ''}`}>
      <div 
        className="price-slider-track"
        ref={sliderRef}
      >
        <div 
          className="price-slider-range"
          style={{
            left: `${leftPercent}%`,
            width: `${rightPercent - leftPercent}%`
          }}
        />
        <div
          className={`price-slider-thumb ${isDragging && activeThumb.current === 'min' ? 'active' : ''}`}
          style={{ left: `${leftPercent}%` }}
          onMouseDown={handleMouseDown('min')}
        />
        <div
          className={`price-slider-thumb ${isDragging && activeThumb.current === 'max' ? 'active' : ''}`}
          style={{ left: `${rightPercent}%` }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>
      <div className="price-slider-labels">
        <span className="price-label">${localRange[0]}</span>
        <span className="price-label">${localRange[1]}{localRange[1] >= maxPrice ? '+' : ''}</span>
      </div>
    </div>
  );
};
