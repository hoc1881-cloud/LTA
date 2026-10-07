import React, { useState, useEffect, useCallback } from 'react';
import { SINGAPORE_BUS_STOPS, MRT_LINES } from './data/singaporeTransitData';
import { BusStop, BusArrivalService, FavoriteBookmark } from './types/transit';
import { 
  getSimulatedArrivals, 
  fetchLiveLTAArrivals,
  getFavorites, 
  toggleFavorite, 
  getStoredSettings, 
  AppSettings 
} from './utils/transitEngine';
import { TransitHeader } from './components/TransitHeader';
import { SearchAndFilters } from './components/SearchAndFilters';
import { BusStopCard } from './components/BusStopCard';
import { FavoritesView } from './components/FavoritesView';
import { MRTStatusView } from './components/MRTStatusView';
import { BusRouteModal } from './components/BusRouteModal';
import { SettingsModal } from './components/SettingsModal';
import { 
  Bus, 
  Train, 
  Star, 
  Search, 
  Info, 
  ShieldCheck, 
  Radio, 
  Clock 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'stops' | 'favorites' | 'mrt' | 'routes'>('stops');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteBookmark[]>(() => getFavorites());

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Route modal
  const [activeRouteService, setActiveRouteService] = useState<string | null>(null);

  // Live arrivals map: key is stopCode -> BusArrivalService[]
  const [arrivalsMap, setArrivalsMap] = useState<Record<string, BusArrivalService[]>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(settings.autoRefreshInterval);

  // Compute arrivals for all visible or loaded stops
  const refreshArrivals = useCallback(async () => {
    setIsRefreshing(true);
    const updated: Record<string, BusArrivalService[]> = {};
    for (const stop of SINGAPORE_BUS_STOPS) {
      updated[stop.code] = getSimulatedArrivals(stop);
    }
    setArrivalsMap({ ...updated });

    // Query live /api/bus-arrival endpoint for active stops
    try {
      const activeStops = SINGAPORE_BUS_STOPS.slice(0, 6);
      const promises = activeStops.map(async (stop) => {
        const live = await fetchLiveLTAArrivals(stop, settings.ltaAccountKey);
        if (live && live.length > 0) {
          updated[stop.code] = live;
        }
      });
      await Promise.allSettled(promises);
      setArrivalsMap({ ...updated });
    } catch (e) {
      // fallback preserved
    } finally {
      setIsRefreshing(false);
      setSecondsUntilRefresh(settings.autoRefreshInterval);
    }
  }, [settings.autoRefreshInterval, settings.ltaAccountKey]);

  // Initial load
  useEffect(() => {
    refreshArrivals();
  }, [refreshArrivals]);

  // Auto-refresh countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          refreshArrivals();
          return settings.autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshArrivals, settings.autoRefreshInterval]);

  // Toggle favorite handler
  const handleToggleFavorite = (stopCode: string) => {
    toggleFavorite(stopCode);
    setFavorites(getFavorites());
  };

  const handleClearFavorites = () => {
    localStorage.removeItem('sg_lta_favorites_v1');
    setFavorites([]);
  };

  // Filtered bus stops
  const filteredStops = SINGAPORE_BUS_STOPS.filter((stop) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const matchesCode = stop.code.toLowerCase().includes(q);
    const matchesRoad = stop.roadName.toLowerCase().includes(q);
    const matchesDesc = stop.description.toLowerCase().includes(q);
    const matchesService = stop.services.some((srv) => srv.toLowerCase() === q || srv.toLowerCase().startsWith(q));
    const matchesMrt = stop.mrtInterchange?.toLowerCase().includes(q);

    return matchesCode || matchesRoad || matchesDesc || matchesService || matchesMrt;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Top Transit Header */}
      <TransitHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoritesCount={favorites.length}
        secondsUntilRefresh={secondsUntilRefresh}
        onManualRefresh={refreshArrivals}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Tab 1: All Bus Stops Explorer */}
        {activeTab === 'stops' && (
          <div className="space-y-6">
            
            {/* Search Bar & Hotspot Chips */}
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedHub={selectedHub}
              onSelectHub={setSelectedHub}
            />

            {/* Results Header / Stats */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span>Showing {filteredStops.length} Bus Stops in Singapore</span>
                {searchQuery && (
                  <span className="text-emerald-400 font-mono">matching "{searchQuery}"</span>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next Bus countdown synced</span>
              </div>
            </div>

            {/* Bus Stop Cards Grid */}
            {filteredStops.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStops.map((stop) => {
                  const isFav = favorites.some((f) => f.stopCode === stop.code);
                  return (
                    <BusStopCard
                      key={stop.code}
                      busStop={stop}
                      arrivals={arrivalsMap[stop.code] || []}
                      isFavorite={isFav}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenRoute={setActiveRouteService}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-base font-semibold text-white">No bus stops found</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try searching by 5-digit code like <span className="font-mono text-emerald-400">08057</span>, road name like <span className="text-white">Orchard</span>, or landmark like <span className="text-white">Bugis</span>.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
                >
                  Clear Search Filter
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Saved Favorites View */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            allStops={SINGAPORE_BUS_STOPS}
            arrivalsMap={arrivalsMap}
            onToggleFavorite={handleToggleFavorite}
            onOpenRoute={setActiveRouteService}
            onExploreStops={() => setActiveTab('stops')}
          />
        )}

        {/* Tab 3: MRT Status View */}
        {activeTab === 'mrt' && (
          <MRTStatusView />
        )}

      </main>

      {/* Bus Route Sequence Timeline Modal */}
      <BusRouteModal
        serviceNo={activeRouteService}
        onClose={() => setActiveRouteService(null)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onClearFavorites={handleClearFavorites}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Singapore Land Transport (LTA) Live Arrival App</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Real-time SBS Transit, SMRT, Tower Transit & Go-Ahead GPS Engine</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>DataMall v2.0</span>
            <span>·</span>
            <span>All 6 MRT Lines Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
