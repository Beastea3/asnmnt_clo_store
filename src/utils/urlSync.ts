import { PricingOption, SortOption } from '../types/index';

const PARAM_KEYWORD = 'keyword';
const PARAM_PRICING = 'pricing';
const PARAM_SORT = 'sort';
const PARAM_MIN_PRICE = 'min';
const PARAM_MAX_PRICE = 'max';

export function getUrlParams(): { 
  keyword: string; 
  pricing: PricingOption[];
  sortBy: SortOption;
  priceRange: [number, number];
} {
  const params = new URLSearchParams(window.location.search);
  
  const keyword = params.get(PARAM_KEYWORD) || '';
  
  const pricingStr = params.get(PARAM_PRICING);
  const pricing = pricingStr 
    ? pricingStr.split(',').filter(Boolean) as PricingOption[]
    : [];
  
  const sortBy = (params.get(PARAM_SORT) as SortOption) || 'name-asc';
  
  const minPrice = parseInt(params.get(PARAM_MIN_PRICE) || '0', 10);
  const maxPrice = parseInt(params.get(PARAM_MAX_PRICE) || '999', 10);
  
  return { 
    keyword, 
    pricing, 
    sortBy,
    priceRange: [minPrice, maxPrice] as [number, number]
  };
}

export function setUrlParams(
  keyword: string, 
  pricing: PricingOption[],
  sortBy?: SortOption,
  priceRange?: [number, number]
): void {
  const params = new URLSearchParams();
  
  if (keyword) {
    params.set(PARAM_KEYWORD, keyword);
  }
  
  if (pricing.length > 0) {
    params.set(PARAM_PRICING, pricing.join(','));
  }
  
  if (sortBy && sortBy !== 'name-asc') {
    params.set(PARAM_SORT, sortBy);
  }
  
  if (priceRange && (priceRange[0] > 0 || priceRange[1] < 999)) {
    params.set(PARAM_MIN_PRICE, priceRange[0].toString());
    params.set(PARAM_MAX_PRICE, priceRange[1].toString());
  }
  
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
  window.history.replaceState(null, '', newUrl);
}

export function clearUrlParams(): void {
  window.history.replaceState(null, '', window.location.pathname);
}
