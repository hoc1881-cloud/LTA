import React from 'react';
import { 
  Play, 
  Palette, 
  Code2, 
  SplitSquareVertical, 
  Upload, 
  Download, 
  Layers, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import { ActiveTab, StitchProject } from '../types';

interface HeaderProps {
  currentProject: StitchProject;
  projects: StitchProject[];
  onSelectProject: (project: StitchProject) => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenUpload: () => void;
  onExportZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  activeTab,
  onSelectTab,
  onOpenUpload,
  onExportZip,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-6 flex items-center justify-between">
      
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">Stitch Studio</span>
              <span className="text-[10px] uppercase font-mono text-blue-400 bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded">
                Runner v2.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Google Stitch Web App Environment</p>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden md:block" />

        {/* Project Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
              {currentProject.name}
            </span>
            {currentProject.isUserUploaded && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1 py-0.2 rounded font-mono">
                Custom
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                Switch Project
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start justify-between text-xs transition-colors hover:bg-slate-800/60 ${
                      p.id === currentProject.id ? 'bg-slate-800/80 text-white' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-100 flex items-center gap-2">
                        {p.name}
                        {p.isUserUploaded && (
                          <span className="text-[9px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1 rounded font-mono">
                            ZIP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{p.description}</div>
                    </div>
                    {p.id === currentProject.id && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-800/80 bg-slate-950/40">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenUpload();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import New Stitch ZIP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Central Viewport / Mode Tabs */}
      <nav className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
        <button
          onClick={() => onSelectTab('runner')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'runner'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Interactive App</span>
        </button>

        <button
          onClick={() => onSelectTab('design')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'design'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design Tokens</span>
        </button>

        <button
          onClick={() => onSelectTab('code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'code'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Source Code</span>
        </button>

        <button
          onClick={() => onSelectTab('compare')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'compare'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Pixel Diff</span>
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors active:scale-95"
          title="Upload stitch-export.zip or code.html"
        >
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Import ZIP</span>
        </button>

        <button
          onClick={onExportZip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors active:scale-95"
          title="Download complete project ZIP"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>
      </div>

    </header>
  );
};
