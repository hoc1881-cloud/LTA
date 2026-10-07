import React, { useState } from 'react';
import { BusStop, BusArrivalService } from '../types/transit';
import { BusServiceRow } from './BusServiceRow';
import { 
  Star, 
  MapPin, 
  Copy, 
  Check, 
  Search, 
  Train, 
  Share2 
} from 'lucide-react';

interface BusStopCardProps {
  busStop: BusStop;
  arrivals: BusArrivalService[];
  isFavorite: boolean;
  onToggleFavorite: (stopCode: string) => void;
  onOpenRoute?: (serviceNo: string) => void;
}

export const BusStopCard: React.FC<BusStopCardProps> = ({
  busStop,
  arrivals,
  isFavorite,
  onToggleFavorite,
  onOpenRoute,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(busStop.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredArrivals = arrivals.filter((arr) =>
    arr.serviceNo.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  return (
    <article className="rounded-2xl bg-slate-900 border border-slate-800 shadow-lg overflow-hidden transition-all hover:border-slate-700/80">
      
      {/* Bus Stop Header */}
      <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-start justify-between gap-4">
          
          <div className="space-y-1">
            {/* Bus Stop Code & Road Name (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleCopyCode}
                className="font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-emerald-900/60 transition-colors"
                title="Click to copy 5-digit bus stop code"
              >
                <span>{busStop.code}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-emerald-400" />}
              </button>

              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-medium">{busStop.roadName}</span>
            </div>

            {/* Stop Description */}
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {busStop.description}
            </h3>

            {/* Interchange link */}
            {busStop.mrtInterchange && (
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium pt-0.5">
                <Train className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Near {busStop.mrtInterchange}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Favorite Star */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(busStop.code)}
              className={`p-2 rounded-xl transition-all active:scale-95 ${
                isFavorite
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Quick bus search filter if stop has > 4 services */}
        {arrivals.length > 5 && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter bus number (e.g. 190)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {filteredArrivals.length} of {arrivals.length} services
            </span>
          </div>
        )}
      </div>

      {/* Bus Services Arrival Rows */}
      <div className="divide-y divide-slate-800/40">
        {filteredArrivals.length > 0 ? (
          filteredArrivals.map((arrival) => (
            <BusServiceRow
              key={arrival.serviceNo}
              arrival={arrival}
              onOpenRoute={onOpenRoute}
            />
          ))
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            No bus service matches "{searchFilter}" at this stop.
          </div>
        )}
      </div>

    </article>
  );
};
