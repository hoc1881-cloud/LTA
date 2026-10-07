import React from 'react';
import { 
  Bus, 
  Train, 
  RotateCw, 
  Settings, 
  Star, 
  MapPin, 
  Radio, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface TransitHeaderProps {
  activeTab: 'stops' | 'favorites' | 'mrt' | 'routes';
  onSelectTab: (tab: 'stops' | 'favorites' | 'mrt' | 'routes') => void;
  favoritesCount: number;
  secondsUntilRefresh: number;
  onManualRefresh: () => void;
  onOpenSettings: () => void;
  isRefreshing: boolean;
}

export const TransitHeader: React.FC<TransitHeaderProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  secondsUntilRefresh,
  onManualRefresh,
  onOpenSettings,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">SG Transit</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LTA Live</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
              <span>Land Transport Authority</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Bus & MRT Arrival Engine</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Segmented Filter Controls) */}
        <nav className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => onSelectTab('stops')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'stops'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bus Stops</span>
            <span className="sm:hidden">Buses</span>
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Saved ({favoritesCount})</span>
          </button>

          <button
            onClick={() => onSelectTab('mrt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'mrt'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>MRT Status</span>
          </button>
        </nav>

        {/* Right Actions: Auto-refresh & Settings */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono transition-colors active:scale-95"
            title="Refresh Bus Timings Now"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{secondsUntilRefresh}s</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="LTA DataMall & App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
