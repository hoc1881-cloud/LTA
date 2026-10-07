import React from 'react';
import { SAMPLE_BUS_ROUTES } from '../data/singaporeTransitData';
import { BusRoute } from '../types/transit';
import { getLoadMeta } from '../utils/transitEngine';
import { 
  X, 
  Bus, 
  MapPin, 
  Clock, 
  Navigation, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface BusRouteModalProps {
  serviceNo: string | null;
  onClose: () => void;
}

export const BusRouteModal: React.FC<BusRouteModalProps> = ({ serviceNo, onClose }) => {
  if (!serviceNo) return null;

  const route: BusRoute | undefined = SAMPLE_BUS_ROUTES[serviceNo] || {
    serviceNo,
    operator: 'SBST',
    direction: 1,
    originName: 'Central Interchange',
    destinationName: 'Regional Terminal',
    firstBusWeekday: '05:30',
    lastBusWeekday: '23:30',
    stops: [
      { stopCode: '01012', stopName: 'Hotel Grand Pacific', roadName: 'Victoria St', seq: 1, distanceKm: 0, hasBusCurrent: true, busLoad: 'SEA' },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn Exit B', roadName: 'Orchard Rd', seq: 2, distanceKm: 1.8, hasBusCurrent: false },
      { stopCode: '09048', stopName: 'Orchard Stn / Tangs', roadName: 'Orchard Rd', seq: 3, distanceKm: 3.2, hasBusCurrent: true, busLoad: 'SDA' },
      { stopCode: '10169', stopName: 'VivoCity', roadName: 'Telok Blangah Rd', seq: 4, distanceKm: 7.5, hasBusCurrent: false },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex flex-col items-center justify-center text-white font-mono shadow-md">
              <span className="font-bold text-lg leading-none">{route.serviceNo}</span>
              <span className="text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">{route.operator}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span>{route.originName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>{route.destinationName}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>First {route.firstBusWeekday}</span>
                </span>
                <span>·</span>
                <span>Last {route.lastBusWeekday}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Route Timeline Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Route Sequence & Active Bus Positions</span>
            <span className="font-mono text-emerald-400">{route.stops.length} Stops</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {route.stops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === route.stops.length - 1;
              const loadMeta = stop.busLoad ? getLoadMeta(stop.busLoad) : null;

              return (
                <div key={stop.stopCode} className="relative group">
                  
                  {/* Stop Marker Dot on Vertical Track */}
                  <div className={`absolute -left-[19px] top-1.5 w-3 h-3 rounded-full border-2 transition-all ${
                    stop.hasBusCurrent 
                      ? 'bg-emerald-400 border-white ring-4 ring-emerald-500/30'
                      : 'bg-slate-900 border-slate-600'
                  }`} />

                  {/* Stop Info Card */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-slate-300">{stop.stopCode}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 text-[11px]">{stop.roadName}</span>
                        </div>
                        <div className="font-semibold text-white text-sm mt-0.5">
                          {stop.stopName}
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-mono text-slate-500">
                        {stop.distanceKm > 0 ? `${stop.distanceKm} km` : 'Origin'}
                      </div>
                    </div>

                    {/* Active Bus Indicator if a bus is currently at/approaching this stop */}
                    {stop.hasBusCurrent && loadMeta && (
                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono">
                        <Bus className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                        <span className="text-emerald-400 font-semibold">Bus Active Here</span>
                        <span className="text-slate-600">·</span>
                        <span className={`flex items-center gap-1 ${loadMeta.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${loadMeta.dot}`} />
                          <span>{loadMeta.label}</span>
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Direction 1 · Normal Weekday Operating Hours</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Route
          </button>
        </div>

      </div>
    </div>
  );
};
