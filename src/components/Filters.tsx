'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  category: string[];
  metal: string[];
  condition: string[];
  yearRange: [number, number];
  priceRange: [number, number];
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  metals: string[];
  conditions: string[];
}

export default function Filters({ filters, onFilterChange, categories, metals, conditions }: FiltersProps) {
  const [openSection, setOpenSection] = useState<{ [key: string]: boolean }>({
    category: true,
    metal: true,
    condition: true,
    price: true,
  });

  const toggleSection = (section: string) => {
    setOpenSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (section: 'category' | 'metal' | 'condition', value: string) => {
    const updated = filters[section].includes(value)
      ? filters[section].filter((item) => item !== value)
      : [...filters[section], value];

    const newFilters = { ...filters, [section]: updated };
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg dark:text-white">Filters</h3>
        <button 
          onClick={() => {
            const reset = {
              category: [], metal: [], condition: [], yearRange: [-1000, 2026] as [number, number], priceRange: [0, 500000] as [number, number]
            };
            onFilterChange(reset);
          }}
          className="text-sm text-zinc-500 hover:text-amber-600 transition-colors"
        >
          Reset All
        </button>
      </div>

      {[{ id: 'category', label: 'Categories', data: categories },
        { id: 'metal', label: 'Metal', data: metals },
        { id: 'condition', label: 'Condition', data: conditions }].map((filterGroup) => (
        <div key={filterGroup.id} className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <button 
            type="button"
            onClick={() => toggleSection(filterGroup.id)} 
            className="flex justify-between w-full text-left font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {filterGroup.label}
            {openSection[filterGroup.id] ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
          </button>
          
          {openSection[filterGroup.id] && (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {filterGroup.data.map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-amber-600 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:ring-amber-500 focus:ring-2 cursor-pointer transition-colors"
                    checked={filters[filterGroup.id as keyof FilterState].includes(item as never)}
                    onChange={() => handleCheckboxChange(filterGroup.id as any, item)}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Price Range Filter (Simplified) */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <button 
          type="button"
          onClick={() => toggleSection('price')} 
          className="flex justify-between w-full text-left font-semibold text-zinc-800 dark:text-zinc-200"
        >
          Price Range
          {openSection.price ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
        </button>
        {openSection.price && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <input 
              type="number"
              placeholder="Min"
              className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 dark:text-white outline-none focus:border-amber-500"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newRange: [number, number] = [Number(e.target.value), filters.priceRange[1]];
                onFilterChange({ ...filters, priceRange: newRange });
              }}
            />
            <span className="text-zinc-400">-</span>
            <input 
              type="number"
              placeholder="Max"
              className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 dark:text-white outline-none focus:border-amber-500"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newRange: [number, number] = [filters.priceRange[0], Number(e.target.value)];
                onFilterChange({ ...filters, priceRange: newRange });
              }}
            />
          </div>
        )}
      </div>

    </div>
  );
}
