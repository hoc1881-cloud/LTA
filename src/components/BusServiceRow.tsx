import React from 'react';
import { 
  BusArrivalService, 
  NextBusInfo 
} from '../types/transit';
import { 
  formatArrivalMinutes, 
  getLoadMeta, 
  getDeckLabel 
} from '../utils/transitEngine';
import { 
  Accessibility, 
  Navigation, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BusServiceRowProps {
  arrival: BusArrivalService;
  onOpenRoute?: (serviceNo: string) => void;
}

const ArrivalPill: React.FC<{ busInfo?: NextBusInfo; isNext?: boolean }> = ({ busInfo, isNext = false }) => {
  if (!busInfo) {
    return <span className="text-slate-600 font-mono text-xs">--</span>;
  }

  const loadMeta = getLoadMeta(busInfo.load);
  const minutes = busInfo.arrivalMinutes;
  const isArriving = minutes <= 0;

  return (
    <div className={`flex flex-col ${isNext ? 'items-end' : 'items-center'} group relative`}>
      <div className="flex items-center gap-1.5">
        {/* Load indicator dot */}
        <span 
          className={`w-2 h-2 rounded-full ${loadMeta.dot} shrink-0`} 
          title={loadMeta.label}
        />
        
        {/* Arrival Time */}
        <span className={`font-mono font-bold tracking-tight ${
          isNext 
            ? isArriving ? 'text-emerald-400 text-lg animate-pulse' : 'text-white text-base'
            : 'text-slate-300 text-xs'
        }`}>
          {formatArrivalMinutes(minutes)}
        </span>
      </div>

      {/* Deck & Feature Indicators (Quiet Metadata) */}
      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 mt-0.5">
        <span>{busInfo.type}</span>
        {busInfo.feature === 'WAB' && (
          <span title="Wheelchair Accessible Bus">· WAB</span>
        )}
      </div>
    </div>
  );
};

export const BusServiceRow: React.FC<BusServiceRowProps> = ({ arrival, onOpenRoute }) => {
  return (
    <div className="p-3.5 sm:p-4 hover:bg-slate-900/60 transition-colors flex items-center justify-between gap-4 border-b border-slate-800/60 last:border-b-0">
      
      {/* Left: Service No & Operator */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-11 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center shadow-sm">
          <span className="font-bold text-base font-mono text-white leading-tight">
            {arrival.serviceNo}
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
            {arrival.operator}
          </span>
        </div>

        <button
          onClick={() => onOpenRoute && onOpenRoute(arrival.serviceNo)}
          className="text-left group hidden sm:block"
        >
          <div className="text-xs font-medium text-slate-300 group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
            <span>Route Details</span>
            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <span>Every 6—12 mins</span>
          </div>
        </button>
      </div>

      {/* Right: Next Bus, 2nd, 3rd Arrivals */}
      <div className="flex items-center gap-6 sm:gap-8">
        
        {/* Next Bus 1 (Main) */}
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase font-mono mb-0.5">Next</div>
          <ArrivalPill busInfo={arrival.nextBus} isNext={true} />
        </div>

        {/* 2nd Bus */}
        <div className="text-center min-w-[42px] hidden xs:block">
          <div className="text-[10px] text-slate-500 uppercase font-mono mb-0.5">2nd</div>
          <ArrivalPill busInfo={arrival.nextBus2} />
        </div>

        {/* 3rd Bus */}
        <div className="text-center min-w-[42px] hidden md:block">
          <div className="text-[10px] text-slate-500 uppercase font-mono mb-0.5">3rd</div>
          <ArrivalPill busInfo={arrival.nextBus3} />
        </div>

      </div>

    </div>
  );
};
