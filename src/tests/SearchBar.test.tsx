import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
import { useContentStore } from '../store/contentStore';

describe('SearchBar', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.resetFilters();
    });
  });

  it('should render search input with placeholder', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/Find the Items you're looking for/i);
    expect(input).toBeInTheDocument();
  });

  it('should render search icon', () => {
    render(<SearchBar />);
    
    // Check for the search icon by looking for the SVG element inside .search-icon
    const searchIcon = document.querySelector('.search-icon svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should render Keyword search label', () => {
    render(<SearchBar />);
    
    expect(screen.getByText('Keyword search')).toBeInTheDocument();
  });

  it('should update keyword in store on input change', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/Find the Items you're looking for/i);
    fireEvent.change(input, { target: { value: 'dress' } });
    
    const { result } = renderHook(() => useContentStore());
    expect(result.current.keyword).toBe('dress');
  });

  it('should clear keyword when input is cleared', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/Find the Items you're looking for/i);
    fireEvent.change(input, { target: { value: 'test' } });
    
    const { result } = renderHook(() => useContentStore());
    expect(result.current.keyword).toBe('test');
    
    fireEvent.change(input, { target: { value: '' } });
    expect(result.current.keyword).toBe('');
  });

  it('should add focused class when input is focused', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/Find the Items you're looking for/i);
    fireEvent.focus(input);
    
    expect(input.closest('.search-pill')).toHaveClass('focused');
  });
});
