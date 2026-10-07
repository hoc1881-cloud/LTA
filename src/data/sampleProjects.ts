import { StitchProject } from '../types';
import { parseDesignMarkdown } from '../utils/zipParser';

const auraDesignMd = `# Aura Cloud Workspace Design System
Version: 2.4.0 (Exported from Google Stitch)

## Design Vision & Identity
Aura Cloud Workspace is an enterprise intelligence and compute orchestration console. The interface rejects generic AI gradients in favor of deep slate structural surfaces, precise geometric typography, and intentional emerald-blue telemetry indicators.

## Color Palette
- Canvas Base: #0b0f19 // Primary viewport background
- Surface Raised: #111827 // Elevated container panels
- Surface Overlay: #1f2937 // Secondary hover and active cards
- Border Subdued: #374151 // Micro dividers and card borders
- Border Strong: #4b5563 // High-contrast inputs
- Brand Primary: #3b82f6 // Primary action buttons and focal states
- Accent Teal: #06b6d4 // Real-time streaming metrics
- Status Active: #10b981 // Healthy cluster nodes
- Status Warning: #f59e0b // High memory threshold
- Status Critical: #ef4444 // Dropped packets / failed inferences
- Text Primary: #f9fafb // High legibility headings
- Text Secondary: #9ca3af // Descriptive captions and metadata
- Text Tertiary: #6b7280 // Quiet typographic separators

## Typography Hierarchy
- Display Scale: 32px / 700 / Tight // Main metrics and executive KPI
- Section Heading: 20px / 600 / Snappy // Card headers and module titles
- Body Regular: 14px / 400 / 1.5 // Documentation and data table cells
- Monospace Data: 13px / JetBrains Mono // Query payloads, latency tokens, IP addresses

## Spatial & Grid Rules
- 8pt modular grid alignment across all flex containers.
- Zero-pill rule: metadata displayed with quiet middle dots (·) and unboxed text.
- Touch target minimum: 44px on all interactive nodes.
- High contrast: Exceeds WCAG AA (minimum 5.2:1 on all interactive labels).

## Component Guidelines
- Interactive Filter Tabs: Segmented clean tabs with soft background state.
- Model Metric Cards: Compact telemetry with sparkline indicators and node states.
- Query Console: Interactive input area with hotkey triggers and simulated response streams.
`;

