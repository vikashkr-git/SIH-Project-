import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Search, 
  Crosshair, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  RotateCw,
  Sparkles,
  Map as MapIcon
} from 'lucide-react';
import { 
  GeoLocationItem, 
  EXTENDED_SOURCE_REGIONS, 
  EXTENDED_APMC_MANDIS, 
  searchLocationsOnline, 
  getDeviceCurrentLocation 
} from '../../services/mandiGeocodingService';
import { calculateMandiDistance } from '../../data/mandiLocations';

export interface MandiRouteData {
  sourceLocation: GeoLocationItem;
  destinationMandi: GeoLocationItem;
  distanceInfo: {
    distanceKm: number;
    travelHours: number;
    transitSeverity: 'Local' | 'Medium' | 'Long_Distance';
    transitDescription: string;
  };
}

interface MandiRouteSelectorProps {
  initialSource?: GeoLocationItem;
  initialMandi?: GeoLocationItem;
  onRouteChange: (routeData: MandiRouteData) => void;
  compact?: boolean;
}

export const MandiRouteSelector: React.FC<MandiRouteSelectorProps> = ({
  initialSource,
  initialMandi,
  onRouteChange,
  compact = false,
}) => {
  // Farm Source State
  const [sourceQuery, setSourceQuery] = useState<string>(initialSource?.name || EXTENDED_SOURCE_REGIONS[0].name);
  const [selectedSource, setSelectedSource] = useState<GeoLocationItem>(initialSource || EXTENDED_SOURCE_REGIONS[0]);
  const [sourceSuggestions, setSourceSuggestions] = useState<GeoLocationItem[]>([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState<boolean>(false);
  const [isSearchingSource, setIsSearchingSource] = useState<boolean>(false);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Mandi State
  const [mandiQuery, setMandiQuery] = useState<string>(initialMandi?.name || EXTENDED_APMC_MANDIS[0].name);
  const [selectedMandi, setSelectedMandi] = useState<GeoLocationItem>(initialMandi || EXTENDED_APMC_MANDIS[0]);
  const [mandiSuggestions, setMandiSuggestions] = useState<GeoLocationItem[]>([]);
  const [showMandiDropdown, setShowMandiDropdown] = useState<boolean>(false);
  const [isSearchingMandi, setIsSearchingMandi] = useState<boolean>(false);

  // Map view toggle
  const [showLiveOsmMap, setShowLiveOsmMap] = useState<boolean>(false);

  const sourceRef = useRef<HTMLDivElement>(null);
  const mandiRef = useRef<HTMLDivElement>(null);

  // Calculate distance live
  const distanceInfo = calculateMandiDistance(
    selectedSource.lat,
    selectedSource.lon,
    selectedMandi.lat,
    selectedMandi.lon
  );

  // Propagate changes upwards
  useEffect(() => {
    onRouteChange({
      sourceLocation: selectedSource,
      destinationMandi: selectedMandi,
      distanceInfo,
    });
  }, [selectedSource, selectedMandi]);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setShowSourceDropdown(false);
      }
      if (mandiRef.current && !mandiRef.current.contains(event.target as Node)) {
        setShowMandiDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for Source
  useEffect(() => {
    if (!sourceQuery || sourceQuery === selectedSource.name) {
      setSourceSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingSource(true);
      try {
        const results = await searchLocationsOnline(sourceQuery, 'source');
        setSourceSuggestions(results);
        setShowSourceDropdown(true);
      } finally {
        setIsSearchingSource(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [sourceQuery, selectedSource.name]);

  // Debounced search for Mandi
  useEffect(() => {
    if (!mandiQuery || mandiQuery === selectedMandi.name) {
      setMandiSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingMandi(true);
      try {
        const results = await searchLocationsOnline(mandiQuery, 'mandi');
        setMandiSuggestions(results);
        setShowMandiDropdown(true);
      } finally {
        setIsSearchingMandi(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [mandiQuery, selectedMandi.name]);

  // GPS Device Locator handler
  const handleFetchCurrentGps = async () => {
    setIsGpsLoading(true);
    setGpsError(null);
    try {
      const loc = await getDeviceCurrentLocation();
      if (loc) {
        setSelectedSource(loc);
        setSourceQuery(loc.name);
        setShowSourceDropdown(false);
      }
    } catch (err: any) {
      setGpsError(err.message || 'GPS location fetch failed.');
    } finally {
      setIsGpsLoading(false);
    }
  };

  // Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${selectedSource.lat},${selectedSource.lon}&destination=${selectedMandi.lat},${selectedMandi.lon}&travelmode=driving`;

  // Bounding box for OSM embed
  const minLat = Math.min(selectedSource.lat, selectedMandi.lat) - 0.8;
  const maxLat = Math.max(selectedSource.lat, selectedMandi.lat) + 0.8;
  const minLon = Math.min(selectedSource.lon, selectedMandi.lon) - 0.8;
  const maxLon = Math.max(selectedSource.lon, selectedMandi.lon) + 0.8;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${selectedMandi.lat}%2C${selectedMandi.lon}`;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Mandi Map Route Engine</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Auto-Geocoded
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Apna Khet aur Manpasand Mandi type karein — map se auto-fetch hokar distance calculate hoga
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLiveOsmMap(!showLiveOsmMap)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{showLiveOsmMap ? 'Interactive SVG Route' : 'Live Satellite / OSM Map'}</span>
        </button>
      </div>

      {/* Inputs Grid: Aapka Khet & Destination Mandi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ========================================================================= */}
        {/* FIELD 1: AAPKA KHET (MANUAL TYPE + AUTO FETCH)                            */}
        {/* ========================================================================= */}
        <div ref={sourceRef} className="relative bg-white dark:bg-slate-900/90 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>📍 1. Aapka Khet (Farm Location)</span>
            </label>
            <button
              type="button"
              onClick={handleFetchCurrentGps}
              disabled={isGpsLoading}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 flex items-center space-x-1 transition-all disabled:opacity-50"
              title="Apne mobile ya computer ka GPS location fetch karein"
            >
              {isGpsLoading ? (
                <>
                  <RotateCw className="w-3 h-3 animate-spin" />
                  <span>Fetching GPS...</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-3 h-3 text-emerald-500" />
                  <span>Mera GPS Location</span>
                </>
              )}
            </button>
          </div>

          {/* Input Box with Auto-fetch indicator */}
          <div className="relative">
            <input
              type="text"
              value={sourceQuery}
              onChange={(e) => {
                setSourceQuery(e.target.value);
                setShowSourceDropdown(true);
              }}
              onFocus={() => setShowSourceDropdown(true)}
              placeholder="Apne gaon / district ka naam type karein (e.g. Baramati, Nashik, Karnal)..."
              className="w-full pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            {isSearchingSource && (
              <RotateCw className="w-3.5 h-3.5 text-emerald-500 animate-spin absolute right-2.5 top-3" />
            )}
          </div>

          {/* GPS Error notice if any */}
          {gpsError && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400">
              ⚠️ {gpsError}
            </p>
          )}

          {/* Active Farm Location Details Badge */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px]">
            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[190px]">
              📍 {selectedSource.name}
            </span>
            <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
              {selectedSource.lat.toFixed(2)}°N, {selectedSource.lon.toFixed(2)}°E
            </span>
          </div>

          {/* Popular Farm Presets Chips */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-400 block mb-1">Quick Select Belts:</span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {EXTENDED_SOURCE_REGIONS.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedSource(preset);
                    setSourceQuery(preset.name);
                    setShowSourceDropdown(false);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                    selectedSource.id === preset.id
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.name.split('/')[0].split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {showSourceDropdown && sourceSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-fadeIn">
              <div className="p-2 bg-slate-50 dark:bg-slate-950/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Map Auto-Fetch Results</span>
                <span>{sourceSuggestions.length} found</span>
              </div>
              {sourceSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedSource(item);
                    setSourceQuery(item.name);
                    setShowSourceDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors flex items-start justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.specialty || item.state}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FIELD 2: DESTINATION MANDI (MANUAL TYPE + AUTO FETCH)                     */}
        {/* ========================================================================= */}
        <div ref={mandiRef} className="relative bg-white dark:bg-slate-900/90 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>🏛️ 2. Destination Mandi / Wholesale Yard</span>
            </label>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              Target Market
            </span>
          </div>

          {/* Input Box with Auto-fetch indicator */}
          <div className="relative">
            <input
              type="text"
              value={mandiQuery}
              onChange={(e) => {
                setMandiQuery(e.target.value);
                setShowMandiDropdown(true);
              }}
              onFocus={() => setShowMandiDropdown(true)}
              placeholder="Apni pasand ki Mandi ka naam type karein (e.g. Azadpur, Vashi, Lasalgaon, Koyambedu)..."
              className="w-full pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            {isSearchingMandi && (
              <RotateCw className="w-3.5 h-3.5 text-cyan-500 animate-spin absolute right-2.5 top-3" />
            )}
          </div>

          {/* Active Mandi Details Badge */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px]">
            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[190px]">
              🏛️ {selectedMandi.name}
            </span>
            <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
              {selectedMandi.lat.toFixed(2)}°N, {selectedMandi.lon.toFixed(2)}°E
            </span>
          </div>

          {/* Popular Mandis Presets Chips */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-400 block mb-1">Quick Major Mandis:</span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {EXTENDED_APMC_MANDIS.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedMandi(preset);
                    setMandiQuery(preset.name);
                    setShowMandiDropdown(false);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                    selectedMandi.id === preset.id
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.name.split('(')[0].replace('Mandi', '').replace('APMC', '').trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {showMandiDropdown && mandiSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-fadeIn">
              <div className="p-2 bg-slate-50 dark:bg-slate-950/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Mandi Auto-Fetch Results</span>
                <span>{mandiSuggestions.length} found</span>
              </div>
              {mandiSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedMandi(item);
                    setMandiQuery(item.name);
                    setShowMandiDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors flex items-start justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.specialty || item.state}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-700">
                    {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROAD DISTANCE & TRANSIT CALCULATION CARD                                  */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-[#131B2E] to-cyan-950/40 rounded-2xl p-4 border border-cyan-500/30 shadow-lg text-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
              Live Mandi Transit Route Calculation
            </span>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors underline"
          >
            <span>Google Maps Route Dekhein</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Dynamic Road Distance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Measured Road Distance</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-white">{distanceInfo.distanceKm}</span>
              <span className="text-xs font-bold text-cyan-400">KM</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Truck Travel Time</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-yellow-400">~{distanceInfo.travelHours}</span>
              <span className="text-xs font-bold text-yellow-400/80">Hours</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Packaging Stress</span>
            <div className="mt-1">
              {distanceInfo.distanceKm > 250 ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Heavy Long Haul</span>
                </span>
              ) : distanceInfo.distanceKm > 60 ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <span>State Regional</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Local Direct Haul</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Transit Notice / Packaging Impact */}
        <div className={`p-3 rounded-xl border text-xs ${
          distanceInfo.distanceKm > 250 
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
        }`}>
          {distanceInfo.distanceKm > 250 ? (
            <p>
              <strong>⚠️ Long Distance Highway Route ({distanceInfo.distanceKm} km):</strong> 
              {' '}Raste mein tez jhatke (vibrations) aur truck mein 7–8 bori ki unchi stacking ka dabav padega. PackSmart AI ne fasal ko dabne aur galne se bachane ke liye <strong>heavy shock-absorbing 5-ply cartons ya reinforced packaging</strong> activate kar diya hai.
            </p>
          ) : (
            <p>
              <strong>✓ Normal Local Route ({distanceInfo.distanceKm} km):</strong> 
              {' '}Safalta-purvak under ~{distanceInfo.travelHours} ghante mein mandi pahunchega. Standard ventilated bori ya crate liners perfect suraksha denge.
            </p>
          )}
        </div>

        {/* Visual Map / SVG Canvas or OpenStreetMap Embed */}
        {showLiveOsmMap ? (
          <div className="rounded-xl overflow-hidden border border-white/20 h-56 relative bg-slate-950">
            <iframe
              title="OpenStreetMap Live Route"
              src={osmEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 bg-slate-900/90 text-[10px] px-2.5 py-1 rounded-lg border border-white/10 font-bold">
              🗺️ OpenStreetMap Calibrated
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-3 bg-[#0B0F19] border border-white/10 relative overflow-hidden">
            {/* Visual Highway Simulation Graphic */}
            <div className="flex items-center justify-between px-2 py-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">Khet Origin</span>
                  <span className="font-bold text-white text-xs">{selectedSource.name.split('(')[0]}</span>
                </div>
              </div>

              {/* Animated Road Track */}
              <div className="flex-1 mx-4 flex flex-col items-center">
                <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-mono font-bold mb-1">
                  <span>NH Highway</span>
                  <span>•</span>
                  <span>{distanceInfo.distanceKm} KM</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full relative overflow-hidden flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-400 to-cyan-500 opacity-60" />
                  <div className="w-4 h-4 rounded-full bg-white shadow-md shadow-white/50 absolute animate-pulse left-1/2 -translate-x-1/2" />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-right">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold block uppercase">Destination Mandi</span>
                  <span className="font-bold text-white text-xs">{selectedMandi.name.split('(')[0]}</span>
                </div>
                <span className="w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-cyan-500/20" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
