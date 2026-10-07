import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Palette, 
  Type, 
  Ruler, 
  Sparkles, 
  FileText, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { StitchProject } from '../types';

interface DesignTokensViewProps {
  project: StitchProject;
}

export const DesignTokensView: React.FC<DesignTokensViewProps> = ({ project }) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'tokens' | 'typography' | 'rules' | 'markdown'>('tokens');
  const [testSampleText, setTestSampleText] = useState('The quick brown fox jumps over the lazy dog');

  const { tokens } = project;

  const handleCopy = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>DESIGN.md MANIFEST · GOOGLE STITCH</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {tokens.title || project.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                {tokens.summary || 'Design tokens, color swatches, font scales, and architectural principles exported from Stitch.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                v{tokens.version}
              </span>
              <button
                onClick={() => handleCopy(project.designMd, 'full-md')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors"
              >
                {copiedToken === 'full-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken === 'full-md' ? 'Copied' : 'Copy DESIGN.md'}</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('tokens')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'tokens' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span>Color Palette ({tokens.colors.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('typography')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'typography' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <span>Typography Scales</span>
            </button>

            <button
              onClick={() => setActiveSubTab('rules')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'rules' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Principles & Guidelines</span>
            </button>

            <button
              onClick={() => setActiveSubTab('markdown')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'markdown' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Raw Markdown</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Color Palette */}
        {activeSubTab === 'tokens' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Color System Tokens</h2>
                <p className="text-xs text-slate-400">Click any token to copy its hex code to clipboard.</p>
              </div>
              <span className="text-xs font-mono text-slate-500">{tokens.colors.length} tokens defined</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tokens.colors.map((c, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(c.value, c.name)}
                  className="group p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3"
                >
                  {/* Swatch */}
                  <div
                    className="h-24 w-full rounded-lg border border-white/10 relative overflow-hidden flex items-end p-2.5 shadow-inner transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: c.value }}
                  >
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur">
                      {c.value}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {c.name}
                      </div>
                      {c.usage && (
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{c.usage}</div>
                      )}
                    </div>
                    <button
                      className="p-1 text-slate-500 hover:text-white transition-colors"
                      title="Copy hex code"
                    >
                      {copiedToken === c.name ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 2: Typography Scales */}
        {activeSubTab === 'typography' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Typography Scale & Hierarchy</h2>
                <p className="text-xs text-slate-400">Preview scale tokens with customizable test string.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testSampleText}
                  onChange={(e) => setTestSampleText(e.target.value)}
                  placeholder="Type sample text..."
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {tokens.typography.length > 0 ? (
                tokens.typography.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                      <span className="font-mono font-medium text-blue-400">{t.name}</span>
                      <span className="font-mono">{t.size} · weight {t.weight}</span>
                    </div>
                    <div className="text-white pt-1 overflow-x-auto" style={{ fontSize: t.size.includes('px') ? t.size : '18px' }}>
                      {testSampleText}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                      <span className="font-mono font-medium text-blue-400">Display Hero (36px / 700)</span>
                      <span className="font-mono">Leading: 1.15</span>
                    </div>
                    <div className="text-white text-3xl font-bold tracking-tight pt-1">
                      {testSampleText}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                      <span className="font-mono font-medium text-blue-400">Section Header (24px / 600)</span>
                      <span className="font-mono">Leading: 1.25</span>
                    </div>
                    <div className="text-white text-xl font-semibold pt-1">
                      {testSampleText}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                      <span className="font-mono font-medium text-blue-400">Body Copy (15px / 400)</span>
                      <span className="font-mono">Leading: 1.6</span>
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed pt-1">
                      {testSampleText}. The modern design system ensures legible typography across mobile, tablet, and desktop viewports without clipping.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tab 3: Principles & Guidelines */}
        {activeSubTab === 'rules' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Principles Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Stitch Architecture Principles</h3>
              </div>
              <ul className="space-y-3">
                {tokens.principles.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spatial Grid Rules */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-white">Spatial Grid Tokens</h3>
              </div>
              <div className="space-y-2.5">
                {tokens.spacing.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                    <span className="font-mono text-slate-300">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-2 bg-blue-500 rounded" 
                        style={{ width: `${parseInt(s.value) * 2}px`, maxWidth: '100px' }} 
                      />
                      <span className="font-mono text-slate-400 w-12 text-right">{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* Tab 4: Raw Markdown Editor/Viewer */}
        {activeSubTab === 'markdown' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">DESIGN.md Document Content</h2>
              <button
                onClick={() => handleCopy(project.designMd, 'raw-md-btn')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
              >
                {copiedToken === 'raw-md-btn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken === 'raw-md-btn' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>

            <pre className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[600px]">
              {project.designMd}
            </pre>
          </section>
        )}

      </div>
    </div>
  );
};