const auraHtmlCode = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Cloud Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            canvas: '#0b0f19',
            surface: '#111827',
            surfaceHover: '#1f2937',
            borderSubtle: '#374151',
            brand: '#3b82f6',
            tealAccent: '#06b6d4',
            activeGreen: '#10b981'
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b0f19; color: #f9fafb; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">

  <!-- Top Navigation -->
  <header class="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <div>
            <span class="font-semibold tracking-tight text-white">AURA CLOUD</span>
            <span class="text-xs text-gray-400 ml-2">us-central1-a</span>
          </div>
        </div>

        <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
          <button class="px-3 py-1.5 rounded-md text-white bg-gray-800/80 transition-colors">Cluster</button>
          <button class="px-3 py-1.5 rounded-md text-gray-400 hover:text-white transition-colors">Workloads</button>
          <button class="px-3 py-1.5 rounded-md text-gray-400 hover:text-white transition-colors">Pipelines</button>
          <button class="px-3 py-1.5 rounded-md text-gray-400 hover:text-white transition-colors">Telemetry</button>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <!-- Unboxed status indicator -->
        <div class="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>99.98% Healthy</span>
          <span aria-hidden="true" class="text-gray-600">·</span>
          <span>34 Node Clusters</span>
        </div>
        <button id="btnDeploy" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95">
          <span>+ Deploy Model</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

    <!-- KPI Metrics Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-all">
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>Total Inferences</span>
          <span class="text-emerald-400 font-medium">↑ 14.8%</span>
        </div>
        <div class="mt-2 text-2xl font-bold tracking-tight text-white" id="statInferences">14,892,301</div>
        <div class="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <span>Last 24h</span>
          <span>·</span>
          <span>Avg 842 req/s</span>
        </div>
      </div>

      <div class="p-5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-all">
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>Median P99 Latency</span>
          <span class="text-emerald-400 font-medium">↓ 12ms</span>
        </div>
        <div class="mt-2 text-2xl font-bold tracking-tight text-white">38.4 ms</div>
        <div class="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <span>Edge cache</span>
          <span>·</span>
          <span>Global PoP</span>
        </div>
      </div>

      <div class="p-5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-all">
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>GPU Compute Load</span>
          <span class="text-amber-400 font-medium">68%</span>
        </div>
        <div class="mt-2 text-2xl font-bold tracking-tight text-white">48 / 64 H100s</div>
        <div class="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <span>16 Warm Standby</span>
          <span>·</span>
          <span>TensorRT-LLM</span>
        </div>
      </div>

      <div class="p-5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-all">
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>Monthly Spend Run-rate</span>
          <span class="text-cyan-400 font-medium">$4,120</span>
        </div>
        <div class="mt-2 text-2xl font-bold tracking-tight text-white">$12,480.00</div>
        <div class="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <span>Tier: Enterprise v2</span>
          <span>·</span>
          <span>Auto-scale On</span>
        </div>
      </div>
    </section>

    <!-- Interactive Workload Workspace & Live Sandbox Query Runner -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column: Active Deployments List with Real Filtering -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-800">
          <div>
            <h2 class="text-lg font-semibold tracking-tight text-white">Active Model Deployments</h2>
            <div class="text-xs text-gray-400 mt-0.5">8 models serving active customer traffic</div>
          </div>
          
          <!-- Segmented Filter Control -->
          <div class="flex items-center bg-gray-950 p-1 rounded-lg border border-gray-800 text-xs">
            <button onclick="filterModels('all')" id="tab-all" class="filter-tab px-3 py-1 rounded bg-gray-800 text-white font-medium">All (8)</button>
            <button onclick="filterModels('llm')" id="tab-llm" class="filter-tab px-3 py-1 rounded text-gray-400 hover:text-white font-medium">LLM (4)</button>
            <button onclick="filterModels('vision')" id="tab-vision" class="filter-tab px-3 py-1 rounded text-gray-400 hover:text-white font-medium">Vision (2)</button>
            <button onclick="filterModels('embed')" id="tab-embed" class="filter-tab px-3 py-1 rounded text-gray-400 hover:text-white font-medium">Embedding (2)</button>
          </div>
        </div>

        <!-- Models Table / List -->
        <div class="bg-gray-900/90 rounded-xl border border-gray-800 divide-y divide-gray-800/60 overflow-hidden" id="modelList">
          
          <!-- Item 1 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-800/40 transition-colors model-item" data-type="llm">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 font-semibold text-xs">
                70B
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm text-white">llama-3.3-70b-instruct-turbo</span>
                  <span class="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>live
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>Replicas: 8/8</span>
                  <span>·</span>
                  <span>Tokens/s: 1,420</span>
                  <span>·</span>
                  <span>Cold boot: 3.2s</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono text-gray-300">24ms avg</span>
              <button onclick="triggerTest('llama-3.3-70b')" class="block mt-1 text-xs text-blue-400 hover:text-blue-300 font-medium">Test &rarr;</button>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-800/40 transition-colors model-item" data-type="llm">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-semibold text-xs">
                G8
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm text-white">gemini-2.5-flash-agent-core</span>
                  <span class="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>live
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>Replicas: 16/16</span>
                  <span>·</span>
                  <span>Tokens/s: 2,890</span>
                  <span>·</span>
                  <span>Multi-modal active</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono text-gray-300">18ms avg</span>
              <button onclick="triggerTest('gemini-2.5-flash')" class="block mt-1 text-xs text-blue-400 hover:text-blue-300 font-medium">Test &rarr;</button>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-800/40 transition-colors model-item" data-type="vision">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-semibold text-xs">
                SD
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm text-white">flux-1-schnell-spatial-v2</span>
                  <span class="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>live
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>Replicas: 4/4</span>
                  <span>·</span>
                  <span>1024x1024 in 620ms</span>
                  <span>·</span>
                  <span>Diffusers fp16</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono text-gray-300">620ms avg</span>
              <button onclick="triggerTest('flux-1-schnell')" class="block mt-1 text-xs text-blue-400 hover:text-blue-300 font-medium">Test &rarr;</button>
            </div>
          </div>

          <!-- Item 4 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-800/40 transition-colors model-item" data-type="embed">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-semibold text-xs">
                EM
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm text-white">bge-large-en-v1.5-embeddings</span>
                  <span class="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>live
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>Replicas: 6/6</span>
                  <span>·</span>
                  <span>1536 dim</span>
                  <span>·</span>
                  <span>Milvus cluster sync</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono text-gray-300">4ms avg</span>
              <button onclick="triggerTest('bge-large-en')" class="block mt-1 text-xs text-blue-400 hover:text-blue-300 font-medium">Test &rarr;</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Right Column: Interactive Live Prompt & Inference Simulator -->
      <div class="space-y-4">
        <div class="pb-2 border-b border-gray-800">
          <h2 class="text-lg font-semibold tracking-tight text-white">Live Query Console</h2>
          <div class="text-xs text-gray-400 mt-0.5">Stream direct payloads to selected cluster nodes</div>
        </div>

        <div class="p-5 rounded-xl bg-gray-900 border border-gray-800 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Target Endpoint</label>
            <select id="endpointSelect" class="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono">
              <option value="llama-3.3-70b">llama-3.3-70b-instruct-turbo (Cluster A)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash-agent-core (Cluster B)</option>
              <option value="flux-1-schnell">flux-1-schnell-spatial-v2 (Vision Cluster)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Input Prompt / Payload</label>
            <textarea id="promptInput" rows="3" class="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-mono resize-none" placeholder="Enter JSON payload or prompt string...">Summarize user telemetry logs for cluster us-central1-a and report high-frequency bottlenecks.</textarea>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Max tokens: 512</span>
            <button id="btnRunInference" onclick="runInference()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm active:scale-95 flex items-center gap-1.5">
              <span>Execute Inference</span>
              <span>&rarr;</span>
            </button>
          </div>

          <!-- Console Response Output -->
          <div class="pt-3 border-t border-gray-800">
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Execution Output</span>
              <span id="execTimer" class="font-mono text-emerald-400">Ready</span>
            </div>
            <div id="outputBox" class="p-3 bg-black/60 rounded-lg border border-gray-800/80 font-mono text-xs text-gray-300 min-h-[90px] whitespace-pre-wrap leading-relaxed">
