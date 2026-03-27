import { useContentStore } from '../store/contentStore';
import { renderHook, act } from '@testing-library/react';
import { ContentItem } from '../types';

describe('contentStore', () => {
  const mockContent: ContentItem[] = [
    {
      id: '1',
      userName: 'UserA',
      title: 'Alpha Dress',
      image: 'https://example.com/1.jpg',
      pricing: 'Free',
    },
    {
      id: '2',
      userName: 'UserB',
      title: 'Beta Jacket',
      image: 'https://example.com/2.jpg',
      pricing: 'Paid',
      price: 29.99,
    },
    {
      id: '3',
      userName: 'UserC',
      title: 'Gamma Skirt',
      image: 'https://example.com/3.jpg',
      pricing: 'View Only',
    },
    {
      id: '4',
      userName: 'UserD',
      title: 'Delta Coat',
      image: 'https://example.com/4.jpg',
      pricing: 'Paid',
      price: 49.99,
    },
  ];

  beforeEach(() => {
    // Reset store state before each test by calling resetFilters and setContent
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.resetFilters();
      result.current.setContent(mockContent, ['Free', 'Paid', 'View Only']);
    });
  });

  describe('setContent', () => {
    it('should set all content and pricing options', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.setContent(mockContent, ['Free', 'Paid']);
      });
      
      expect(result.current.allContent).toEqual(mockContent);
      expect(result.current.pricingOptions).toEqual(['Free', 'Paid']);
      expect(result.current.page).toBe(0);
      expect(result.current.hasMore).toBe(true);
    });
  });

  describe('togglePricing', () => {
    it('should add pricing option when not selected', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.togglePricing('Paid');
      });
      
      expect(result.current.selectedPricing).toContain('Paid');
    });

    it('should remove pricing option when already selected', () => {
      const { result } = renderHook(() => useContentStore());
      
      // First add Free
      act(() => {
        result.current.togglePricing('Free');
      });
      
      // Verify it's added
      expect(result.current.selectedPricing).toContain('Free');
      
      // Then remove it
      act(() => {
        result.current.togglePricing('Free');
      });
      
      // Verify it's removed
      expect(result.current.selectedPricing).not.toContain('Free');
    });

    it('should allow multiple pricing options', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.togglePricing('Free');
        result.current.togglePricing('Paid');
      });
      
      expect(result.current.selectedPricing).toContain('Free');
      expect(result.current.selectedPricing).toContain('Paid');
    });
  });

  describe('setKeyword', () => {
    it('should set keyword', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.setKeyword('Alpha');
      });
      
      expect(result.current.keyword).toBe('Alpha');
    });

    it('should reset page when keyword changes', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.loadMore();
      });
      
      act(() => {
        result.current.setKeyword('test');
      });
      
      expect(result.current.page).toBe(0);
    });
  });

  describe('setSortBy', () => {
    it('should set sort option', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.setSortBy('price-asc');
      });
      
      expect(result.current.sortBy).toBe('price-asc');
    });
  });

  describe('setPriceRange', () => {
    it('should set price range', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.setPriceRange([10, 50]);
      });
      
      expect(result.current.priceRange).toEqual([10, 50]);
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to default', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.togglePricing('Paid');
        result.current.setKeyword('test');
        result.current.setPriceRange([20, 80]);
        result.current.setSortBy('price-asc');
      });
      
      act(() => {
        result.current.resetFilters();
      });
      
      expect(result.current.selectedPricing).toEqual([]);
      expect(result.current.keyword).toBe('');
      expect(result.current.priceRange).toEqual([0, 999]);
      expect(result.current.sortBy).toBe('name-asc');
    });
  });

  describe('loadMore', () => {
    it('should increment page', () => {
      const { result } = renderHook(() => useContentStore());
      
      act(() => {
        result.current.loadMore();
      });
      
      expect(result.current.page).toBe(1);
    });

    it('should set hasMore to false when all content is loaded', () => {
      const { result } = renderHook(() => useContentStore());
      
      // Load more pages until we exceed content length
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.loadMore();
        }
      });
      
      expect(result.current.hasMore).toBe(false);
    });
  });
});
