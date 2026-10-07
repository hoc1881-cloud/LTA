import { BusArrivalService, BusStop, CrowdLoad, BusDeckType, TransitOperator, FavoriteBookmark, NextBusInfo } from '../types/transit';

const FAVORITES_STORAGE_KEY = 'sg_lta_favorites_v1';
const SETTINGS_STORAGE_KEY = 'sg_lta_settings_v1';

export interface AppSettings {
  autoRefreshInterval: number; // in seconds (15, 30, 60)
  soundAlerts: boolean;
  ltaAccountKey?: string;
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    autoRefreshInterval: 20,
    soundAlerts: false,
    ltaAccountKey: '',
  };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

export function getFavorites(): FavoriteBookmark[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    { id: 'fav-08057', stopCode: '08057', createdAt: Date.now() - 100000 },
    { id: 'fav-01112', stopCode: '01112', createdAt: Date.now() - 50000 },
  ];
}

export function toggleFavorite(stopCode: string, serviceNo?: string): boolean {
  try {
    const current = getFavorites();
    const existingIndex = current.findIndex(
      (f) => f.stopCode === stopCode && f.serviceNo === serviceNo
    );

    let updated: FavoriteBookmark[];
    let isNowFavorited = false;

    if (existingIndex >= 0) {
      updated = current.filter((_, idx) => idx !== existingIndex);
      isNowFavorited = false;
    } else {
      updated = [
        {
          id: `fav-${stopCode}${serviceNo ? `-${serviceNo}` : ''}-${Date.now()}`,
          stopCode,
          serviceNo,
          createdAt: Date.now(),
        },
        ...current,
      ];
      isNowFavorited = true;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    return isNowFavorited;
  } catch (e) {
    return false;
  }
}

export function isStopFavorited(stopCode: string, serviceNo?: string): boolean {
  const current = getFavorites();
  return current.some((f) => f.stopCode === stopCode && (!serviceNo || f.serviceNo === serviceNo));
}

// Pseudo-random deterministic hash based on serviceNo, stopCode, and 10-minute time window
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate realistic LTA live arrivals for a given bus stop
export function getSimulatedArrivals(busStop: BusStop): BusArrivalService[] {
  const now = new Date();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  const services = busStop.services;

  return services.map((serviceNo, idx) => {
    // Generate deterministic arrival offsets based on service number and stop
    const hash = getHash(`${busStop.code}-${serviceNo}`);
    
    // Cycle duration between 8 and 14 mins
    const intervalMin = 7 + (hash % 6);
    
    // Position inside the cycle
    const progressSeconds = ((currentMinute * 60 + currentSecond + (hash * 37)) % (intervalMin * 60));
    const nextArrSeconds = (intervalMin * 60) - progressSeconds;
    
    const arrMinutes1 = Math.floor(nextArrSeconds / 60);
    const arrMinutes2 = arrMinutes1 + intervalMin - (hash % 3);
    const arrMinutes3 = arrMinutes2 + intervalMin + 1;

    // Operator determination
    let operator: TransitOperator = 'SBST';
    const num = parseInt(serviceNo, 10);
    if (!isNaN(num)) {
      if ([61, 75, 106, 167, 178, 187, 190, 851, 856, 857, 858, 960, 961, 962, 972].includes(num)) {
        operator = 'SMRT';
      } else if ([66, 78, 79, 97, 98, 143, 183, 334].includes(num)) {
        operator = 'TTS'; // Tower Transit Singapore
      } else if ([3, 34, 43, 62, 82, 83, 84, 85, 118, 136, 381].includes(num)) {
        operator = 'GAS'; // Go-Ahead Singapore
      }
    }

    // Load determinations
    const loads: CrowdLoad[] = ['SEA', 'SDA', 'LSD'];
    const load1 = loads[(hash + currentMinute) % 3];
    const load2 = loads[(hash + currentMinute + 1) % 3];
    const load3: CrowdLoad = 'SEA';

    // Deck types
    const deckTypes: BusDeckType[] = ['DD', 'SD', 'DD', 'BD'];
    const deck1 = deckTypes[(hash + idx) % deckTypes.length];
    const deck2 = deckTypes[(hash + idx + 1) % deckTypes.length];
    const deck3: BusDeckType = 'SD';

    return {
      serviceNo,
      operator,
      nextBus: {
        estimatedArrival: new Date(now.getTime() + nextArrSeconds * 1000).toISOString(),
        arrivalMinutes: arrMinutes1,
        load: load1,
        feature: 'WAB' as const,
        type: deck1,
        monitored: true,
      },
      nextBus2: {
        estimatedArrival: new Date(now.getTime() + arrMinutes2 * 60 * 1000).toISOString(),
        arrivalMinutes: arrMinutes2,
        load: load2,
        feature: 'WAB' as const,
        type: deck2,
        monitored: true,
      },
      nextBus3: {
        estimatedArrival: new Date(now.getTime() + arrMinutes3 * 60 * 1000).toISOString(),
        arrivalMinutes: arrMinutes3,
        load: load3,
        feature: 'WAB' as const,
        type: deck3,
        monitored: true,
      },
    };
  }).sort((a, b) => {
    // Sort numerically or by next arrival
    const numA = parseInt(a.serviceNo, 10);
    const numB = parseInt(b.serviceNo, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.serviceNo.localeCompare(b.serviceNo);
  });
}

// Format arrival text e.g. "Arr", "1 min", "12 min"
export function formatArrivalMinutes(minutes: number): string {
  if (minutes <= 0) return 'Arr';
  if (minutes === 1) return '1 min';
  return `${minutes} min`;
}

// LTA Crowd Load Visual Helpers
export function getLoadMeta(load: CrowdLoad): { label: string; bg: string; text: string; border: string; dot: string } {
  switch (load) {
    case 'SEA':
      return {
        label: 'Seats Available',
        bg: 'bg-emerald-950/80',
        text: 'text-emerald-400',
        border: 'border-emerald-800/80',
        dot: 'bg-emerald-400',
      };
    case 'SDA':
      return {
        label: 'Standing Available',
        bg: 'bg-amber-950/80',
        text: 'text-amber-400',
        border: 'border-amber-800/80',
        dot: 'bg-amber-400',
      };
    case 'LSD':
      return {
        label: 'Limited Standing',
        bg: 'bg-rose-950/80',
        text: 'text-rose-400',
        border: 'border-rose-800/80',
        dot: 'bg-rose-400',
      };
  }
}

// Deck Type Visual Helpers
export function getDeckLabel(deck: BusDeckType): string {
  switch (deck) {
    case 'DD': return 'Double Deck';
    case 'SD': return 'Single Deck';
    case 'BD': return 'Bendy Bus';
  }
}

function parseLTABusInfo(raw: any): NextBusInfo | undefined {
  if (!raw || !raw.EstimatedArrival) return undefined;
  const diffMs = new Date(raw.EstimatedArrival).getTime() - Date.now();
  const arrivalMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const load: CrowdLoad = (['SEA', 'SDA', 'LSD'].includes(raw.Load) ? raw.Load : 'SEA') as CrowdLoad;
  const type: BusDeckType = (['SD', 'DD', 'BD'].includes(raw.Type) ? raw.Type : 'SD') as BusDeckType;
  return {
    estimatedArrival: raw.EstimatedArrival,
    arrivalMinutes,
    load,
    feature: raw.Feature === 'WAB' ? 'WAB' : '',
    type,
    monitored: true,
  };
}

export function parseLTAArrivalsResponse(services: any[]): BusArrivalService[] {
  return services.map((s) => {
    const next1 = parseLTABusInfo(s.NextBus) || {
      estimatedArrival: new Date().toISOString(),
      arrivalMinutes: 0,
      load: 'SEA' as CrowdLoad,
      feature: 'WAB' as const,
      type: 'SD' as BusDeckType,
    };
    return {
      serviceNo: String(s.ServiceNo),
      operator: (s.Operator || 'SBST') as TransitOperator,
      nextBus: next1,
      nextBus2: parseLTABusInfo(s.NextBus2),
      nextBus3: parseLTABusInfo(s.NextBus3),
    };
  }).sort((a, b) => {
    const numA = parseInt(a.serviceNo, 10);
    const numB = parseInt(b.serviceNo, 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.serviceNo.localeCompare(b.serviceNo);
  });
}

export async function fetchLiveLTAArrivals(busStop: BusStop, customAccountKey?: string): Promise<BusArrivalService[]> {
  try {
    const url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStop.code)}`;
    const headers: Record<string, string> = {};
    if (customAccountKey) {
      headers['AccountKey'] = customAccountKey;
    }
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.Services) && data.Services.length > 0) {
        return parseLTAArrivalsResponse(data.Services);
      }
    }
  } catch (err) {
    console.warn(`LTA API fetch failed for stop ${busStop.code}, using fallback:`, err);
  }
  return getSimulatedArrivals(busStop);
}

