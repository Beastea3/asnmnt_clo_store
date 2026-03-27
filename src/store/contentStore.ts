import { create } from 'zustand';
import { PricingOption, ContentItem } from '../types';
import { getUrlParams, setUrlParams } from '../utils/urlSync';

export type SortOption = 'name-asc' | 'price-asc' | 'price-desc';

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

const DEFAULT_PRICING: PricingOption[] = ['Free', 'Paid', 'View Only'];

// Get initial state from URL
const urlParams = getUrlParams();

export const useContentStore = create<ContentState>((set, get) => ({
  allContent: [],
  pricingOptions: DEFAULT_PRICING,
  selectedPricing: urlParams.pricing,
  keyword: urlParams.keyword,
  priceRange: [0, 999] as [number, number],
  sortBy: 'name-asc',
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
    const { selectedPricing, keyword, sortBy } = get();
    const newSelected = selectedPricing.includes(option)
      ? selectedPricing.filter(p => p !== option)
      : [...selectedPricing, option];
    set({ selectedPricing: newSelected, page: 0, hasMore: true });
    setUrlParams(keyword, newSelected, sortBy);
  },

  setKeyword: (keyword) => {
    const { selectedPricing, sortBy } = get();
    set({ keyword, page: 0, hasMore: true });
    setUrlParams(keyword, selectedPricing, sortBy);
  },

  setPriceRange: (range) => {
    const { keyword, selectedPricing, sortBy } = get();
    set({ priceRange: range, page: 0, hasMore: true });
    setUrlParams(keyword, selectedPricing, sortBy, range);
  },

  setSortBy: (sortBy) => {
    const { keyword, selectedPricing } = get();
    set({ sortBy, page: 0, hasMore: true });
    setUrlParams(keyword, selectedPricing, sortBy);
  },

  resetFilters: () => {
    set({ selectedPricing: [], keyword: '', priceRange: [0, 999], sortBy: 'name-asc', page: 0, hasMore: true });
    setUrlParams('', [], 'name-asc', [0, 999]);
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
      sortBy: urlParams.sortBy || 'name-asc',
      priceRange: urlParams.priceRange || [0, 999],
      page: 0,
      hasMore: true
    });
  },
}));
