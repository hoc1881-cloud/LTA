import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileArchive, 
  FileCode, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { processZipFile, parseDesignMarkdown } from '../utils/zipParser';
import { StitchProject } from '../types';

interface DropZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectLoaded: (project: StitchProject) => void;
}

export const DropZoneModal: React.FC<DropZoneModalProps> = ({
  isOpen,
  onClose,
  onProjectLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paste form state
  const [projectName, setProjectName] = useState('My Custom Stitch Project');
  const [pastedHtml, setPastedHtml] = useState('');
  const [pastedDesignMd, setPastedDesignMd] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      if (file.name.endsWith('.zip')) {
        const parsed = await processZipFile(file);
        const newProject: StitchProject = {
          id: `custom-${Date.now()}`,
          name: parsed.name || file.name.replace('.zip', ''),
          slug: file.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: 'Imported from Google Stitch ZIP export archive.',
          category: 'Custom Project',
          date: 'Just now',
          htmlCode: parsed.htmlCode || '<div>No HTML in zip</div>',
          designMd: parsed.designMd || '# Design System',
          screenImage: parsed.screenImage,
          tokens: parsed.tokens || parseDesignMarkdown(parsed.designMd || ''),
          isUserUploaded: true,
        };
        onProjectLoaded(newProject);
        onClose();
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const text = await file.text();
        const newProject: StitchProject = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          slug: file.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: 'Imported HTML document.',
          category: 'Custom Web App',
          date: 'Just now',
          htmlCode: text,
          designMd: '# Custom HTML\n\nDirectly uploaded HTML template.',
          tokens: parseDesignMarkdown(''),
          isUserUploaded: true,
        };
        onProjectLoaded(newProject);
        onClose();
      } else {
        throw new Error('Please upload a .zip archive (containing code.html, DESIGN.md) or a .html file.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to parse project file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedHtml.trim()) {
      setError('Please paste HTML code.');
      return;
    }

    const designMd = pastedDesignMd.trim() || `# ${projectName} Design System\n\nCustom design system tokens.`;
    const tokens = parseDesignMarkdown(designMd);

    const newProject: StitchProject = {
      id: `pasted-${Date.now()}`,
      name: projectName.trim() || 'Custom Stitch App',
      slug: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: 'Pasted HTML & Design tokens.',
      category: 'User Created',
      date: 'Just now',
      htmlCode: pastedHtml,
      designMd,
      tokens,
      isUserUploaded: true,
    };

    onProjectLoaded(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Import Google Stitch Project</h3>
              <p className="text-xs text-slate-400">Load your exported ZIP bundle or paste code directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Upload .ZIP / .HTML File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Paste Code Directly
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'upload' ? (
            <div className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".zip,.html,.htm"
                  className="hidden"
                />

                {isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="text-xs">Extracting files with JSZip...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <FileArchive className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        Click to select or drag & drop Stitch archive
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Accepts <code className="text-blue-400 font-mono">stitch-export.zip</code> or standalone <code className="text-blue-400 font-mono">code.html</code>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Supported Files Checklist */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-medium text-slate-300 text-[11px] uppercase font-mono tracking-wider">
                  Automatic Extraction Specs
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">code.html</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">DESIGN.md</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">screen.png</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Paste Code Form */
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="My Custom App"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Paste HTML Content (code.html)
                </label>
                <textarea
                  rows={5}
                  value={pastedHtml}
                  onChange={(e) => setPastedHtml(e.target.value)}
                  placeholder="<!DOCTYPE html><html><head>...</head><body>...</body></html>"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Paste Design Tokens (Optional DESIGN.md)
                </label>
                <textarea
                  rows={3}
                  value={pastedDesignMd}
                  onChange={(e) => setPastedDesignMd(e.target.value)}
                  placeholder="# Design System&#10;&#10;## Color Palette&#10;- Primary: #3b82f6&#10;- Background: #0f172a"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  Launch Custom App
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
