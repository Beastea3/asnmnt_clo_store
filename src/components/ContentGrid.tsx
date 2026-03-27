import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useContentStore } from '../store/contentStore';
import { ContentCard } from './ContentCard';

export const ContentGrid: React.FC = () => {
  const { 
    allContent, 
    selectedPricing, 
    keyword, 
    priceRange,
    sortBy,
    pageSize, 
    loadMore, 
    resetFilters, 
    setKeyword 
  } = useContentStore();
  const loaderRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let result = allContent.filter((item) => {
      // Filter by pricing
      const matchesPricing = selectedPricing.length === 0 || selectedPricing.includes(item.pricing);
      
      // Filter by keyword
      const matchesKeyword = keyword === '' || 
        item.userName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.title.toLowerCase().includes(keyword.toLowerCase());
      
      // Filter by price range (only for Paid items)
      const matchesPriceRange = item.pricing !== 'Paid' || 
        (item.pricing === 'Paid' && item.price !== undefined && 
         item.price >= priceRange[0] && item.price <= priceRange[1]);
      
      return matchesPricing && matchesKeyword && matchesPriceRange;
    });
    
    // Sort content
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return 0;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'price-asc':
          const priceA = a.price ?? (a.pricing === 'Free' ? 0 : 999999);
          const priceB = b.price ?? (b.pricing === 'Free' ? 0 : 999999);
          return priceB - priceA; // Higher price first
        case 'price-desc':
          const priceC = a.price ?? (a.pricing === 'Free' ? 0 : -1);
          const priceD = b.price ?? (b.pricing === 'Free' ? 0 : -1);
          return priceC - priceD; // Lower price first
        default:
          return 0;
      }
    });
    
    return result;
  }, [allContent, selectedPricing, keyword, priceRange, sortBy]);

  // Preload strategy: visible count plus two extra rows (8 cards)
  const preloadCount = pageSize * 2;
  const displayedContent = filteredContent.slice(0, visibleCount + preloadCount);
  const canLoadMore = displayedContent.length < filteredContent.length;

  // Infinite scroll observer: trigger load-more 300px before sentinel
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting) {
      setVisibleCount((prev) => prev + pageSize);
      loadMore();
    }
  }, [loadMore, pageSize]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '300px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [selectedPricing, keyword, priceRange, sortBy, pageSize]);

  if (filteredContent.length === 0) {
    return (
      <div className="content-grid-section content-grid-section--plain">
        <div className="no-results">
          <div className="no-results-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="no-results-title">No results found</h3>
          <p className="no-results-description">
            We couldn't find any items matching your current filters.
          </p>
          <p className="no-results-hint">Try adjusting your search or filter criteria</p>
          <button 
            className="no-results-reset-btn"
            onClick={() => {
              resetFilters();
              setKeyword('');
            }}
          >
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-grid-section content-grid-section--plain">
      <div className="content-grid">
        {displayedContent.map((item, index) => (
          <ContentCard 
            key={item.id} 
            item={item} 
            priority={index < visibleCount}
          />
        ))}
      </div>
      {canLoadMore && (
        <div ref={loaderRef} className="loading-trigger" aria-hidden>
          <div className="loading-spinner">Loading more</div>
        </div>
      )}
    </div>
  );
};
