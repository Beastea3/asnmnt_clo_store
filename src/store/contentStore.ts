import { create } from 'zustand';
import { PricingOption, ContentItem, SortOption } from '../types';
import { getUrlParams, setUrlParams } from '../utils/urlSync';

interface ContentState {
  // Raw data
  allContent: ContentItem[];
  pricingOptions: PricingOption[];
  
  // Filters - initialized from URL
  selectedPricing: PricingOption[];
  keyword: string;
  priceRange: [number, number];
  
  // Sorting
  sortBy: SortOption;
  
  // Pagination
  page: number;
  pageSize: number;
  
  // UI state
  loading: boolean;
  hasMore: boolean;
  
  // Actions
  setContent: (content: ContentItem[], pricingOptions: PricingOption[]) => void;
  togglePricing: (option: PricingOption) => void;
  setKeyword: (keyword: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  loadMore: () => void;
  resetPagination: () => void;
  syncFromUrl: () => void;
}

const DEFAULT_PRICING: PricingOption[] = ['Paid', 'Free', 'View Only'];

// Get initial state from URL
const urlParams = getUrlParams();

export const useContentStore = create<ContentState>((set, get) => ({
  allContent: [],
  pricingOptions: DEFAULT_PRICING,
  selectedPricing: urlParams.pricing,
  keyword: urlParams.keyword,
  priceRange: urlParams.priceRange,
  sortBy: urlParams.sortBy || 'relevance',
  page: 0,
  pageSize: 12,
  loading: false,
  hasMore: true,

  setContent: (content, pricingOptions) => set({ 
    allContent: content, 
    pricingOptions,
    page: 0,
    hasMore: true 
  }),

  togglePricing: (option) => {
    const { selectedPricing, keyword, sortBy, priceRange } = get();
    const newSelected = selectedPricing.includes(option)
      ? selectedPricing.filter(p => p !== option)
      : [...selectedPricing, option];
    set({ selectedPricing: newSelected, page: 0, hasMore: true });
    setUrlParams(keyword, newSelected, sortBy, priceRange);
  },

  setKeyword: (keyword) => {
    const { selectedPricing, sortBy, priceRange } = get();
    set({ keyword, page: 0, hasMore: true });
    setUrlParams(keyword, selectedPricing, sortBy, priceRange);
  },

  setPriceRange: (range) => {
    const { keyword, selectedPricing, sortBy } = get();
    set({ priceRange: range, page: 0, hasMore: true });
    setUrlParams(keyword, selectedPricing, sortBy, range);
  },

  setSortBy: (sortBy) => {
    const { keyword, selectedPricing, priceRange } = get();
    set({ sortBy, page: 0, hasMore: true });
    setUrlParams(keyword, selectedPricing, sortBy, priceRange);
  },

  resetFilters: () => {
    set({ selectedPricing: [], keyword: '', priceRange: [0, 999], sortBy: 'relevance', page: 0, hasMore: true });
    setUrlParams('', [], 'relevance', [0, 999]);
  },

  loadMore: () => {
    const { page, allContent, pageSize } = get();
    const nextPage = page + 1;
    const hasMore = nextPage * pageSize < allContent.length;
    set({ page: nextPage, hasMore });
  },

  resetPagination: () => set({ page: 0, hasMore: true }),

  syncFromUrl: () => {
    const urlParams = getUrlParams();
    set({ 
      selectedPricing: urlParams.pricing, 
      keyword: urlParams.keyword,
      sortBy: urlParams.sortBy || 'relevance',
      priceRange: urlParams.priceRange || [0, 999],
      page: 0,
      hasMore: true
    });
  },
}));
