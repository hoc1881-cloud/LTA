import React from 'react';
import { Search, X, MapPin, Sparkles, Filter } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedHub: string | null;
  onSelectHub: (hub: string | null) => void;
}

const POPULAR_HUBS = [
  { label: 'All Hubs', value: null },
  { label: 'Orchard Rd', value: 'Orchard' },
  { label: 'Bugis', value: 'Bugis' },
  { label: 'Dhoby Ghaut', value: 'Dhoby Ghaut' },
  { label: 'VivoCity', value: 'VivoCity' },
  { label: 'Jurong East', value: 'Jurong East' },
  { label: 'Woodlands', value: 'Woodlands' },
  { label: 'Tampines', value: 'Tampines' },
  { label: 'Changi Airport', value: 'Changi' },
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedHub,
  onSelectHub,
}) => {
  return (
    <div className="space-y-4">
      
      {/* Primary Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by 5-digit code (e.g. 08057), road (e.g. Orchard), or landmark..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Hub Filter Chips (Segmented Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-mono text-slate-500 uppercase shrink-0 mr-1 hidden sm:inline">
          Hotspots:
        </span>
        {POPULAR_HUBS.map((hub) => {
          const isSelected = selectedHub === hub.value;
          return (
            <button
              key={hub.label}
              onClick={() => {
                onSelectHub(isSelected ? null : hub.value);
                if (hub.value) {
                  onSearchChange(hub.value);
                } else {
                  onSearchChange('');
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all text-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {hub.label}
            </button>
          );
        })}
      </div>

    </div>
  );
};
