import React from 'react';
import { BusStop, BusArrivalService, FavoriteBookmark } from '../types/transit';
import { BusStopCard } from './BusStopCard';
import { Star, Bus, Search, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: FavoriteBookmark[];
  allStops: BusStop[];
  arrivalsMap: Record<string, BusArrivalService[]>;
  onToggleFavorite: (stopCode: string) => void;
  onOpenRoute?: (serviceNo: string) => void;
  onExploreStops: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  allStops,
  arrivalsMap,
  onToggleFavorite,
  onOpenRoute,
  onExploreStops,
}) => {
  const favoriteStops = allStops.filter((stop) =>
    favorites.some((fav) => fav.stopCode === stop.code)
  );

  if (favoriteStops.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <Star className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">No Saved Bus Stops Yet</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Tap the star icon on any bus stop to pin it here for instant, 1-tap arrival countdowns.
          </p>
        </div>
        <button
          onClick={onExploreStops}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5 active:scale-95"
        >
          <span>Explore Singapore Bus Stops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Saved Bus Stops</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-refreshing real-time arrivals for your daily commute
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {favoriteStops.length} Saved
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {favoriteStops.map((stop) => (
          <BusStopCard
            key={stop.code}
            busStop={stop}
            arrivals={arrivalsMap[stop.code] || []}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            onOpenRoute={onOpenRoute}
          />
        ))}
      </div>
    </div>
  );
};