Click "Execute Inference" to simulate a real-time cluster inference response with streamed telemetry.
            </div>
          </div>
        </div>
      </div>

    </div>

  </main>

  <!-- Interactive script -->
  <script>
    function filterModels(type) {
      const items = document.querySelectorAll('.model-item');
      const tabs = document.querySelectorAll('.filter-tab');
      
      tabs.forEach(t => {
        t.classList.remove('bg-gray-800', 'text-white');
        t.classList.add('text-gray-400');
      });

      const activeTab = document.getElementById('tab-' + type);
      if (activeTab) {
        activeTab.classList.add('bg-gray-800', 'text-white');
        activeTab.classList.remove('text-gray-400');
      }

      items.forEach(item => {
        if (type === 'all' || item.getAttribute('data-type') === type) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function triggerTest(modelName) {
      const select = document.getElementById('endpointSelect');
      select.value = modelName;
      runInference();
    }

    function runInference() {
      const btn = document.getElementById('btnRunInference');
      const timer = document.getElementById('execTimer');
      const out = document.getElementById('outputBox');
      const model = document.getElementById('endpointSelect').value;
      const prompt = document.getElementById('promptInput').value;

      btn.disabled = true;
      btn.innerText = 'Streaming...';
      timer.innerText = 'Processing...';
      out.innerText = '';

      const responses = {
        'llama-3.3-70b': "✓ [Cluster A] Ingestion verified.\\n- Throughput: 124 tokens/sec\\n- P95 Latency: 21.8ms\\n\\nReport Summary:\\nAnalyzed 42,910 events in us-central1-a. Found zero critical kernel panics. Noted 4% memory saturation on worker node-07 during 03:00 UTC database vacuum.",
        'gemini-2.5-flash': "✓ [Cluster B] Agent Core Response:\\n- Multimodal verification complete in 18ms.\\n- Context window utilization: 1,420 tokens.\\n\\nAction items:\\n1. Verified steady-state telemetry across 34 nodes.\\n2. Redis cluster cache hit ratio steady at 98.4%.",
        'flux-1-schnell': "✓ [Vision Cluster] Spatial pipeline:\\n- Latency: 590ms for 1024x1024 rendering.\\n- VRAM allocation: 11.2 GB / 24 GB.\\n- Status: Image tensor buffer ready for download."
      };

      let charIdx = 0;
      const targetText = responses[model] || "Inference completed successfully in 24ms.";

      const interval = setInterval(() => {
        out.innerText += targetText.charAt(charIdx);
        charIdx++;
        if (charIdx >= targetText.length) {
          clearInterval(interval);
          btn.disabled = false;
          btn.innerText = 'Execute Inference →';
          timer.innerText = '✓ 24ms (HTTP 200)';
        }
      }, 12);
    }
  </script>
</body>
</html>`;

const luminaDesignMd = `# Lumina Creative Atelier Design System
Version: 1.8.0 (Exported from Google Stitch)

## Design Identity & Brand Values
Lumina is an architectural and spatial design studio based in Copenhagen and Tokyo. The interface embodies quiet luxury: generous whitespace, high-contrast serif headlines, tactile warm-neutral canvas tones, and zero decorative fluff.

## Color Palette
- Canvas Bone: #fcfbf9 // Warm organic backdrop
- Canvas Elevated: #f4f1ea // Soft card containers
- Dark Pitch: #141413 // Primary typographic ink
- Slate Accent: #444340 // Secondary editorial copy
- Ochre Gold: #b8860b // Rare focal point accents
- Divider Hairline: #e8e4dc // Subtle structural boundaries

## Typography
- Editorial Title: Playfair Display / 600 / Letter-spacing: -0.02em
- Body Text: Instrument Sans / 400 / 1.6 line height
- Monospace Index: Fragment Mono / 12px uppercase

## Composition Rules
- Asymmetrical editorial grid with 3:5 proportioning.
- No pill-shaped containers; clean text dividers.
- High-contrast visual presence with subtle tactile hover interactions.
`;

const luminaHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumina Creative Atelier</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Mono&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fcfbf9; color: #141413; }
    h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
    .font-mono { font-family: 'Space Mono', monospace; }
  </style>
</head>
<body class="min-h-screen bg-[#fcfbf9] text-[#141413] antialiased">

  <!-- Atelier Header -->
  <header class="border-b border-[#e8e4dc] px-6 sm:px-12 py-6 flex items-center justify-between sticky top-0 bg-[#fcfbf9]/90 backdrop-blur z-30">
    <div class="flex items-center gap-6">
      <span class="font-serif text-2xl font-bold tracking-tight">LUMINA</span>
      <span class="text-xs font-mono uppercase text-[#444340] hidden sm:inline">Copenhagen · Tokyo</span>
    </div>
    <nav class="flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
      <button onclick="filterCategory('all')" class="tab-btn font-bold text-[#141413]">All Works</button>
      <button onclick="filterCategory('architecture')" class="tab-btn text-[#77746d] hover:text-[#141413]">Spatial</button>
      <button onclick="filterCategory('digital')" class="tab-btn text-[#77746d] hover:text-[#141413]">Objects</button>
      <button onclick="toggleInquiry()" class="px-3 py-1.5 border border-[#141413] hover:bg-[#141413] hover:text-white transition-colors">Contact</button>
    </nav>
  </header>

  <!-- Hero Statement -->
  <section class="max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-12">
    <div class="max-w-3xl">
      <div class="text-xs font-mono uppercase tracking-widest text-[#77746d] mb-4">Selected Works 2024—2026</div>
      <h1 class="text-4xl sm:text-6xl font-serif font-normal leading-[1.15] tracking-tight">
        Architecture, physical objects & tactile spaces designed for permanence.
      </h1>
      <p class="mt-6 text-[#444340] text-base sm:text-lg leading-relaxed max-w-2xl">
        We bridge Scandinavian structural minimalism with Japanese artisanal materiality. Every commission begins with light studies and bespoke material formulations.
      </p>
    </div>
  </section>

  <!-- Portfolio Works Grid -->
  <section class="max-w-6xl mx-auto px-6 sm:px-12 pb-24">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12" id="worksGrid">
      
      <!-- Work 1 -->
      <article class="work-item group cursor-pointer" data-category="architecture" onclick="openStudy('Aura Pavilion', 'Copenhagen, Denmark', 'Timber acoustic study & subterranean natural light canopy.')">
        <div class="aspect-[4/3] bg-[#f4f1ea] border border-[#e8e4dc] overflow-hidden relative flex items-center justify-center group-hover:border-[#141413] transition-all">
          <div class="w-full h-full bg-gradient-to-tr from-[#ebe6dc] to-[#f4f1ea] flex flex-col justify-end p-8">
            <span class="text-xs font-mono text-[#77746d]">Commission 01</span>
            <span class="font-serif text-2xl mt-1">Aura Pavilion</span>
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between text-xs">
          <div>
            <span class="font-serif text-lg font-medium">Aura Pavilion</span>
            <div class="text-[#77746d] mt-0.5">Spatial Architecture · 2025</div>
          </div>
          <span class="font-mono text-[#77746d]">Explore &rarr;</span>
        </div>
      </article>

      <!-- Work 2 -->
      <article class="work-item group cursor-pointer" data-category="digital" onclick="openStudy('Kuro Cast Iron Lamp', 'Kyoto, Japan', 'Sand-cast raw iron fixture with integrated tactile dimmer.')">
        <div class="aspect-[4/3] bg-[#f4f1ea] border border-[#e8e4dc] overflow-hidden relative flex items-center justify-center group-hover:border-[#141413] transition-all">
          <div class="w-full h-full bg-gradient-to-tr from-[#e3ded4] to-[#f4f1ea] flex flex-col justify-end p-8">
            <span class="text-xs font-mono text-[#77746d]">Commission 02</span>
            <span class="font-serif text-2xl mt-1">Kuro Lamp</span>
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between text-xs">
          <div>
            <span class="font-serif text-lg font-medium">Kuro Cast Iron Lamp</span>
            <div class="text-[#77746d] mt-0.5">Industrial Object · 2025</div>
          </div>
          <span class="font-mono text-[#77746d]">Explore &rarr;</span>
        </div>
      </article>

      <!-- Work 3 -->
      <article class="work-item group cursor-pointer" data-category="architecture" onclick="openStudy('Nordic Silence House', 'Oslo Fjord, Norway', 'Private cliffside residence constructed with thermal mass stone.')">
        <div class="aspect-[4/3] bg-[#f4f1ea] border border-[#e8e4dc] overflow-hidden relative flex items-center justify-center group-hover:border-[#141413] transition-all">
          <div class="w-full h-full bg-gradient-to-tr from-[#ece6dc] to-[#f7f5ef] flex flex-col justify-end p-8">
            <span class="text-xs font-mono text-[#77746d]">Commission 03</span>
            <span class="font-serif text-2xl mt-1">Nordic Silence House</span>
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between text-xs">
          <div>
            <span class="font-serif text-lg font-medium">Nordic Silence House</span>
            <div class="text-[#77746d] mt-0.5">Residential · 2024</div>
          </div>
          <span class="font-mono text-[#77746d]">Explore &rarr;</span>
        </div>
      </article>

      <!-- Work 4 -->
      <article class="work-item group cursor-pointer" data-category="digital" onclick="openStudy('Takt Dining System', 'Stockholm, Sweden', 'Interlocking solid oak table and bench collection.')">
        <div class="aspect-[4/3] bg-[#f4f1ea] border border-[#e8e4dc] overflow-hidden relative flex items-center justify-center group-hover:border-[#141413] transition-all">
          <div class="w-full h-full bg-gradient-to-tr from-[#dfd9ce] to-[#f4f1ea] flex flex-col justify-end p-8">
            <span class="text-xs font-mono text-[#77746d]">Commission 04</span>
            <span class="font-serif text-2xl mt-1">Takt Dining Table</span>
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between text-xs">
          <div>
            <span class="font-serif text-lg font-medium">Takt Dining System</span>
            <div class="text-[#77746d] mt-0.5">Furniture Collection · 2024</div>
          </div>
          <span class="font-mono text-[#77746d]">Explore &rarr;</span>
        </div>
      </article>

    </div>
  </section>

  <!-- Interactive Modal Drawer -->
  <div id="studyModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#fcfbf9] border border-[#141413] max-w-lg w-full p-8 space-y-6 shadow-2xl">
      <div class="flex justify-between items-start">
        <div>
          <span id="studyLocation" class="text-xs font-mono uppercase text-[#77746d]">Location</span>
          <h3 id="studyTitle" class="font-serif text-3xl font-medium mt-1">Project Name</h3>
        </div>
        <button onclick="closeStudy()" class="text-xl font-mono hover:opacity-60">&times;</button>
      </div>
      <p id="studyDesc" class="text-sm text-[#444340] leading-relaxed">Project description</p>
      <div class="pt-4 border-t border-[#e8e4dc] flex items-center justify-between text-xs font-mono">
        <span class="text-[#77746d]">Commission Status: Completed</span>
        <button onclick="closeStudy()" class="px-4 py-2 bg-[#141413] text-white">Close Details</button>
      </div>
    </div>
  </div>

  <script>
    function filterCategory(cat) {
      const items = document.querySelectorAll('.work-item');
      items.forEach(el => {
        if (cat === 'all' || el.getAttribute('data-category') === cat) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });
    }

    function openStudy(title, loc, desc) {
      document.getElementById('studyTitle').innerText = title;
      document.getElementById('studyLocation').innerText = loc;
      document.getElementById('studyDesc').innerText = desc;
      document.getElementById('studyModal').classList.remove('hidden');
    }

    function closeStudy() {
      document.getElementById('studyModal').classList.add('hidden');
    }

    function toggleInquiry() {
      alert("Lumina Inquiry Desk: commissions currently booking for Q4 2026. Reach us at studio@lumina.dk");
    }
  </script>
</body>
</html>`;

const pulseDesignMd = `# Pulse & Orbit Health System
Version: 3.1.0 (Exported from Google Stitch)

## Design Identity
Pulse & Orbit is a personal biometric dashboard engineered for athletes and longevity tracking. It uses high-contrast dark slate cards, physiological color signals (Emerald for recovery, Ruby for strain, Cyan for hydration), and high-frequency tactile micro-interactions.

## Color Tokens
- Dark Canvas: #090d16
- Card Base: #131b2e
- Metric Emerald: #10b981 // High HRV & Optimal Recovery
- Strain Crimson: #f43f5e // High Cardio Output
- Hydration Cyan: #06b6d4 // Water volume & electrolyte balance
- Sleep Indigo: #6366f1 // REM & Deep Sleep architecture

## Spatial Architecture
- 16px fluid padding
- Interactive ring graphs with SVG stroke offsets
- Real-time hydration counter with persistent state
`;

const pulseHtmlCode = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse & Orbit Biometrics</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background-color: #090d16; color: #f8fafc; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased">

  <header class="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between bg-[#0b111e]/90 sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xs">
        P
      </div>
      <div>
        <span class="font-bold tracking-tight text-white">PULSE & ORBIT</span>
        <span class="text-xs text-slate-400 ml-2 font-mono">Today, Oct 7</span>
      </div>
    </div>
    <div class="flex items-center gap-3 text-xs">
      <span class="text-slate-400">Recovery Score:</span>
      <span class="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">94% Optimal</span>
    </div>
  </header>

  <main class="max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-6">

    <!-- Primary Metric Rings & Today's Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Caloric Burn -->
      <div class="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
        <div class="flex justify-between items-center text-xs text-slate-400">
          <span>Active Caloric Strain</span>
          <span class="text-rose-400 font-mono">82%</span>
        </div>
        <div class="text-3xl font-bold font-mono text-white" id="calorieText">820 / 1,000 kcal</div>
        <div class="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
          <div id="calorieBar" class="bg-rose-500 h-2.5 rounded-full transition-all duration-500" style="width: 82%"></div>
        </div>
        <div class="flex justify-between text-xs text-slate-500">
          <span>Resting: 1,840 kcal</span>
          <button onclick="logWorkout()" class="text-rose-400 hover:text-rose-300 font-medium">+ Quick Workout</button>
        </div>
      </div>

      <!-- Sleep Score -->
      <div class="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
        <div class="flex justify-between items-center text-xs text-slate-400">
          <span>Sleep Architecture</span>
          <span class="text-indigo-400 font-mono">8h 14m</span>
        </div>
        <div class="text-3xl font-bold font-mono text-white">92 Sleep Score</div>
        <div class="flex gap-1 h-2.5 rounded-full overflow-hidden bg-slate-900">
          <div class="bg-indigo-600 h-full" style="width: 25%" title="Deep Sleep"></div>
          <div class="bg-cyan-500 h-full" style="width: 30%" title="REM Sleep"></div>
          <div class="bg-slate-700 h-full" style="width: 45%" title="Light Sleep"></div>
        </div>
        <div class="flex justify-between text-xs text-slate-500">
          <span>REM: 2h 28m</span>
          <span>Deep: 2h 04m</span>
        </div>
      </div>

      <!-- Hydration Tracker (Interactive) -->
      <div class="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
        <div class="flex justify-between items-center text-xs text-slate-400">
          <span>Hydration Level</span>
          <span id="hydroPercent" class="text-cyan-400 font-mono">75%</span>
        </div>
        <div class="text-3xl font-bold font-mono text-white" id="hydroText">2,250 / 3,000 ml</div>
        <div class="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
          <div id="hydroBar" class="bg-cyan-400 h-2.5 rounded-full transition-all duration-300" style="width: 75%"></div>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-slate-500">Target: 3.0 Liters</span>
          <button onclick="addWater(250)" class="text-cyan-400 hover:text-cyan-300 font-semibold">+ 250ml Water</button>
        </div>
      </div>

    </div>

    <!-- Heart Rate & Vitals Real-Time Tracker -->
    <div class="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-white">Resting Heart Rate & HRV Waveform</h2>
          <div class="text-xs text-slate-400">24-hour continuous photoplethysmography sensor sync</div>
        </div>
        <div class="flex items-center gap-3 font-mono text-xs">
          <span class="text-slate-400">Current:</span>
          <span class="text-emerald-400 font-bold text-lg" id="liveBpm">58 BPM</span>
        </div>
      </div>

      <div class="h-32 w-full bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 flex items-end justify-between gap-1">
        <div class="w-full h-[40%] bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition-all"></div>
        <div class="w-full h-[45%] bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition-all"></div>
        <div class="w-full h-[52%] bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition-all"></div>
        <div class="w-full h-[68%] bg-emerald-500/30 hover:bg-emerald-500/50 rounded-t transition-all"></div>
        <div class="w-full h-[85%] bg-rose-500/40 hover:bg-rose-500/60 rounded-t transition-all" title="Zone 4 Run"></div>
        <div class="w-full h-[70%] bg-rose-500/30 hover:bg-rose-500/50 rounded-t transition-all"></div>
        <div class="w-full h-[55%] bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition-all"></div>
        <div class="w-full h-[48%] bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition-all"></div>
        <div class="w-full h-[42%] bg-emerald-500/30 hover:bg-emerald-500/50 rounded-t transition-all"></div>
        <div class="w-full h-[38%] bg-emerald-500/40 hover:bg-emerald-500/60 rounded-t transition-all"></div>
      </div>
    </div>

  </main>

  <script>
    let waterMl = 2250;
    let calories = 820;

    function addWater(amount) {
      waterMl = Math.min(3500, waterMl + amount);
      const pct = Math.min(100, Math.round((waterMl / 3000) * 100));
      document.getElementById('hydroText').innerText = waterMl + ' / 3,000 ml';
      document.getElementById('hydroBar').style.width = pct + '%';
      document.getElementById('hydroPercent').innerText = pct + '%';
    }

    function logWorkout() {
      calories = Math.min(1500, calories + 180);
      const pct = Math.min(100, Math.round((calories / 1000) * 100));
      document.getElementById('calorieText').innerText = calories + ' / 1,000 kcal';
      document.getElementById('calorieBar').style.width = pct + '%';
    }

    setInterval(() => {
      const bpm = 56 + Math.floor(Math.random() * 6);
      document.getElementById('liveBpm').innerText = bpm + ' BPM';
    }, 2500);
  </script>
</body>
</html>`;

export const sampleProjects: StitchProject[] = [
  {
    id: 'aura-cloud',
    name: 'Aura Cloud Workspace',
    slug: 'aura-cloud',
    description: 'Enterprise AI cluster management, telemetry dashboards, and live model query simulator.',
    category: 'Cloud SaaS / Developer Tool',
    date: 'March 2026',
    htmlCode: auraHtmlCode,
    designMd: auraDesignMd,
    tokens: parseDesignMarkdown(auraDesignMd),
  },
  {
    id: 'lumina-atelier',
    name: 'Lumina Creative Atelier',
    slug: 'lumina-atelier',
    description: 'Editorial Scandinavian and Japanese spatial architectural portfolio with case study drawer.',
    category: 'Portfolio & Architecture',
    date: 'February 2026',
    htmlCode: luminaHtmlCode,
    designMd: luminaDesignMd,
    tokens: parseDesignMarkdown(luminaDesignMd),
  },
  {
    id: 'pulse-orbit',
    name: 'Pulse & Orbit Biometrics',
    slug: 'pulse-orbit',
    description: 'Athlete performance tracker with interactive hydration logger, sleep score, and vitals waveform.',
    category: 'Health & Longevity',
    date: 'January 2026',
    htmlCode: pulseHtmlCode,
    designMd: pulseDesignMd,
    tokens: parseDesignMarkdown(pulseDesignMd),
  },
];
