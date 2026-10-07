export type CrowdLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusDeckType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
export type TransitOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface NextBusInfo {
  estimatedArrival: string; // ISO string
  arrivalMinutes: number; // e.g. 0 (Arr), 1, 4, 12
  load: CrowdLoad;
  feature: 'WAB' | ''; // Wheelchair Accessible
  type: BusDeckType;
  monitored?: boolean;
}

export interface BusArrivalService {
  serviceNo: string;
  operator: TransitOperator;
  nextBus: NextBusInfo;
  nextBus2?: NextBusInfo;
  nextBus3?: NextBusInfo;
}

export interface BusStop {
  code: string; // 5-digit code e.g. '01012'
  roadName: string;
  description: string;
  latitude: number;
  longitude: number;
  services: string[];
  mrtInterchange?: string;
}

export interface BusRouteStop {
  stopCode: string;
  stopName: string;
  roadName: string;
  seq: number;
  distanceKm: number;
  hasBusCurrent?: boolean;
  busLoad?: CrowdLoad;
}

export interface BusRoute {
  serviceNo: string;
  operator: TransitOperator;
  direction: 1 | 2;
  originName: string;
  destinationName: string;
  firstBusWeekday: string;
  lastBusWeekday: string;
  stops: BusRouteStop[];
}

export interface MRTStation {
  code: string;
  name: string;
  interchange?: string[];
}

export interface MRTLine {
  id: string;
  code: string; // NSL, EWL, CCL, DTL, NEL, TEL
  name: string;
  color: string;
  textColor: string;
  status: 'Normal Service' | 'Minor Delays' | 'Disrupted';
  statusDescription: string;
  headwayMinutes: string;
  stations: MRTStation[];
}

export interface FavoriteBookmark {
  id: string;
  stopCode: string;
  serviceNo?: string; // Optional: if bookmarking a specific bus at a stop
  customNickname?: string;
  createdAt: number;
}
