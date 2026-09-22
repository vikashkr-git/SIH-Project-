import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Activity, 
  Layers, 
  Database, 
  Info, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp, 
  RefreshCw, 
  Calculator, 
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  Thermometer,
  Sparkles,
  Scale,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { PACKAGING_CATALOG, CatalogMaterial } from '../../data/materialsCatalog';
import { SCIENTIFIC_SOURCES } from '../../data/sourcesCatalog';
import { getPackagingPhotoUrl } from '../../services/recommendationEngine';

export const ResearcherDashboard: React.FC = () => {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'deepdive' | 'compare' | 'map' | 'kinetics' | 'fickian' | 'sources'>('deepdive');

  // =========================================================================
  // TAB 1: MATERIAL DEEP-DIVE & LAYER ARCHITECTURE STATE
  // =========================================================================
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(PACKAGING_CATALOG[0].id);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const selectedMaterial = useMemo(() => {
    return PACKAGING_CATALOG.find(m => m.id === selectedMaterialId) || PACKAGING_CATALOG[0];
  }, [selectedMaterialId]);

  const filteredMaterials = useMemo(() => {
    return PACKAGING_CATALOG.filter(m => {
      const matchCat = categoryFilter === 'All' || m.category.includes(categoryFilter);
      const matchSearch = m.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          m.structure.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [categoryFilter, searchFilter]);

  // =========================================================================
  // TAB 2: SIDE-BY-SIDE COMPARISON ENGINE STATE (STRICT GREEN VS RED LOGIC)
  // =========================================================================
  const [compareMatAId, setCompareMatAId] = useState<string>(PACKAGING_CATALOG[0]?.id || '');
  const [compareMatBId, setCompareMatBId] = useState<string>(PACKAGING_CATALOG[1]?.id || '');
  const [compareMatCId, setCompareMatCId] = useState<string>(PACKAGING_CATALOG[4]?.id || '');
  const [includeThirdMaterial, setIncludeThirdMaterial] = useState<boolean>(true);

  const matA = useMemo(() => PACKAGING_CATALOG.find(m => m.id === compareMatAId) || PACKAGING_CATALOG[0], [compareMatAId]);
  const matB = useMemo(() => PACKAGING_CATALOG.find(m => m.id === compareMatBId) || PACKAGING_CATALOG[1] || PACKAGING_CATALOG[0], [compareMatBId]);
  const matC = useMemo(() => PACKAGING_CATALOG.find(m => m.id === compareMatCId) || PACKAGING_CATALOG[2] || PACKAGING_CATALOG[0], [compareMatCId]);

  const comparedList = useMemo(() => {
    return includeThirdMaterial ? [matA, matB, matC] : [matA, matB];
  }, [matA, matB, matC, includeThirdMaterial]);

  // Helper to trigger comparison directly from Deep-Dive
  const handleLaunchComparisonWith = (targetMatId: string) => {
    setCompareMatAId(selectedMaterial.id);
    setCompareMatBId(targetMatId);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // TAB 3: MAP SIMULATION & RESIDENTIAL KINETICS PARAMETERS
  // =========================================================================
  const [initialO2, setInitialO2] = useState<number>(5.0); // %
  const [initialCO2, setInitialCO2] = useState<number>(3.0); // %
  const [filmThickness, setFilmThickness] = useState<number>(35); // µm
  const [respirationVmax, setRespirationVmax] = useState<number>(24.0); // mg CO2 / kg·h
  const [tempC, setTempC] = useState<number>(10.0); // °C
  const [produceWeightKg, setProduceWeightKg] = useState<number>(1.0); // kg
  const [pkgSurfaceAreaM2, setPkgSurfaceAreaM2] = useState<number>(0.08); // m²
  const [kmO2, setKmO2] = useState<number>(0.8); // % O2
  const [kiCO2, setKiCO2] = useState<number>(8.5); // % CO2

  // MAP dynamic simulation curve over 14 days
  const mapData = useMemo(() => {
    const data = [];
    let currentO2 = initialO2;
    let currentCO2 = initialCO2;
    const permFactorO2 = 6000 / (filmThickness * 50); 
    const permFactorCO2 = 7500 / (filmThickness * 50);

    for (let day = 0; day <= 14; day += 0.5) {
      const safeO2 = Math.max(0.1, currentO2);
      const safeCO2 = Math.max(0, currentCO2);
      const respirationRate = (respirationVmax * safeO2) / (kmO2 + safeO2 * (1 + safeCO2 / kiCO2));
      const tempFactor = Math.pow(2.0, (tempC - 10) / 10);
      const netRespiration = respirationRate * tempFactor * produceWeightKg * 0.05;

      const o2Influx = permFactorO2 * (20.9 - currentO2) * pkgSurfaceAreaM2 * 0.1;
      const co2Efflux = permFactorCO2 * (currentCO2 - 0.04) * pkgSurfaceAreaM2 * 0.1;

      currentO2 = Math.max(0.2, currentO2 - netRespiration * 0.4 + o2Influx);
      currentCO2 = Math.min(25, currentCO2 + netRespiration * 0.35 - co2Efflux);

      data.push({
        day: day.toFixed(1),
        O2: parseFloat(currentO2.toFixed(2)),
        CO2: parseFloat(currentCO2.toFixed(2)),
        anaerobicLimit: 1.5,
        co2InjuryLimit: 10.0,
      });
    }
    return data;
  }, [initialO2, initialCO2, filmThickness, respirationVmax, tempC, produceWeightKg, pkgSurfaceAreaM2, kmO2, kiCO2]);

  // =========================================================================
  // TAB 4: FICKIAN DIFFUSION EQUATIONS
  // =========================================================================
  const [targetMaxUptakeG, setTargetMaxUptakeG] = useState<number>(1.5);
  const [storageDays, setStorageDays] = useState<number>(180);
  const [polymerPermeabilityP, setPolymerPermeabilityP] = useState<number>(0.65);
  const [ambientRH, setAmbientRH] = useState<number>(75);
  const [internalAw, setInternalAw] = useState<number>(0.25);

  const calcFickianThickness = () => {
    const pSatKpa = 2.81;
    const deltaP = pSatKpa * ((ambientRH / 100) - internalAw);
    const allowableFlux = targetMaxUptakeG / (pkgSurfaceAreaM2 * storageDays);
    const requiredThicknessUm = (polymerPermeabilityP * deltaP) / allowableFlux;
    return {
      deltaP: deltaP.toFixed(3),
      allowableFlux: allowableFlux.toFixed(4),
      requiredThicknessUm: Math.max(10, Math.min(250, requiredThicknessUm)).toFixed(1),
    };
  };

  const fickianResult = calcFickianThickness();

  // =========================================================================
  // COMPARISON ENGINE EVALUATION FUNCTIONS (STRICT GREEN VS RED LOGIC)
  // =========================================================================
  // 1. OTR Winner: Lowest is Best (unless breathable produce)
  const bestOTR = useMemo(() => Math.min(...comparedList.map(m => m.otr_value)), [comparedList]);
  // 2. WVTR Winner: Lowest is Best
  const bestWVTR = useMemo(() => Math.min(...comparedList.map(m => m.wvtr_value)), [comparedList]);
  // 3. Puncture Winner: Highest Newtons is Best
  const bestPuncture = useMemo(() => Math.max(...comparedList.map(m => m.puncture_resistance_n)), [comparedList]);
  // 4. Tensile Winner: Highest MPa is Best
  const bestTensile = useMemo(() => Math.max(...comparedList.map(m => m.tensile_strength_mpa)), [comparedList]);
  // 5. Seal Strength Winner: Highest N/15mm is Best
  const bestSealStrength = useMemo(() => Math.max(...comparedList.map(m => m.seal_strength_n_15mm)), [comparedList]);
  // 6. Thermal Span Winner: (Max - Min) widest is Best
  const getThermalSpan = (m: CatalogMaterial) => m.max_temperature_c - m.min_temperature_c;
  const bestThermalSpan = useMemo(() => Math.max(...comparedList.map(getThermalSpan)), [comparedList]);
  // 7. Cost Index Winner: Lowest is Best
  const bestCostIndex = useMemo(() => Math.min(...comparedList.map(m => m.cost_index_relative)), [comparedList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-100">
      
      {/* Top Banner Dedicated to Researcher Mindset */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-black uppercase tracking-wider">
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Packaging Expert & R&D Analytical Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Polymer Architecture, Material Breakdown & Side-by-Side Comparison
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Researchers do not require automated recommendations. This dedicated workbench provides full <strong>layer-by-layer composition analysis</strong> (explaining which material was used and <em>why it was used</em>), <strong>physical force & pressure thresholds</strong>, <strong>temperature tolerance ranges</strong>, <strong>material lifespan</strong>, and <strong>multi-material side-by-side comparative benchmarking with Green (Superior) vs Red (Weaker) highlights</strong>.
          </p>
        </div>

        <div className="absolute right-6 bottom-3 text-8xl opacity-10 pointer-events-none hidden sm:block">
          🔬
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'deepdive', label: '🔬 Material Deep-Dive & Layer Architecture', icon: Layers },
          { id: 'compare', label: '⚖️ Side-by-Side Comparison (Green vs Red)', icon: Scale },
          { id: 'map', label: '📈 MAP Headspace Dynamics', icon: Activity },
          { id: 'kinetics', label: '🧬 Respiration Kinetics', icon: TrendingUp },
          { id: 'fickian', label: '🧮 Fickian Diffusion Solver', icon: Calculator },
          { id: 'sources', label: '📚 ASTM Standards & Literature', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-105'
                  : 'bg-[#131B2E] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MATERIAL DEEP-DIVE & LAYER ARCHITECTURE ("KYON USE KIYA GAYA")    */}
      {/* ========================================================================= */}
      {activeTab === 'deepdive' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Material Selector & Filter Bar */}
          <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  Step 1: Select Packaging Material to Inspect
                </span>
                <h3 className="text-base font-bold text-white">
                  Packaging Material Specification Catalog ({PACKAGING_CATALOG.length} Formats Available)
                </h3>
              </div>

              {/* Material Dropdown */}
              <div className="w-full sm:w-96">
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-purple-500/50 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {PACKAGING_CATALOG.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.name} ({mat.structure})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Quick Filter Pills */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Filter By Category:</span>
              {[
                { id: 'All', label: 'All Formats' },
                { id: 'Multilayer', label: 'Barrier Laminates' },
                { id: 'Vacuum', label: 'Vacuum & Thermoforming' },
                { id: 'Permeability', label: 'Active & Breathable' },
                { id: 'Bulk', label: 'Bulk Agricultural' },
                { id: 'Shipper', label: 'Master Shippers' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    categoryFilter === cat.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top Dossier Header Card */}
          <div className="bg-[#131B2E] border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white">
                    {selectedMaterial.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedMaterial.id}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {selectedMaterial.name}
                </h2>
                <div className="text-sm font-semibold text-purple-300 flex items-center space-x-2">
                  <span>Chemical / Physical Structure:</span>
                  <span className="font-mono bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-slate-700 text-white">
                    {selectedMaterial.structure}
                  </span>
                </div>
              </div>

              {/* Action: Compare with Alternatives */}
              <div className="flex flex-col sm:items-end space-y-2">
                <button
                  onClick={() => {
                    // Preselect this material as Mat A and another relevant as Mat B
                    const alt = PACKAGING_CATALOG.find(m => m.id !== selectedMaterial.id && m.category === selectedMaterial.category) || 
                                (selectedMaterial.id.includes('FOIL') ? PACKAGING_CATALOG[0] : PACKAGING_CATALOG[1]);
                    handleLaunchComparisonWith(alt.id);
                  }}
                  className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-105"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Side-by-Side with Alternatives</span>
                </button>
                <span className="text-[10px] text-slate-400">
                  Benchmarking against alternative barrier & strength polymers
                </span>
              </div>
            </div>

            {/* Visual Photo + 4 Crucial Researcher Metric Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Packaging Real HD Photo */}
              <div className="lg:col-span-4 rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 p-3 shadow-inner flex items-center justify-center relative group">
                <img
                  src={selectedMaterial.sample_photo_url || getPackagingPhotoUrl(selectedMaterial.short_name)}
                  alt={selectedMaterial.name}
                  onError={(e) => {
                    e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg';
                  }}
                  className="w-full h-56 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-center text-[10px] text-white font-bold">
                  Verified Physical Material Sample
                </div>
              </div>

              {/* 4 Crucial Researcher Cards (Lifespan, Temperature, Physical Force, Gas Barrier) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Lifespan & Durability */}
                <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                      <span>⏳</span>
                      <span>Lifespan & Aging Resilience</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-400">
                      ASTM F392 Flex Fatigue
                    </span>
                  </div>
                  <div className="text-base font-black text-white">
                    {selectedMaterial.material_durability?.virgin_material_shelf_life || '24–36 Months in dry godown'}
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div><strong>Packaged Protection:</strong> {selectedMaterial.material_durability?.packaged_product_protection_duration || '365–730 Days shelf-life'}</div>
                    <div className="text-slate-500"><strong>Aging Failure Mode:</strong> {selectedMaterial.material_durability?.aging_failure_modes || 'Surface tension drop & seal bond decay'}</div>
                  </div>
                </div>

                {/* 2. Temperature Tolerance Envelope */}
                <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                      <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Temperature Operating Range</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Thermal Span: {selectedMaterial.max_temperature_c - selectedMaterial.min_temperature_c}°C
                    </span>
                  </div>
                  <div className="text-base font-black text-cyan-300 font-mono">
                    {selectedMaterial.min_temperature_c}°C to +{selectedMaterial.max_temperature_c}°C
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div><strong>Heat Seal Range:</strong> {selectedMaterial.heat_seal_temp_c_min} – {selectedMaterial.heat_seal_temp_c_max}°C</div>
                    <div><strong>Thermal Class:</strong> {selectedMaterial.min_temperature_c <= -10 ? 'Sub-Zero Cryogenic Stable' : selectedMaterial.max_temperature_c >= 100 ? 'Retort / Hot-Fill Capable' : 'Ambient / Chilled Logistics'}</div>
                  </div>
                </div>

                {/* 3. Physical Pressure & Mechanical Force */}
                <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                      <span>💥</span>
                      <span>Mechanical Force & Pressure</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-yellow-400">
                      ASTM F1306 / D882
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">Puncture Resistance</span>
                      <span className="text-lg font-black text-yellow-400 font-mono">
                        {selectedMaterial.puncture_resistance_n} N
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">Tensile Strength</span>
                      <span className="text-lg font-black text-white font-mono">
                        {selectedMaterial.tensile_strength_mpa} MPa
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <strong>Seal Joint Strength:</strong> {selectedMaterial.seal_strength_n_15mm} N/15mm (Burst pressure resistance)
                  </div>
                </div>

                {/* 4. Gas & Vapor Permeation Kinetics */}
                <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Gas Transmission Kinetics</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ASTM D3985 / F1249
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">OTR (O₂ Permeation)</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {selectedMaterial.otr_value}
                      </span>
                      <span className="text-[9px] text-slate-500 block">cm³/(m²·d·atm)</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">WVTR (Moisture)</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {selectedMaterial.wvtr_value}
                      </span>
                      <span className="text-[9px] text-slate-500 block">g/(m²·day)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LAYER-BY-LAYER ARCHITECTURE & "KYON USE KIYA GAYA" (CORE USER REQUIREMENT) */}
          {/* ========================================================================= */}
          <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4 space-y-1">
              <div className="flex items-center space-x-2 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Micro-Layer Cross-Section Analysis</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Layer-by-Layer Polymer Composition & Scientific Rationale ("Kyon Use Kiya Gaya")
              </h3>
              <p className="text-xs text-slate-400">
                A breakdown of every polymer, metal, or adhesive layer in this material, explaining its physical thickness, technical function, and the exact chemical reason why it was selected.
              </p>
            </div>

            {/* Layer Cards Stack */}
            <div className="space-y-4">
              {selectedMaterial.material_composition?.layers ? (
                selectedMaterial.material_composition.layers.map((layer: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0B0F19] border-2 border-slate-800 hover:border-purple-500/50 transition-all space-y-3 relative overflow-hidden"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 font-black text-sm flex items-center justify-center border border-purple-500/30">
                          {layer.layer_no || idx + 1}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                            {layer.position} ({Math.round(((layer.thickness_um || 20) / (selectedMaterial.total_thickness_um || 100)) * 100)}% of total thickness)
                          </span>
                          <h4 className="text-base font-bold text-white">
                            {layer.name}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Layer Gauge</span>
                        <span className="text-lg font-black text-yellow-400 font-mono">
                          {layer.thickness_um} µm
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="md:col-span-4 bg-[#131B2E] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Technical Function
                        </span>
                        <p className="text-slate-200 font-medium">{layer.function}</p>
                      </div>

                      <div className="md:col-span-8 bg-purple-950/20 p-3 rounded-xl border border-purple-500/20 space-y-1">
                        <span className="text-[10px] font-bold text-purple-300 uppercase flex items-center space-x-1">
                          <Check className="w-3 h-3 text-purple-400" />
                          <span>Kyon Use Kiya Gaya (Scientific Mechanism):</span>
                        </span>
                        <p className="text-slate-300 leading-relaxed italic">
                          "{layer.work}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0B0F19] text-xs text-slate-400">
                  Mono-material structure without discrete laminating plies.
                </div>
              )}
            </div>

            {/* Overall Synergy Justification */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-[#0B0F19] border border-purple-500/30 space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Overall Multi-Material Synergy (Why not a single plastic?):</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedMaterial.material_composition?.why_this_material_short || 
                 'No single polymer simultaneously provides optical printability, hermetic gas sealing, and puncture toughness. This engineered composite creates synergistic barrier performance at optimal cost.'}
              </p>
            </div>
          </div>

          {/* Quality Inspection Checklist & ASTM Standards */}
          <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>Laboratory Verification & Quality Inspection Checklist</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0B0F19] text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Check Item</th>
                    <th className="p-3">Standard</th>
                    <th className="p-3">Acceptance Criteria</th>
                    <th className="p-3">Test Method</th>
                    <th className="p-3 text-right">Criticality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedMaterial.quality_inspection_checklist?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-white">{item.check_item}</td>
                      <td className="p-3 font-mono text-purple-400">{item.standard}</td>
                      <td className="p-3">{item.acceptance_criteria}</td>
                      <td className="p-3 text-slate-400">{item.how_to_test}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          item.criticality === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {item.criticality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SIDE-BY-SIDE COMPARISON (STRICT GREEN VS RED WINNER LOGIC)         */}
      {/* ========================================================================= */}
      {activeTab === 'compare' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Material Selectors Bar for Comparison */}
          <div className="bg-[#131B2E] border-2 border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-400 block">
                  Multi-Material Benchmarking Engine
                </span>
                <h3 className="text-lg font-bold text-white">
                  Compare 2 to 3 Packaging Materials Side-by-Side
                </h3>
                <p className="text-xs text-slate-400">
                  Automatic winner detection: The superior specification is highlighted in <strong className="text-emerald-400">BOLD GREEN</strong> and weaker/inferior specifications in <strong className="text-rose-400">BOLD RED</strong>.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIncludeThirdMaterial(!includeThirdMaterial)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  {includeThirdMaterial ? 'Remove 3rd Material' : '+ Add 3rd Material'}
                </button>
              </div>
            </div>

            {/* 2 or 3 Selectors */}
            <div className={`grid grid-cols-1 ${includeThirdMaterial ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 pt-2`}>
              <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-1.5">
                <label className="text-[10px] font-bold text-purple-400 uppercase block">Material 1 (Candidate A)</label>
                <select
                  value={compareMatAId}
                  onChange={(e) => setCompareMatAId(e.target.value)}
                  className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                >
                  {PACKAGING_CATALOG.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-1.5">
                <label className="text-[10px] font-bold text-cyan-400 uppercase block">Material 2 (Candidate B)</label>
                <select
                  value={compareMatBId}
                  onChange={(e) => setCompareMatBId(e.target.value)}
                  className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                >
                  {PACKAGING_CATALOG.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {includeThirdMaterial && (
                <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-1.5">
                  <label className="text-[10px] font-bold text-yellow-400 uppercase block">Material 3 (Candidate C)</label>
                  <select
                    value={compareMatCId}
                    onChange={(e) => setCompareMatCId(e.target.value)}
                    className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  >
                    {PACKAGING_CATALOG.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side Comparison Cards Grid */}
          <div className={`grid grid-cols-1 ${includeThirdMaterial ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            {comparedList.map((mat, mIdx) => (
              <div
                key={mat.id}
                className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl flex flex-col justify-between"
              >
                {/* Header with Photo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300">
                      Candidate {mIdx === 0 ? 'A' : mIdx === 1 ? 'B' : 'C'}
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">{mat.id}</span>
                  </div>

                  <div className="h-40 rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800 overflow-hidden">
                    <img
                      src={mat.sample_photo_url || getPackagingPhotoUrl(mat.short_name)}
                      alt={mat.name}
                      onError={(e) => { e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg'; }}
                      className="h-36 object-contain rounded-xl"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{mat.name}</h3>
                    <span className="text-xs font-mono text-slate-400 block mt-0.5">{mat.structure}</span>
                  </div>
                </div>

                {/* Compared Metrics with Green vs Red Highlight Rules */}
                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                  
                  {/* Metric 1: OTR (Lowest is Best) */}
                  <div className={`p-3 rounded-2xl border transition-all ${
                    mat.otr_value === bestOTR 
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Oxygen Permeation (OTR)</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        mat.otr_value === bestOTR ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {mat.otr_value === bestOTR ? '✓ BEST BARRIER' : '✗ WEAKER'}
                      </span>
                    </div>
                    <div className={`text-xl font-black font-mono mt-1 ${
                      mat.otr_value === bestOTR ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {mat.otr_value} <span className="text-xs font-normal text-slate-400 font-sans">cm³/(m²·d·atm)</span>
                    </div>
                  </div>

                  {/* Metric 2: WVTR (Lowest is Best) */}
                  <div className={`p-3 rounded-2xl border transition-all ${
                    mat.wvtr_value === bestWVTR 
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Moisture Vapor (WVTR)</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        mat.wvtr_value === bestWVTR ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {mat.wvtr_value === bestWVTR ? '✓ BEST BARRIER' : '✗ WEAKER'}
                      </span>
                    </div>
                    <div className={`text-xl font-black font-mono mt-1 ${
                      mat.wvtr_value === bestWVTR ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {mat.wvtr_value} <span className="text-xs font-normal text-slate-400 font-sans">g/(m²·day)</span>
                    </div>
                  </div>

                  {/* Metric 3: Puncture Resistance in Newtons (Highest is Best) */}
                  <div className={`p-3 rounded-2xl border transition-all ${
                    mat.puncture_resistance_n === bestPuncture 
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Puncture Resistance (Force)</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        mat.puncture_resistance_n === bestPuncture ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {mat.puncture_resistance_n === bestPuncture ? '✓ STRONGEST' : '✗ LOWER FORCE'}
                      </span>
                    </div>
                    <div className={`text-xl font-black font-mono mt-1 ${
                      mat.puncture_resistance_n === bestPuncture ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {mat.puncture_resistance_n} <span className="text-xs font-normal text-slate-400 font-sans">Newtons (ASTM F1306)</span>
                    </div>
                  </div>

                  {/* Metric 4: Tensile Strength (Highest is Best) */}
                  <div className={`p-3 rounded-2xl border transition-all ${
                    mat.tensile_strength_mpa === bestTensile 
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Tensile Pull Strength</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        mat.tensile_strength_mpa === bestTensile ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {mat.tensile_strength_mpa === bestTensile ? '✓ STRONGEST' : '✗ LOWER'}
                      </span>
                    </div>
                    <div className={`text-xl font-black font-mono mt-1 ${
                      mat.tensile_strength_mpa === bestTensile ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {mat.tensile_strength_mpa} <span className="text-xs font-normal text-slate-400 font-sans">MPa (ASTM D882)</span>
                    </div>
                  </div>

                  {/* Metric 5: Temperature Span (Widest is Best) */}
                  <div className={`p-3 rounded-2xl border transition-all ${
                    getThermalSpan(mat) === bestThermalSpan 
                      ? 'bg-emerald-950/40 border-emerald-500/60' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Thermal Envelope</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        getThermalSpan(mat) === bestThermalSpan ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {getThermalSpan(mat) === bestThermalSpan ? '✓ WIDEST RANGE' : '✗ NARROWER'}
                      </span>
                    </div>
                    <div className={`text-base font-black font-mono mt-1 ${
                      getThermalSpan(mat) === bestThermalSpan ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {mat.min_temperature_c}°C to +{mat.max_temperature_c}°C ({getThermalSpan(mat)}°C span)
                    </div>
                  </div>

                  {/* Metric 6: Lifespan (Longest is Best) */}
                  <div className="p-3 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Virgin Material Lifespan</span>
                    <div className="text-sm font-bold text-white font-mono">
                      {mat.material_durability?.virgin_material_shelf_life?.split('(')[0] || '24 Months'}
                    </div>
                  </div>

                  {/* Metric 7: Cost Index (Lowest is Best) */}
                  <div className={`p-3 rounded-2xl border transition-all ${
                    mat.cost_index_relative === bestCostIndex 
                      ? 'bg-emerald-950/40 border-emerald-500/60' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Cost Efficiency Index</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        mat.cost_index_relative === bestCostIndex ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {mat.cost_index_relative === bestCostIndex ? '✓ LOWER EXPENSE' : '✗ EXPENSIVE'}
                      </span>
                    </div>
                    <div className={`text-base font-black font-mono mt-1 ${
                      mat.cost_index_relative === bestCostIndex ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      Index {mat.cost_index_relative} ({mat.cost_index_relative <= 1.0 ? 'Economical Mass-Market' : 'Premium High-Barrier'})
                    </div>
                  </div>

                </div>

                {/* Action button to deep-dive this candidate */}
                <div className="pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMaterialId(mat.id);
                      setActiveTab('deepdive');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-700 bg-[#0B0F19] hover:bg-slate-800 text-xs font-bold text-purple-300 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>View Micro-Layers of {mat.short_name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* R&D Synthesis & Trade-Off Summary */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#131B2E] to-cyan-950/30 border-2 border-purple-500/40 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <FlaskConical className="w-4 h-4" />
              <span>Scientific Trade-Off Analysis & R&D Synthesis</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Comparative Findings for {matA.short_name} vs {matB.short_name} {includeThirdMaterial && `vs ${matC.short_name}`}
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
              <p>
                • <strong>Barrier Superiority:</strong> The lowest OTR/WVTR was achieved by <strong className="text-emerald-400">{comparedList.reduce((prev, curr) => curr.otr_value < prev.otr_value ? curr : prev).name}</strong>. This candidate is recommended for lipid-dense snacks, milk powders, and oxygen-sensitive pharmaceuticals.
              </p>
              <p>
                • <strong>Mechanical Toughness:</strong> The highest puncture & tensile load bearing was achieved by <strong className="text-emerald-400">{comparedList.reduce((prev, curr) => curr.puncture_resistance_n > prev.puncture_resistance_n ? curr : prev).name}</strong>. Ideal for heavy transit drops and rough highway vibrations without flex-cracking.
              </p>
              <p>
                • <strong>Economic Verdict:</strong> Higher barrier laminates exhibit up to 2.5x the material cost index of mono-material films. Choose {matA.short_name} only when target shelf life exceeds 180 days.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MAP HEADSPACE GAS DYNAMICS SIMULATOR                                */}
      {/* ========================================================================= */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Controls Form (4 cols) */}
          <div className="lg:col-span-4 bg-[#131B2E] p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Simulation Inputs
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Initial O₂ Flush (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={initialO2}
                  onChange={(e) => setInitialO2(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-mono text-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Initial CO₂ Flush (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={initialCO2}
                  onChange={(e) => setInitialCO2(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-mono text-purple-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span>Film Thickness (µm)</span>
                <span className="font-mono text-purple-400">{filmThickness} µm</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                value={filmThickness}
                onChange={(e) => setFilmThickness(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Storage Temp (°C)
                </label>
                <input
                  type="number"
                  value={tempC}
                  onChange={(e) => setTempC(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Vmax (mg CO₂/kg·h)
                </label>
                <input
                  type="number"
                  value={respirationVmax}
                  onChange={(e) => setRespirationVmax(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="p-3 bg-[#0B0F19] rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-white block">Equilibrium Failure Thresholds:</span>
              <p className="text-[11px] text-rose-400">• Anaerobic Floor: &lt; 1.5% O₂ (Ethanol ferment)</p>
              <p className="text-[11px] text-amber-400">• CO₂ Injury Limit: &gt; 10.0% CO₂ (Brown heart)</p>
            </div>
          </div>

          {/* Simulation Curves Chart (8 cols) */}
          <div className="lg:col-span-8 bg-[#131B2E] p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Modified Atmosphere Headspace Gas Dynamics (14 Days)
                </h3>
                <span className="text-[11px] text-slate-400">Transient O₂ Consumption vs CO₂ Permeation Equilibrium</span>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">
                Q₁₀ = 2.0 Arrhenius Scaled
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#94A3B8" label={{ value: 'Storage Duration (Days)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis domain={[0, 22]} stroke="#94A3B8" label={{ value: 'Gas Headspace %', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="O2" name="Oxygen (O₂ %)" stroke="#06B6D4" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="CO2" name="Carbon Dioxide (CO₂ %)" stroke="#C084FC" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="anaerobicLimit" name="Anaerobic Danger (1.5% O₂)" stroke="#F43F5E" strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="co2InjuryLimit" name="CO₂ Injury Limit (10.0%)" stroke="#FBBF24" strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Mathematical Model Note: Assumes uniform package geometry and Fickian gas permeation through continuous polymer web.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RESPIRATION KINETICS (MICHAELIS-MENTEN)                             */}
      {/* ========================================================================= */}
      {activeTab === 'kinetics' && (
        <div className="bg-[#131B2E] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-base font-bold text-white">
              Michaelis-Menten Produce Respiration Model with Competitive CO₂ Inhibition
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Living post-harvest crops consume oxygen through cytochrome c oxidase enzymatic pathways. The respiration rate R is non-linear and inhibited by accumulated headspace CO₂.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0F19] text-purple-300 font-mono text-xs sm:text-sm border border-purple-900/50 shadow-inner flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              R_O2 = (V_max · [O₂]) / [ K_m + [O₂] · (1 + [CO₂] / K_i) ]
            </div>
            <div className="text-xs text-slate-500 font-sans">
              Calibrated: Hertog et al., Postharvest Biology & Technology
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Vmax (Max Respiration Rate)</span>
              <input
                type="number"
                value={respirationVmax}
                onChange={(e) => setRespirationVmax(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-purple-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">mg CO₂ / (kg · h)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Km (Michaelis Constant for O₂)</span>
              <input
                type="number"
                step="0.1"
                value={kmO2}
                onChange={(e) => setKmO2(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-purple-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">% O₂ at half-maximal velocity</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Ki (CO₂ Inhibition Constant)</span>
              <input
                type="number"
                step="0.5"
                value={kiCO2}
                onChange={(e) => setKiCO2(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-purple-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">% CO₂ competitive suppression constant</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FICKIAN DIFFUSION EQUATIONS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'fickian' && (
        <div className="bg-[#131B2E] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-base font-bold text-white">
              Fickian 1D Steady-State Mass-Transfer Permeability Solver
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates the minimum required polymer barrier film thickness (L) to prevent moisture ingress beyond the allowable critical uptake threshold.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0F19] text-cyan-300 font-mono text-xs sm:text-sm border border-cyan-900/50 shadow-inner flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              L = (P · Δp · A · t) / ΔM_max
            </div>
            <div className="text-xs text-slate-500 font-sans">
              Crank, The Mathematics of Diffusion (Oxford University Press)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Max Permissible Water Uptake</span>
              <input
                type="number"
                step="0.1"
                value={targetMaxUptakeG}
                onChange={(e) => setTargetMaxUptakeG(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">grams of H₂O</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Required Shelf Life Duration</span>
              <input
                type="number"
                value={storageDays}
                onChange={(e) => setStorageDays(parseInt(e.target.value) || 0)}
                className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">Days (Storage Time t)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Ambient Relative Humidity (RH)</span>
              <input
                type="number"
                value={ambientRH}
                onChange={(e) => setAmbientRH(parseInt(e.target.value) || 0)}
                className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">% external vapor challenge</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
            <span className="text-xs font-bold text-cyan-300 uppercase block">Calculated Minimum Polymer Thickness:</span>
            <div className="text-3xl font-black text-cyan-400 font-mono">
              {fickianResult.requiredThicknessUm} µm
            </div>
            <p className="text-xs text-slate-400">
              Vapor pressure driving force: <strong>{fickianResult.deltaP} kPa</strong> | Allowable daily flux: <strong>{fickianResult.allowableFlux} g/(m²·d)</strong>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ASTM STANDARDS & SCIENTIFIC SOURCES                                */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <div className="bg-[#131B2E] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>Scientific Literature, Gold Standards & ASTM Methodologies</span>
            </h3>
            <p className="text-xs text-slate-400">
              Peer-reviewed source datasets and global testing standards underlying the PackSmart AI engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCIENTIFIC_SOURCES.map((src) => (
              <div
                key={src.id}
                className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2.5 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {src.id}
                  </span>
                  <span className="text-xs text-slate-500">{src.year}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{src.title}</h4>
                <p className="text-xs text-slate-400 font-medium">Authors: {src.authors}</p>
                <p className="text-xs text-purple-300 font-mono">Journal: {src.journal}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Standard: {src.standard}</span>
                  <span className="font-mono text-cyan-400">{src.doi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
