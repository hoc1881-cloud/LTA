import React, { useState } from 'react';
import { MRT_LINES } from '../data/singaporeTransitData';
import { MRTLine, MRTStation } from '../types/transit';
import { 
  Train, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Search,
  Radio
} from 'lucide-react';

export const MRTStatusView: React.FC = () => {
  const [selectedLineId, setSelectedLineId] = useState<string>('nsl');
  const [stationSearch, setStationSearch] = useState<string>('');

  const selectedLine = MRT_LINES.find((l) => l.id === selectedLineId) || MRT_LINES[0];

  const filteredStations = selectedLine.stations.filter((st) =>
    st.name.toLowerCase().includes(stationSearch.toLowerCase().trim()) ||
    st.code.toLowerCase().includes(stationSearch.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      
      {/* Network Overview Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Mass Rapid Transit (MRT) Operational Status</h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                All 6 Lines Normal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live signaling telemetry synchronized with LTA & SMRT/SBS Transit control centers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono self-end md:self-auto">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Peak Frequency: 2—3 mins</span>
        </div>
      </div>

      {/* MRT Lines Grid (Line Selector) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {MRT_LINES.map((line) => {
          const isSelected = line.id === selectedLineId;
          return (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-white/40 shadow-lg scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Color Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: line.color }} 
              />

              <div className="flex items-center justify-between mt-1">
                <span 
                  className="font-mono font-bold text-xs px-1.5 py-0.5 rounded shadow-sm"
                  style={{ backgroundColor: line.color, color: line.textColor }}
                >
                  {line.code}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Normal Service" />
              </div>

              <div className="font-semibold text-xs text-white mt-2 truncate">
                {line.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {line.headwayMinutes}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Line Detail & Station Sequence */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        
        {/* Line Header Banner */}
        <div 
          className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            background: `linear-gradient(135deg, ${selectedLine.color}22 0%, #0f172a 100%)`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
              style={{ backgroundColor: selectedLine.color, color: selectedLine.textColor }}
            >
              {selectedLine.code}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {selectedLine.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                <span className="text-emerald-400 font-medium">● {selectedLine.status}</span>
                <span>·</span>
                <span>{selectedLine.stations.length} Stations</span>
                <span>·</span>
                <span>Headway: {selectedLine.headwayMinutes}</span>
              </div>
            </div>
          </div>

          {/* Search in Stations */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={stationSearch}
              onChange={(e) => setStationSearch(e.target.value)}
              placeholder="Search station or code (e.g. Dhoby Ghaut, NS24)..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Stations Sequence List */}
        <div className="p-4 sm:p-6 divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
          {filteredStations.map((station, idx) => {
            // Simulated next train times
            const nextTrain1 = (idx * 2 + 1) % 4 + 1;
            const nextTrain2 = nextTrain1 + 3;

            return (
              <div 
                key={station.code} 
                className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-lg transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="w-12 text-center font-mono font-bold text-[11px] py-1 rounded"
                    style={{ backgroundColor: `${selectedLine.color}25`, color: selectedLine.color }}
                  >
                    {station.code}
                  </span>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {station.name}
                    </div>
                    {station.interchange && (
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                        <span>Transfer:</span>
                        {station.interchange.map((ic) => (
                          <span 
                            key={ic} 
                            className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-bold"
                          >
                            {ic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{nextTrain1} min</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{nextTrain2} min</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Platform Next</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
