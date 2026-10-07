import React from 'react';
import { AlertCircle, Upload, X, Sparkles, FileCode, CheckCircle2 } from 'lucide-react';

interface NoticeBannerProps {
  onOpenUpload: () => void;
  hasCustomUpload: boolean;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ onOpenUpload, hasCustomUpload }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-b border-blue-900/40 px-4 py-3 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-blue-500/20 text-blue-400 mt-0.5 md:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5">
            <div className="font-medium text-slate-100 flex items-center gap-2">
              <span>Google Stitch Project Engine Active</span>
              <span className="text-[10px] text-blue-300 bg-blue-950 border border-blue-800/80 px-1.5 py-0.2 rounded font-mono">
                Auto-Detected
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-3xl">
              {hasCustomUpload ? (
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                  Your custom Stitch package has been loaded! You can preview, edit tokens, inspect code, and test interactions.
                </span>
              ) : (
                <>
                  Your request included a Stitch design package (<code className="text-blue-300 font-mono">code.html</code>, <code className="text-blue-300 font-mono">DESIGN.md</code>, <code className="text-blue-300 font-mono">screen.png</code>). Chat inputs decode binary archives as text. Drag & drop your actual exported <span className="text-slate-200 font-mono">.zip</span> or <span className="text-slate-200 font-mono">code.html</span> to run your exact files, or explore the preloaded interactive Stitch apps below!
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {!hasCustomUpload && (
            <button
              onClick={onOpenUpload}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Upload className="w-3 h-3" />
              <span>Drop Your ZIP / HTML</span>
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
