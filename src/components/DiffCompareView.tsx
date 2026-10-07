import React, { useState } from 'react';
import { 
  Columns, 
  Layers, 
  Image as ImageIcon, 
  Play, 
  Sparkles,
  Info
} from 'lucide-react';
import { StitchProject } from '../types';

interface DiffCompareViewProps {
  project: StitchProject;
}

export const DiffCompareView: React.FC<DiffCompareViewProps> = ({ project }) => {
  const [mode, setMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-slate-950 overflow-hidden">
      
      {/* Control Header */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">Fidelity Comparison: screen.png vs code.html</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Validate live code against design reference</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === 'side-by-side' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setMode('overlay')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === 'overlay' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overlay Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
        
        {mode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-w-7xl">
            
            {/* Left: Design Reference Image / Render */}
            <div className="flex flex-col rounded-xl bg-slate-900 border border-slate-800 overflow-hidden h-full">
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Reference (screen.png)</span>
                </span>
                <span>Static Spec</span>
              </div>
              <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-auto p-4">
                {project.screenImage ? (
                  <img
                    src={project.screenImage}
                    alt="Design Spec"
                    className="max-h-full max-w-full object-contain rounded border border-slate-800"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900/60 rounded border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Stitch Reference Screen</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        When uploading your ZIP, include <code className="text-blue-400 font-mono">screen.png</code> to compare pixel-perfection side-by-side.
                      </p>
                    </div>
                    <div className="w-full max-w-sm bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs font-mono">
                      <div className="text-slate-400">Target Spec:</div>
                      <div className="text-white font-medium">{project.name}</div>
                      <div className="text-slate-500 text-[11px]">{project.category} · {project.date}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Running Application */}
            <div className="flex flex-col rounded-xl bg-slate-900 border border-slate-800 overflow-hidden h-full">
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Play className="w-3.5 h-3.5" />
                  <span>Live App (code.html)</span>
                </span>
                <span>Active DOM & JS</span>
              </div>
              <div className="flex-1 bg-slate-950 overflow-hidden">
                <iframe
                  srcDoc={project.htmlCode}
                  title="Live preview comparison"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-forms allow-same-origin"
                />
              </div>
            </div>

          </div>
        ) : (
          /* Overlay Slider Mode */
          <div className="w-full max-w-5xl h-full flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs px-2 text-slate-400">
              <span>Drag slider to inspect pixel alignment:</span>
              <span className="font-mono text-blue-400 font-semibold">{sliderPosition}% Live Code</span>
            </div>

            <div className="relative flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Bottom Layer: Reference or Frame */}
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center p-4">
                {project.screenImage ? (
                  <img
                    src={project.screenImage}
                    alt="Design Spec"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                    Reference Layer (Upload screen.png for pixel overlay)
                  </div>
                )}
              </div>

              {/* Top Layer: Live HTML with Clip Path */}
              <div 
                className="absolute inset-0 bg-slate-950 border-r-2 border-blue-500 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <iframe
                  srcDoc={project.htmlCode}
                  title="Live overlay comparison"
                  className="w-full h-full border-0 pointer-events-none"
                  style={{ width: '100vw', maxWidth: '1024px' }}
                />
              </div>

              {/* Interactive Range Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-x-0 bottom-4 mx-auto w-3/4 z-30 cursor-ew-resize accent-blue-500 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
