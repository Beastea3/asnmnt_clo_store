export type PricingOption = 'Free' | 'Paid' | 'View Only';

export type SortOption = 'relevance' | 'name-asc' | 'price-asc' | 'price-desc';

export const PRICING_MAP: Record<number, PricingOption> = {
  0: 'Paid',
  1: 'Free',
  2: 'View Only',
};

export interface ContentItem {
  id: string;
  userName: string;
  title: string;
  image: string;
  pricing: PricingOption;
  price?: number;
}

export interface ContentResponse {
  contents: ContentItem[];
  pricingOptions: PricingOption[];
}
