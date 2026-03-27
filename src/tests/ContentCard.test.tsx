import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentCard } from '../components/ContentCard';
import { ContentItem } from '../types';

const mockFreeItem: ContentItem = {
  id: '1',
  userName: 'Alice',
  title: 'Summer Dress',
  image: 'https://example.com/dress.jpg',
  pricing: 'Free',
};

const mockPaidItem: ContentItem = {
  id: '2',
  userName: 'Bob',
  title: 'Winter Coat',
  image: 'https://example.com/coat.jpg',
  pricing: 'Paid',
  price: 49.99,
};

const mockViewOnlyItem: ContentItem = {
  id: '3',
  userName: 'Charlie',
  title: 'Spring Skirt',
  image: 'https://example.com/skirt.jpg',
  pricing: 'View Only',
};

describe('ContentCard', () => {
  it('should render item title', () => {
    render(<ContentCard item={mockFreeItem} />);
    
    expect(screen.getByText('Summer Dress')).toBeInTheDocument();
  });

  it('should render user name', () => {
    render(<ContentCard item={mockFreeItem} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should render FREE text for Free items', () => {
    render(<ContentCard item={mockFreeItem} />);
    
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('should render price for Paid items', () => {
    render(<ContentCard item={mockPaidItem} />);
    
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('should render View Only for View Only items', () => {
    render(<ContentCard item={mockViewOnlyItem} />);
    
    expect(screen.getByText('View Only')).toBeInTheDocument();
  });

  it('should render image with correct src', () => {
    render(<ContentCard item={mockFreeItem} priority={true} />);
    
    const image = document.querySelector('.content-image img');
    expect(image).toHaveAttribute('src', 'https://example.com/dress.jpg');
  });

  it('should have correct class for pricing', () => {
    const { container } = render(<ContentCard item={mockFreeItem} />);
    
    expect(container.querySelector('.content-price')).toHaveClass('free');
  });
});
