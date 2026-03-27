import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { Filter } from '../components/Filter';
import { useContentStore } from '../store/contentStore';

const renderFilter = () => {
  return render(<Filter />);
};

describe('Filter', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.resetFilters();
      result.current.setContent([], ['Free', 'Paid', 'View Only']);
    });
  });

  it('should render all pricing options', () => {
    renderFilter();
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('View Only')).toBeInTheDocument();
  });

  it('should render Price Option label', () => {
    renderFilter();
    
    expect(screen.getByText('Price Option')).toBeInTheDocument();
  });

  it('should render Reset button', () => {
    renderFilter();
    
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should toggle pricing option on click', () => {
    renderFilter();
    
    const freeButton = screen.getByText('Free');
    fireEvent.click(freeButton);
    
    const { result } = renderHook(() => useContentStore());
    expect(result.current.selectedPricing).toContain('Free');
  });

  it('should call resetFilters when Reset is clicked', () => {
    renderFilter();
    
    // Select something first
    const paidButton = screen.getByText('Paid');
    fireEvent.click(paidButton);
    
    // Then reset
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    const { result } = renderHook(() => useContentStore());
    expect(result.current.selectedPricing).toEqual([]);
  });

  it('should render Sort by dropdown', () => {
    renderFilter();
    
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render price slider', () => {
    renderFilter();
    
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$999+')).toBeInTheDocument();
  });
});
