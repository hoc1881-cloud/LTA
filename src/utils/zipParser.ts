import JSZip from 'jszip';
import { ParsedDesignSystem, StitchProject } from '../types';

export function parseDesignMarkdown(md: string): ParsedDesignSystem {
  const result: ParsedDesignSystem = {
    title: 'Stitch Design System',
    version: '1.0.0',
    summary: 'Design tokens and guidelines exported from Google Stitch.',
    colors: [],
    typography: [],
    spacing: [
      { name: 'space-xs', value: '4px' },
      { name: 'space-sm', value: '8px' },
      { name: 'space-md', value: '16px' },
      { name: 'space-lg', value: '24px' },
      { name: 'space-xl', value: '32px' },
      { name: 'space-2xl', value: '48px' },
    ],
    principles: [],
    components: [],
    rawMarkdown: md,
  };

  if (!md) return result;

  const lines = md.split('\n');
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      result.title = line.replace('# ', '').trim();
      continue;
    }

    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').toLowerCase();
      continue;
    }

    // Extract colors
    if (currentSection.includes('color') || currentSection.includes('palette')) {
      // Matches: - Primary / #0ea5e9 or Primary: #0ea5e9 or | Name | #hex |
      const hexMatch = line.match(/(?:[-*]\s*)?([A-Za-z0-9\s-_]+)[:|\-–]\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
      if (hexMatch) {
        result.colors.push({
          name: hexMatch[1].trim(),
          value: hexMatch[2].trim(),
          usage: line.includes('//') ? line.split('//')[1].trim() : undefined,
        });
      } else {
        const standaloneHex = line.match(/(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/);
        if (standaloneHex) {
          const name = line.replace(standaloneHex[0], '').replace(/[-*:|]/g, '').trim();
          result.colors.push({
            name: name || 'Color',
            value: standaloneHex[0],
          });
        }
      }
    }

    // Extract typography
    if (currentSection.includes('typograph') || currentSection.includes('font')) {
      if (line.startsWith('-') || line.startsWith('*')) {
        const parts = line.replace(/^[-*]\s*/, '').split(':');
        if (parts.length >= 2) {
          result.typography.push({
            name: parts[0].trim(),
            fontFamily: 'Inter, system-ui, sans-serif',
            size: parts[1].trim(),
            weight: parts[1].includes('bold') || parts[1].includes('700') ? '700' : '500',
            lineHeight: '1.4',
            sampleText: parts[0].trim() + ' — The quick brown fox jumps over the lazy dog',
          });
        }
      }
    }

    // Extract principles / rules
    if (currentSection.includes('principle') || currentSection.includes('rule') || currentSection.includes('guideline')) {
      if (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
        const cleanRule = line.replace(/^[-*\d.]\s*/, '').trim();
        if (cleanRule.length > 5) {
          result.principles.push(cleanRule);
        }
      }
    }

    // Extract components
    if (currentSection.includes('component')) {
      if (line.startsWith('-') || line.startsWith('*') || line.startsWith('### ')) {
        const cleanComp = line.replace(/^[-*#\d.]\s*/, '').trim();
        const [compName, ...rest] = cleanComp.split(':');
        result.components.push({
          name: compName.trim(),
          description: rest.join(':').trim() || 'Reusable interface element',
        });
      }
    }
  }

  // Fallbacks if section parsing yielded empty arrays
  if (result.colors.length === 0) {
    // Scan entire doc for hex codes
    const hexCodes = md.match(/#[0-9a-fA-F]{6}/g) || [];
    const unique = Array.from(new Set(hexCodes));
    result.colors = unique.slice(0, 8).map((hex, idx) => ({
      name: `Token ${idx + 1}`,
      value: hex,
    }));
  }

  if (result.principles.length === 0) {
    result.principles = [
      'Zero-pill discipline: quiet inline metadata separators (·)',
      'Clear typographic hierarchy with intentional font scales',
      'Consistent 8pt spatial grid alignment',
      'Accessible contrast standards exceeding WCAG AA',
    ];
  }

  return result;
}

export async function processZipFile(file: File): Promise<Partial<StitchProject>> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  let htmlCode = '';
  let designMd = '';
  let screenImage: string | undefined = undefined;

  // Search files in zip
  for (const [filename, zipEntry] of Object.entries(loadedZip.files)) {
    if (zipEntry.dir) continue;
    const lowerName = filename.toLowerCase();

    if (lowerName.endsWith('code.html') || (lowerName.endsWith('.html') && !htmlCode)) {
      htmlCode = await zipEntry.async('text');
    } else if (lowerName.endsWith('design.md') || (lowerName.endsWith('.md') && !designMd)) {
      designMd = await zipEntry.async('text');
    } else if (lowerName.endsWith('screen.png') || lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.webp')) {
      const base64 = await zipEntry.async('base64');
      const mime = lowerName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      screenImage = `data:${mime};base64,${base64}`;
    }
  }

  const tokens = parseDesignMarkdown(designMd || '# Uploaded Design System\n\nExported from Google Stitch.');

  return {
    name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Imported Stitch Project',
    htmlCode: htmlCode || '<!-- No HTML found in archive -->\n<div class="p-8 text-center text-slate-500 font-sans">No code.html located inside the ZIP archive.</div>',
    designMd: designMd || '# Design System\n\nNo DESIGN.md found in the uploaded archive.',
    screenImage,
    tokens,
    isUserUploaded: true,
  };
}

export async function exportProjectZip(project: StitchProject): Promise<Blob> {
  const zip = new JSZip();
  zip.file('code.html', project.htmlCode);
  zip.file('DESIGN.md', project.designMd);

  if (project.screenImage && project.screenImage.startsWith('data:image/png;base64,')) {
    const base64Data = project.screenImage.replace(/^data:image\/png;base64,/, '');
    zip.file('screen.png', base64Data, { base64: true });
  }

  return await zip.generateAsync({ type: 'blob' });
}
