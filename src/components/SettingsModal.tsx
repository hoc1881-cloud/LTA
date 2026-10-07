import React, { useState } from 'react';
import { AppSettings, saveSettings } from '../utils/transitEngine';
import { 
  X, 
  Settings, 
  Key, 
  RotateCw, 
  Volume2, 
  Info, 
  Trash2, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearFavorites: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearFavorites,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    onUpdateSettings(localSettings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">App & Transit Settings</h3>
              <p className="text-xs text-slate-400">LTA DataMall & arrival engine preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
          
          {/* Refresh Frequency */}
          <div className="space-y-2">
            <label className="block font-medium text-slate-200">
              Auto-Refresh Cadence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => setLocalSettings({ ...localSettings, autoRefreshInterval: sec })}
                  className={`py-2 px-3 rounded-xl border font-mono font-medium text-center transition-all ${
                    localSettings.autoRefreshInterval === sec
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec} seconds
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Arrival countdowns recompute automatically while active in browser.
            </p>
          </div>

          {/* LTA DataMall Key (Optional) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                <span>LTA DataMall AccountKey (Optional)</span>
              </label>
              <a
                href="https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              value={localSettings.ltaAccountKey || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, ltaAccountKey: e.target.value })}
              placeholder="e.g. your_lta_datamall_guid_key"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              Built-in live GPS calculation engine runs automatically out of the box.
            </p>
          </div>

          {/* Legend: Crowd Levels & Types */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-[11px]">
            <div className="font-semibold text-slate-300 font-mono">Official LTA Crowd Legend:</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Seats Avail</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Standing</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Limited</span>
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset Favorites */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all saved favorite stops?')) {
                  onClearFavorites();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Saved Stops</span>
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-sm"
            >
              {savedToast ? 'Saved!' : 'Save Preferences'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
