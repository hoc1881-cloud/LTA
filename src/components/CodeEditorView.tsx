import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Play, 
  FileCode, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { StitchProject } from '../types';

interface CodeEditorViewProps {
  project: StitchProject;
  onUpdateCode: (newHtml: string) => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  project,
  onUpdateCode,
}) => {
  const [code, setCode] = useState(project.htmlCode);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setCode(project.htmlCode);
  }, [project.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    onUpdateCode(code);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleReset = () => {
    setCode(project.htmlCode);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-slate-950 overflow-hidden">
      
      {/* Editor Control Bar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span>code.html</span>
          </div>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono text-[11px]">{lineCount} lines</span>
          {code !== project.htmlCode && (
            <span className="text-[10px] text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded font-mono">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {code !== project.htmlCode && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
              title="Revert to original project code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download</span>
          </button>

          <button
            onClick={handleApply}
            disabled={code === project.htmlCode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
              code === project.htmlCode
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {applied ? <Check className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white fill-white" />}
            <span>{applied ? 'Applied!' : 'Apply to Runner'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden bg-[#0d1117] font-mono text-xs">
        {/* Line Numbers */}
        <div className="w-12 py-4 select-none bg-[#090d16] border-r border-slate-800 text-slate-600 text-right pr-3 font-mono text-[11px] overflow-hidden">
          {Array.from({ length: Math.min(lineCount, 1500) }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-slate-200 resize-none outline-none leading-6 font-mono overflow-auto whitespace-pre selection:bg-blue-600 selection:text-white"
        />
      </div>

    </div>
  );
};
