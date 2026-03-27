import type { FC, ChangeEvent } from 'react';
import { useContentStore } from '../store/contentStore';
import type { SortOption } from '../types';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Price (Low to High)', value: 'price-asc' },
  { label: 'Price (High to Low)', value: 'price-desc' },
];

export const Sorter: FC = () => {
  const { sortBy, setSortBy } = useContentStore();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  return (
    <div className="sorter">
      <label htmlFor="sorter-select" className="sorter-label">
        Sort by:
      </label>
      <select
        id="sorter-select"
        className="sorter-select"
        value={sortBy}
        onChange={handleChange}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};