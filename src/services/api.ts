import { ContentItem, PricingOption, PRICING_MAP } from '../types';

const API_URL = 'https://closet-recruiting-api.azurewebsites.net/api/data';

export interface RawContentItem {
  id: string;
  creator: string;
  title: string;
  imagePath: string;
  pricingOption: number;
  price: number;
}

export async function fetchContent(): Promise<{ contents: ContentItem[]; pricingOptions: PricingOption[] }> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch content');
  }
  const data: RawContentItem[] = await response.json();
  
  return {
    contents: data.map(item => ({
      id: item.id,
      userName: item.creator,
      title: item.title,
      image: item.imagePath,
      pricing: PRICING_MAP[item.pricingOption] || 'Free',
      price: item.price,
    })),
    pricingOptions: ['Paid', 'Free', 'View Only'],
  };
}
