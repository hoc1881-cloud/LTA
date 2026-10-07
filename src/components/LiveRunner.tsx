import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, 
  ExternalLink, 
  Monitor, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Moon, 
  Sun,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ViewportMode, StitchProject } from '../types';

interface LiveRunnerProps {
  project: StitchProject;
}

export const LiveRunner: React.FC<LiveRunnerProps> = ({ project }) => {
  const [viewport, setViewport] = useState<ViewportMode>('responsive');
  const [zoom, setZoom] = useState<number>(100);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getViewportWidth = (): string => {
    switch (viewport) {
      case 'desktop': return '1440px';
      case 'laptop': return '1024px';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      case 'responsive': return '100%';
    }
  };

  const getViewportLabel = (): string => {
    switch (viewport) {
      case 'desktop': return '1440 × 900';
      case 'laptop': return '1024 × 768';
      case 'tablet': return '768 × 1024';
      case 'mobile': return '375 × 812';
      case 'responsive': return 'Fluid (100%)';
    }
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([project.htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Toggle dark mode in iframe if possible
  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const htmlEl = iframeRef.current.contentDocument.documentElement;
      if (nextDark) {
        htmlEl.classList.add('dark');
      } else {
        htmlEl.classList.remove('dark');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-slate-950 overflow-hidden">
      
      {/* Top Workspace Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between gap-4 text-xs">
        
        {/* Left: Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewport('responsive')}
            title="Fluid Viewport (100%)"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === 'responsive' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Fluid</span>
          </button>

          <button
            onClick={() => setViewport('desktop')}
            title="Desktop 1440px"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewport('laptop')}
            title="Laptop 1024px"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === 'laptop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Laptop</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            title="Tablet 768px"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewport('mobile')}
            title="Mobile 375px"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Center: Active Viewport Dimensions and Status */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
            {getViewportLabel()}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Interactive Sandbox</span>
          </span>
        </div>

        {/* Right: Zoom, Theme, Reload, Open External */}
        <div className="flex items-center gap-2">
          
          {/* Zoom Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 15))}
              className="hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(125, zoom + 15))}
              className="hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleToggleTheme}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
          </button>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reload sandbox"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors font-medium text-xs"
            title="Open runner in full browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">New Tab</span>
          </button>

        </div>

      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-auto flex items-start justify-center">
        <div 
          className="transition-all duration-300 ease-out flex flex-col items-center"
          style={{
            width: getViewportWidth(),
            maxWidth: '100%',
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {/* Mockup Frame Header (for non-fluid viewports) */}
          {viewport !== 'responsive' && (
            <div className="w-full bg-slate-900 border border-b-0 border-slate-800 rounded-t-xl px-4 py-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-300 truncate max-w-[200px]">
                  {project.name.toLowerCase().replace(/\s+/g, '-')}.stitch.local
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 uppercase">{viewport} mode</span>
            </div>
          )}

          {/* Sandboxed iframe */}
          <div className={`w-full bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden ${
            viewport === 'responsive' ? 'rounded-xl h-[calc(100vh-13.5rem)]' : 'rounded-b-xl h-[820px]'
          }`}>
            <iframe
              key={iframeKey}
              ref={iframeRef}
              srcDoc={project.htmlCode}
              title={`Preview of ${project.name}`}
              className="w-full h-full border-0 bg-transparent"
              sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
            />
          </div>

        </div>
      </div>

    </div>
  );
};
