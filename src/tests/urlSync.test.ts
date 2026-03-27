import { getUrlParams, setUrlParams, clearUrlParams } from '../utils/urlSync';
import { PricingOption } from '../types';

describe('urlSync', () => {
  const originalLocation = window.location;
  
  beforeEach(() => {
    // Reset URL before each test
    window.history.replaceState(null, '', '/');
  });

  afterAll(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
    });
  });

  describe('getUrlParams', () => {
    it('should return empty values when no params', () => {
      window.history.replaceState(null, '', '/');
      
      const params = getUrlParams();
      
      expect(params.keyword).toBe('');
      expect(params.pricing).toEqual([]);
      expect(params.sortBy).toBe('relevance');
      expect(params.priceRange).toEqual([0, 999]);
    });

    it('should parse keyword from URL', () => {
      window.history.replaceState(null, '', '/?keyword=dress');
      
      const params = getUrlParams();
      
      expect(params.keyword).toBe('dress');
    });

    it('should parse pricing from URL', () => {
      window.history.replaceState(null, '', '/?pricing=Free,Paid');
      
      const params = getUrlParams();
      
      expect(params.pricing).toContain('Free');
      expect(params.pricing).toContain('Paid');
    });

    it('should parse sort from URL', () => {
      window.history.replaceState(null, '', '/?sort=price-asc');
      
      const params = getUrlParams();
      
      expect(params.sortBy).toBe('price-asc');
    });

    it('should parse price range from URL', () => {
      window.history.replaceState(null, '', '/?min=10&max=50');
      
      const params = getUrlParams();
      
      expect(params.priceRange).toEqual([10, 50]);
    });

    it('should handle full URL with all params', () => {
      window.history.replaceState(null, '', '/?keyword=jacket&pricing=Paid&sort=price-asc&min=20&max=80');
      
      const params = getUrlParams();
      
      expect(params.keyword).toBe('jacket');
      expect(params.pricing).toContain('Paid');
      expect(params.sortBy).toBe('price-asc');
      expect(params.priceRange).toEqual([20, 80]);
    });
  });

  describe('setUrlParams', () => {
    it('should set keyword in URL', () => {
      setUrlParams('dress', []);
      
      expect(window.location.pathname).toBe('/');
      expect(new URLSearchParams(window.location.search).get('keyword')).toBe('dress');
    });

    it('should set pricing in URL', () => {
      setUrlParams('', ['Free', 'Paid'] as PricingOption[]);
      
      expect(new URLSearchParams(window.location.search).get('pricing')).toBe('Free,Paid');
    });

    it('should set sort in URL', () => {
      setUrlParams('', [], 'price-asc');
      
      expect(new URLSearchParams(window.location.search).get('sort')).toBe('price-asc');
    });

    it('should not set sort if relevance (default)', () => {
      setUrlParams('', [], 'relevance');
      
      expect(new URLSearchParams(window.location.search).has('sort')).toBe(false);
    });

    it('should set sort when name-asc is selected', () => {
      setUrlParams('', [], 'name-asc');

      expect(new URLSearchParams(window.location.search).get('sort')).toBe('name-asc');
    });

    it('should set price range in URL', () => {
      setUrlParams('', [], undefined, [10, 50]);
      
      expect(new URLSearchParams(window.location.search).get('min')).toBe('10');
      expect(new URLSearchParams(window.location.search).get('max')).toBe('50');
    });

    it('should not set price range if default values', () => {
      setUrlParams('', [], undefined, [0, 999]);
      
      expect(new URLSearchParams(window.location.search).has('min')).toBe(false);
      expect(new URLSearchParams(window.location.search).has('max')).toBe(false);
    });

    it('should clear previous params when setting new ones', () => {
      window.history.replaceState(null, '', '/?keyword=old&pricing=Free');
      
      setUrlParams('new', []);
      
      expect(new URLSearchParams(window.location.search).get('keyword')).toBe('new');
      expect(new URLSearchParams(window.location.search).has('pricing')).toBe(false);
    });
  });

  describe('clearUrlParams', () => {
    it('should clear all URL params', () => {
      window.history.replaceState(null, '', '/?keyword=test&pricing=Free');
      
      clearUrlParams();
      
      expect(window.location.search).toBe('');
    });
  });
});
