import React, { useState } from 'react';
import { 
  Factory, 
  Sparkles, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Search, 
  FileText, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  Truck,
  RotateCcw,
  Check,
  Scale,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { RecommendationFormState, RecommendationResult, TopRecommendation } from '../../types';
import { FOODS_CATALOG } from '../../data/foodsCatalog';
import { getRecommendation, getPackagingPhotoUrl } from '../../services/recommendationEngine';

interface ProducerDashboardProps {
  onOpenLaminate: () => void;
  onOpenSourcing: (query: string) => void;
  onOpenReport: (result: RecommendationResult) => void;
}

export const ProducerDashboard: React.FC<ProducerDashboardProps> = ({
  onOpenLaminate,
  onOpenSourcing,
  onOpenReport,
}) => {
  // Preset defaults
  const [formState, setFormState] = useState<RecommendationFormState>({
    commodity: 'Potato Chips',
    category: 'Snacks',
    moisture_pct: 2.0,
    fat_pct: 34.5,
    protein_pct: 6.5,
    ph: 6.2,
    respiration_rate: 0,
    shelf_life_days: 180,
    storage_temp_c: 22.0,
    relative_humidity_pct: 55.0,
    storage_type: 'Ambient',
    transportation: 'Long_Distance',
    optimization_goal: 'Balanced',
    packaging_format: 'Pillow Pouch',
  });

  const [loading, setLoading] = useState(false);
  const [recResult, setRecResult] = useState<RecommendationResult | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'anatomy' | 'durability' | 'sourcing' | 'checklist'>('specs');
  const [viewMode, setViewMode] = useState<'dossier' | 'compare'>('dossier');

  // Load a quick food preset and re-compute immediately
  const handleSelectPreset = async (foodName: string) => {
    const food = FOODS_CATALOG.find(f => f.commodity === foodName);
    if (food) {
      const nextState: RecommendationFormState = {
        commodity: food.commodity,
        category: food.category,
        moisture_pct: food.moisture_pct,
        fat_pct: food.fat_pct,
        protein_pct: food.protein_pct,
        ph: food.ph,
        respiration_rate: food.respiration_rate_val,
        shelf_life_days: food.standard_shelf_life_days,
        storage_temp_c: food.optimal_temp_c,
        relative_humidity_pct: food.optimal_rh_pct,
        storage_type: food.optimal_storage_type,
        transportation: 'Long_Distance',
        optimization_goal: 'Balanced',
      };
      setFormState(nextState);
      setLoading(true);
      try {
        const res = await getRecommendation(nextState);
        setRecResult(res);
        setSelectedRank(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await getRecommendation(formState);
      setRecResult(res);
      setSelectedRank(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run on first load if no result
  React.useEffect(() => {
    if (!recResult) {
      handleGenerate();
    }
  }, []);

  const activeRec: TopRecommendation | undefined = recResult?.top_recommendations.find(r => r.rank === selectedRank) || recResult?.top_recommendations[0];
  const topRecs: TopRecommendation[] = recResult?.top_recommendations || [];

  const getThermalSpan = (r: TopRecommendation) => {
    const min = r.technical_specifications.min_temperature_c ?? 0;
    return 100 - min;
  };

  // Winner calculations for strict Green vs Red comparison logic (as in Researcher)
  const bestOTR = topRecs.length > 0 ? Math.min(...topRecs.map(r => r.technical_specifications.otr_value)) : 0;
  const bestWVTR = topRecs.length > 0 ? Math.min(...topRecs.map(r => r.technical_specifications.wvtr_value)) : 0;
  const bestPuncture = topRecs.length > 0 ? Math.max(...topRecs.map(r => r.technical_specifications.puncture_resistance_n)) : 0;
  const bestTensile = topRecs.length > 0 ? Math.max(...topRecs.map(r => r.technical_specifications.tensile_strength_mpa)) : 0;
  const bestCostIndex = topRecs.length > 0 ? Math.min(...topRecs.map(r => r.sustainability_profile.relative_cost_index)) : 0;
  const bestThermalSpan = topRecs.length > 0 ? Math.max(...topRecs.map(r => getThermalSpan(r))) : 0;

  // Comparative metrics data for Recharts Bar Chart
  const comparativeMetrics = [
    {
      metric: 'O₂ Barrier',
      candA: topRecs[0]?.explanation.radar_metrics.oxygen_barrier || 0,
      candB: topRecs[1]?.explanation.radar_metrics.oxygen_barrier || 0,
      candC: topRecs[2]?.explanation.radar_metrics.oxygen_barrier || 0,
    },
    {
      metric: 'H₂O Barrier',
      candA: topRecs[0]?.explanation.radar_metrics.moisture_barrier || 0,
      candB: topRecs[1]?.explanation.radar_metrics.moisture_barrier || 0,
      candC: topRecs[2]?.explanation.radar_metrics.moisture_barrier || 0,
    },
    {
      metric: 'Mechanical',
      candA: topRecs[0]?.explanation.radar_metrics.mechanical_strength || 0,
      candB: topRecs[1]?.explanation.radar_metrics.mechanical_strength || 0,
      candC: topRecs[2]?.explanation.radar_metrics.mechanical_strength || 0,
    },
    {
      metric: 'Thermal',
      candA: topRecs[0]?.explanation.radar_metrics.thermal_stability || 0,
      candB: topRecs[1]?.explanation.radar_metrics.thermal_stability || 0,
      candC: topRecs[2]?.explanation.radar_metrics.thermal_stability || 0,
    },
    {
      metric: 'Cost Index',
      candA: topRecs[0]?.explanation.radar_metrics.cost_efficiency || 0,
      candB: topRecs[1]?.explanation.radar_metrics.cost_efficiency || 0,
      candC: topRecs[2]?.explanation.radar_metrics.cost_efficiency || 0,
    },
    {
      metric: 'Circularity',
      candA: topRecs[0]?.explanation.radar_metrics.sustainability || 0,
      candB: topRecs[1]?.explanation.radar_metrics.sustainability || 0,
      candC: topRecs[2]?.explanation.radar_metrics.sustainability || 0,
    },
  ];

  // Radar data formatting
  const radarData = activeRec ? [
    { subject: 'Oxygen Barrier', value: activeRec.explanation.radar_metrics.oxygen_barrier },
    { subject: 'Moisture Barrier', value: activeRec.explanation.radar_metrics.moisture_barrier },
    { subject: 'Mechanical', value: activeRec.explanation.radar_metrics.mechanical_strength },
    { subject: 'Thermal', value: activeRec.explanation.radar_metrics.thermal_stability },
    { subject: 'Sustainability', value: activeRec.explanation.radar_metrics.sustainability },
    { subject: 'Cost Economy', value: activeRec.explanation.radar_metrics.cost_efficiency },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Factory className="w-4 h-4 text-teal-400" />
              <span>Industrial Packaging Specification System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Food Producer & Processor Specification Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Multi-parameter chemical analysis, mass-transfer constraint validation, and ASTM empirical barrier selection. Generates industrial specifications and multilayer laminates.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setViewMode('compare');
                const el = document.getElementById('producer-results-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-md hover:scale-105"
            >
              <Scale className="w-4 h-4" />
              <span>Compare All 3 Formulations Side-by-Side</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Commodity Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-2">Presets:</span>
        {['Potato Chips', 'Milk Powder', 'Tomato', 'Frozen Peas', 'Coffee Powder', 'Biscuits', 'Fresh Chicken', 'Cheese'].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => handleSelectPreset(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              formState.commodity === name
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Chemical & Environmental Specification (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleGenerate} className="card-base p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span>Food & Climate Parameters</span>
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            </h2>

            {/* Commodity & Category */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Commodity Name
                </label>
                <input
                  type="text"
                  value={formState.commodity}
                  onChange={(e) => setFormState({ ...formState, commodity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Category
                </label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Snacks">Snacks / Crisps</option>
                  <option value="Dairy">Dairy / Milk Powder / Cheese</option>
                  <option value="Fresh Produce">Fresh Produce / Fruit</option>
                  <option value="Vegetable">Vegetables / Roots</option>
                  <option value="Frozen Vegetable">Frozen Goods</option>
                  <option value="Beverage">Beverage / Coffee / Tea</option>
                  <option value="Bakery">Bakery / Biscuits / Bread</option>
                  <option value="Meat">Meat / Poultry</option>
                  <option value="Seafood">Seafood / Fish</option>
                </select>
              </div>
            </div>

            {/* Chemical Matrix Grid */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Proximate Matrix</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Moisture %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.moisture_pct}
                    onChange={(e) => setFormState({ ...formState, moisture_pct: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Fat / Lipid %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.fat_pct}
                    onChange={(e) => setFormState({ ...formState, fat_pct: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Protein %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.protein_pct}
                    onChange={(e) => setFormState({ ...formState, protein_pct: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.ph}
                    onChange={(e) => setFormState({ ...formState, ph: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Environmental & Logistics */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Climate & Distribution</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Shelf Life Target (d)
                  </label>
                  <input
                    type="number"
                    value={formState.shelf_life_days}
                    onChange={(e) => setFormState({ ...formState, shelf_life_days: parseInt(e.target.value) || 1 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Storage Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={formState.storage_temp_c}
                    onChange={(e) => setFormState({ ...formState, storage_temp_c: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Storage Type
                  </label>
                  <select
                    value={formState.storage_type}
                    onChange={(e) => setFormState({ ...formState, storage_type: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  >
                    <option value="Ambient">Ambient</option>
                    <option value="Chilled">Chilled (4–12°C)</option>
                    <option value="Frozen">Frozen (&lt; -18°C)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Transit Risk
                  </label>
                  <select
                    value={formState.transportation}
                    onChange={(e) => setFormState({ ...formState, transportation: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  >
                    <option value="Long_Distance">Long Distance (National)</option>
                    <option value="Local_Truck">Regional / Local</option>
                    <option value="Refrigerated">Refrigerated Cold Chain</option>
                    <option value="Export_Air">Air Freight / Export</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Optimization Priority
                </label>
                <select
                  value={formState.optimization_goal}
                  onChange={(e) => setFormState({ ...formState, optimization_goal: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  <option value="Balanced">Balanced (Barrier + Economy + Eco)</option>
                  <option value="Performance">Max Barrier Performance</option>
                  <option value="Sustainability">Sustainability & Circularity</option>
                  <option value="Cost">Cost Optimization</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Barrier Physics...' : 'Compute Specifications'}</span>
            </button>
          </form>
        </div>

        {/* Right Output: Ranked TOP 3 & Detailed Dossier (8 cols) */}
        <div id="producer-results-section" className="lg:col-span-8 space-y-6">
          {recResult && (
            <>
              {/* Mode Switcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('dossier')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      viewMode === 'dossier'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Specification Dossier (Rank {selectedRank})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('compare')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      viewMode === 'compare'
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>Compare All 3 Formulations Side-by-Side</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/20 text-white font-mono uppercase tracking-wider">
                      Benchmarking
                    </span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 dark:text-slate-400 px-2 font-medium hidden sm:inline">
                  {viewMode === 'compare' ? '⚡ Strict Green vs Red Benchmarking Mode' : `Selected: Rank ${selectedRank} Formulation`}
                </span>
              </div>

              {/* Top 3 Strategic Results Cards with Images & Archetypes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recResult.top_recommendations.map((rec) => {
                  const isSelected = selectedRank === rec.rank;
                  const photoUrl = rec.sample_photo_url || getPackagingPhotoUrl(rec.short_name, formState.commodity);
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRank(rec.rank)}
                      className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'border-teal-600 bg-white dark:bg-slate-900 shadow-lg ring-2 ring-teal-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Rank + Score Header */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            rec.rank === 1
                              ? 'bg-teal-600 text-white shadow-sm'
                              : rec.rank === 2
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-emerald-600 text-white shadow-sm'
                          }`}>
                            {rec.rank === 1 ? '🌟 Rank 1 Choice' : rec.rank === 2 ? '🛡️ Rank 2 Choice' : '🌿 Rank 3 Choice'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400">
                              {rec.suitability_score}
                            </span>
                            <span className="text-[10px] text-slate-400">/100</span>
                          </div>
                        </div>

                        {/* Archetype Label */}
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${rec.rank === 1 ? 'bg-teal-500' : rec.rank === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                          <span className="line-clamp-1">{rec.archetype || (rec.rank === 1 ? 'Optimal Standard Solution' : rec.rank === 2 ? 'Ultra-Barrier Defense' : 'Sustainable / Value Alternative')}</span>
                        </div>

                        {/* Real Packaging Photo container */}
                        <div className="h-36 w-full rounded-xl bg-slate-950 p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden relative group-hover:border-teal-500/40 transition-colors">
                          <img
                            src={photoUrl}
                            alt={rec.name}
                            onError={(e) => { e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg'; }}
                            className="h-32 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-slate-300 backdrop-blur-xs">
                            {rec.technical_specifications.thickness_um} µm
                          </span>
                        </div>

                        {/* Name & Structure */}
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {rec.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono line-clamp-1">
                            {rec.structure}
                          </p>
                        </div>

                        {/* Quick Spec Metrics */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400 block text-[9px]">OTR Barrier</span>
                            <strong className="text-teal-600 dark:text-teal-400">{rec.technical_specifications.otr_value}</strong>
                          </div>
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400 block text-[9px]">WVTR Barrier</span>
                            <strong className="text-teal-600 dark:text-teal-400">{rec.technical_specifications.wvtr_value}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                        <span>{isSelected ? '✓ Active Specification' : 'Select Solution'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ========================================================================= */}
              {/* VIEW MODE 1: 3-WAY SIDE-BY-SIDE BENCHMARKING ENGINE (STRICT GREEN VS RED) */}
              {/* ========================================================================= */}
              {viewMode === 'compare' ? (
                <div className="space-y-8 animate-fadeIn">
                  {/* Benchmarking Header Banner */}
                  <div className="bg-[#131B2E] border-2 border-teal-500/40 rounded-3xl p-6 space-y-3 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
                          <Scale className="w-4 h-4 text-teal-400" />
                          <span>Multi-Specification Benchmarking Engine</span>
                        </span>
                        <h3 className="text-xl font-extrabold text-white mt-0.5">
                          Compare All 3 Formulations Side-by-Side for {formState.commodity}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Automatic winner detection: Superior barrier, mechanical strength, and cost metrics are highlighted in{' '}
                          <strong className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">BOLD GREEN</strong>{' '}
                          and weaker/inferior metrics in{' '}
                          <strong className="text-rose-400 font-bold bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/40">BOLD RED</strong>.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewMode('dossier')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2 border border-slate-700 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                        <span>Switch to Single Dossier View</span>
                      </button>
                    </div>
                  </div>

                  {/* Side-by-Side 3-Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topRecs.map((mat, mIdx) => {
                      const photoUrl = mat.sample_photo_url || getPackagingPhotoUrl(mat.short_name, formState.commodity);
                      const isBestOTR = mat.technical_specifications.otr_value === bestOTR;
                      const isBestWVTR = mat.technical_specifications.wvtr_value === bestWVTR;
                      const isBestPuncture = mat.technical_specifications.puncture_resistance_n === bestPuncture;
                      const isBestTensile = mat.technical_specifications.tensile_strength_mpa === bestTensile;
                      const isBestCost = mat.sustainability_profile.relative_cost_index === bestCostIndex;
                      const isBestSpan = getThermalSpan(mat) === bestThermalSpan;
                      const isEcoFriendly = (mat.sustainability_profile.bio_based_pct > 0 || mat.sustainability_profile.recyclability_class.includes('High') || mat.sustainability_profile.compostable);

                      return (
                        <div
                          key={mat.id}
                          className={`bg-[#131B2E] border-2 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl flex flex-col justify-between transition-all ${
                            selectedRank === mat.rank ? 'border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.25)]' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Header with Photo */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                mat.rank === 1 ? 'bg-teal-600 text-white' : mat.rank === 2 ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                              }`}>
                                Candidate {mIdx === 0 ? 'A (Rank 1)' : mIdx === 1 ? 'B (Rank 2)' : 'C (Rank 3)'}
                              </span>
                              <span className="font-mono text-xs font-bold text-teal-400">
                                {mat.suitability_score} / 100
                              </span>
                            </div>

                            {/* Archetype subtitle */}
                            <div className="text-[11px] font-bold text-teal-300">
                              {mat.archetype || (mat.rank === 1 ? 'Optimal Standard Choice' : mat.rank === 2 ? 'Ultra-Barrier Protection' : 'Sustainable / Value Alternative')}
                            </div>

                            {/* Verified Sample Photo */}
                            <div className="h-44 rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800 overflow-hidden relative group">
                              <img
                                src={photoUrl}
                                alt={mat.name}
                                onError={(e) => { e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg'; }}
                                className="h-38 w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-center text-[10px] text-white font-bold">
                                Verified Physical Specification
                              </div>
                            </div>

                            <div>
                              <h3 className="text-base font-extrabold text-white line-clamp-1">{mat.name}</h3>
                              <span className="text-xs font-mono text-slate-400 block mt-0.5 line-clamp-1">{mat.structure}</span>
                            </div>
                          </div>

                          {/* Compared Metrics with Strict Green vs Red Highlights */}
                          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                            
                            {/* Metric 1: OTR (Lowest is Best) */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isBestOTR
                                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Oxygen Permeation (OTR)</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isBestOTR ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {isBestOTR ? '✓ BEST BARRIER' : '✗ WEAKER'}
                                </span>
                              </div>
                              <div className={`text-lg font-black font-mono mt-1 ${isBestOTR ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {mat.technical_specifications.otr_value} <span className="text-xs font-normal text-slate-400 font-sans">cm³/(m²·d·atm)</span>
                              </div>
                            </div>

                            {/* Metric 2: WVTR (Lowest is Best) */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isBestWVTR
                                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Moisture Vapor (WVTR)</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isBestWVTR ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {isBestWVTR ? '✓ BEST MOISTURE SHIELD' : '✗ WEAKER'}
                                </span>
                              </div>
                              <div className={`text-lg font-black font-mono mt-1 ${isBestWVTR ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {mat.technical_specifications.wvtr_value} <span className="text-xs font-normal text-slate-400 font-sans">g/(m²·day)</span>
                              </div>
                            </div>

                            {/* Metric 3: Puncture Resistance in Newtons (Highest is Best) */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isBestPuncture
                                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Puncture Resistance</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isBestPuncture ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {isBestPuncture ? '✓ STRONGEST' : '✗ LOWER FORCE'}
                                </span>
                              </div>
                              <div className={`text-lg font-black font-mono mt-1 ${isBestPuncture ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {mat.technical_specifications.puncture_resistance_n} <span className="text-xs font-normal text-slate-400 font-sans">N (ASTM F1306)</span>
                              </div>
                            </div>

                            {/* Metric 4: Tensile Strength (Highest is Best) */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isBestTensile
                                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Tensile Pull Strength</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isBestTensile ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {isBestTensile ? '✓ STRONGEST' : '✗ LOWER'}
                                </span>
                              </div>
                              <div className={`text-lg font-black font-mono mt-1 ${isBestTensile ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {mat.technical_specifications.tensile_strength_mpa} <span className="text-xs font-normal text-slate-400 font-sans">MPa (ASTM D882)</span>
                              </div>
                            </div>

                            {/* Metric 5: Temperature Span (Widest is Best) */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isBestSpan
                                ? 'bg-emerald-950/40 border-emerald-500/60'
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Thermal Envelope</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isBestSpan ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {isBestSpan ? '✓ WIDEST RANGE' : '✗ NARROWER'}
                                </span>
                              </div>
                              <div className={`text-sm font-black font-mono mt-1 ${isBestSpan ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {mat.technical_specifications.min_temperature_c}°C to 85°C ({getThermalSpan(mat)}°C span)
                              </div>
                            </div>

                            {/* Metric 6: Cost Index (Lowest is Best) */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isBestCost
                                ? 'bg-emerald-950/40 border-emerald-500/60'
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Cost Efficiency Index</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isBestCost ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {isBestCost ? '✓ LOWER EXPENSE' : '✗ EXPENSIVE'}
                                </span>
                              </div>
                              <div className={`text-sm font-black font-mono mt-1 ${isBestCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                                Index {mat.sustainability_profile.relative_cost_index} • {mat.procurement_market.estimated_cost_per_pouch_inr}
                              </div>
                            </div>

                            {/* Metric 7: Sustainability & Circularity */}
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isEcoFriendly
                                ? 'bg-emerald-950/40 border-emerald-500/60'
                                : 'bg-slate-900/60 border-slate-800'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Circularity & Eco-Score</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  isEcoFriendly ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {isEcoFriendly ? '✓ ECO CIRCULAR' : 'CONVENTIONAL'}
                                </span>
                              </div>
                              <div className={`text-xs font-bold mt-1 ${isEcoFriendly ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {mat.sustainability_profile.recyclability_stream} • {mat.sustainability_profile.recyclability_class}
                              </div>
                            </div>

                          </div>

                          {/* Actions for this Candidate */}
                          <div className="pt-4 border-t border-slate-800 space-y-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRank(mat.rank);
                                setViewMode('dossier');
                                window.scrollTo({ top: 400, behavior: 'smooth' });
                              }}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
                                selectedRank === mat.rank
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                              }`}
                            >
                              <span>{selectedRank === mat.rank ? '✓ Currently Selected — View Dossier' : 'Adopt Formulation & View Dossier'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={onOpenLaminate}
                                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center space-x-1"
                              >
                                <Layers className="w-3 h-3 text-teal-400" />
                                <span>Build Laminate</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenReport(recResult)}
                                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center space-x-1"
                              >
                                <FileText className="w-3 h-3 text-teal-400" />
                                <span>Spec PDF</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Comparative Recharts Visualization Bar Chart */}
                  <div className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-extrabold text-white flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-teal-400" />
                          <span>Multi-Axis Performance Benchmark (6 Core Dimensions)</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Comparing candidate barrier properties, mechanical toughness, thermal stability, cost economy, and sustainability score.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                          <span className="text-slate-300">Candidate A (Rank 1)</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          <span className="text-slate-300">Candidate B (Rank 2)</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-300">Candidate C (Rank 3)</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-64 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparativeMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                          <XAxis dataKey="metric" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                          <Bar dataKey="candA" name="Candidate A (Rank 1)" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="candB" name="Candidate B (Rank 2)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="candC" name="Candidate C (Rank 3)" fill="#10B981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Producer Decision Matrix / Trade-off Synthesis */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/40 via-[#131B2E] to-blue-950/40 border-2 border-teal-500/40 space-y-4">
                    <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Strategic Formulation Guide for Food Processors & Brand Owners</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                      <div className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-teal-500/30 space-y-2">
                        <strong className="text-teal-400 block text-sm font-extrabold">When to pick Candidate A (Optimal):</strong>
                        <p className="text-slate-300 leading-relaxed">
                          Ideal for standard domestic supply chain routes, modern retail shelf placement, and everyday operational runs where barrier balance and margin economy are equally vital.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-blue-500/30 space-y-2">
                        <strong className="text-blue-400 block text-sm font-extrabold">When to pick Candidate B (Ultra-Barrier):</strong>
                        <p className="text-slate-300 leading-relaxed">
                          Engineered for long-distance transit, export container freight, or monsoon warehouse conditions with high ambient humidity (&gt;80% RH) where aroma loss and rancidity must be prevented at all costs.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-emerald-500/30 space-y-2">
                        <strong className="text-emerald-400 block text-sm font-extrabold">When to pick Candidate C (Sustainable / Value):</strong>
                        <p className="text-slate-300 leading-relaxed">
                          Targeted for eco-conscious organic retail branding, ESG / Plastic Waste Management Rules compliance, or cost-critical mass packaging where competitive pouch unit rates dominate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ========================================================================= */
                /* VIEW MODE 2: ACTIVE RECOMMENDATION DETAILED DOSSIER CARD                  */
                /* ========================================================================= */
                activeRec && (
                  <div className="card-base p-6 sm:p-8 space-y-6">
                    {/* Title & Quick Summary */}
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="badge-teal uppercase tracking-wider">Rank {activeRec.rank} Recommended Solution</span>
                          <span className="text-xs text-slate-400 font-mono">• {activeRec.category}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                          {activeRec.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                          Structure: {activeRec.structure}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setViewMode('compare')}
                          className="px-3 py-1.5 rounded-lg border border-teal-500/40 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/40 flex items-center space-x-1.5 shadow-xs"
                        >
                          <Scale className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Compare All 3 Side-by-Side</span>
                        </button>
                        <button
                          onClick={onOpenLaminate}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-50 flex items-center space-x-1.5"
                        >
                          <Layers className="w-3.5 h-3.5 text-teal-600" />
                          <span>Build Laminate</span>
                        </button>
                        <button
                          onClick={() => onOpenReport(recResult)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 flex items-center space-x-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download Spec Dossier</span>
                        </button>
                      </div>
                    </div>

                  {/* Navigation Tabs under active recommendation */}
                  <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'specs', label: 'Technical Specs & XAI' },
                      { id: 'anatomy', label: 'Material Breakdown & "Why This"' },
                      { id: 'durability', label: 'Service Life vs Food Life' },
                      { id: 'sourcing', label: 'Local Sourcing & Cost' },
                      { id: 'checklist', label: 'Quality Acceptance Checklist' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          activeTab === tab.id
                            ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* TAB 1: Specs & Radar */}
                  {activeTab === 'specs' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* 6 Key Specifications Grid (7 cols) */}
                        <div className="md:col-span-7 grid grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Gauge Thickness</span>
                            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                              {activeRec.technical_specifications.thickness_um} µm
                            </span>
                            <span className="text-[11px] text-slate-500 block">ASTM D6988 Micrometer standard</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Oxygen Transmission (OTR)</span>
                            <span className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400">
                              {activeRec.technical_specifications.otr_value}
                            </span>
                            <span className="text-[11px] text-slate-500 block">cm³/(m²·day·atm) • ASTM D3985</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Water Vapor (WVTR)</span>
                            <span className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400">
                              {activeRec.technical_specifications.wvtr_value}
                            </span>
                            <span className="text-[11px] text-slate-500 block">g/(m²·day) • ASTM F1249</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Dart Drop Puncture</span>
                            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                              {activeRec.technical_specifications.puncture_resistance_n} N
                            </span>
                            <span className="text-[11px] text-slate-500 block">ASTM F392 Flex resistance</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Heat Sealing Range</span>
                            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                              {activeRec.technical_specifications.sealing_temp_range_c}
                            </span>
                            <span className="text-[11px] text-slate-500 block">Fusion heat sealable</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Recycling Classification</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {activeRec.sustainability_profile.recyclability_stream}
                            </span>
                            <span className="text-[11px] text-slate-500 block">{activeRec.sustainability_profile.recyclability_class}</span>
                          </div>
                        </div>

                        {/* Radar Chart (5 cols) */}
                        <div className="md:col-span-5 h-56 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Performance Radar</span>
                          <ResponsiveContainer width="100%" height="90%">
                            <RadarChart data={radarData}>
                              <PolarGrid stroke="#94A3B8" strokeOpacity={0.25} />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Performance" dataKey="value" stroke="#0D9488" fill="#0D9488" fillOpacity={0.4} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Scientific Evidence Banner */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          <span>Standard Reference: <strong>{activeRec.scientific_provenance.astm_standard}</strong> • DOI: {activeRec.scientific_provenance.doi}</span>
                        </div>
                        <span className="font-mono text-[11px] text-teal-600">Model: Grouped Random Forest v1.0</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Anatomy & "Why This Material" */}
                  {activeTab === 'anatomy' && (
                    <div className="space-y-6">
                      {/* Packaging Graphic */}
                      <div className="p-4 rounded-xl bg-slate-950 flex items-center justify-center">
                        <img src={activeRec.sample_photo_url} alt={activeRec.name} className="h-44 object-contain" />
                      </div>

                      {/* Layer by Layer Breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Multilayer Structure Breakdown
                        </h4>
                        <div className="space-y-2">
                          {activeRec.material_composition.layers.map((layer) => (
                            <div key={layer.layer_no} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                    Layer {layer.layer_no} ({layer.position})
                                  </span>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">{layer.name}</span>
                                </div>
                                <p className="text-[11px] text-slate-500">{layer.work}</p>
                              </div>
                              <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                                {layer.thickness_um} µm
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 9-Dimension "Why Only This" Explanations */}
                      <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 space-y-2">
                        <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wide flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          <span>Scientific Justification for Selection</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {activeRec.explanation.reasons_why.map((r, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-teal-600 font-bold mr-1.5">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Durability (Service Life vs Food Shelf Life) */}
                  {activeTab === 'durability' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Food Shelf Life Target</span>
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                            {formState.shelf_life_days} Days
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Target preservation period for {formState.commodity} to retain freshness, aroma, crispness, and microbial safety.
                          </p>
                        </div>

                        <div className="p-5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 space-y-2">
                          <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400 block">Packaging Material Service Life</span>
                          <span className="text-xl font-extrabold text-teal-900 dark:text-teal-200 font-mono">
                            {activeRec.material_durability.virgin_material_shelf_life.split(' ')[0]} {activeRec.material_durability.virgin_material_shelf_life.split(' ')[1]}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {activeRec.material_durability.virgin_material_shelf_life}. Storage conditions: {activeRec.material_durability.unfilled_storage_conditions}.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Material Aging Failure Modes
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {activeRec.material_durability.aging_failure_modes}
                        </p>
                        <span className="text-[11px] font-mono text-slate-400 block pt-1">
                          Note: Clear distinction maintained between food spoilage kinetics and polymer degradation lifespan.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Sourcing & Local Availability */}
                  {activeTab === 'sourcing' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Estimated Roll / Film Cost</span>
                          <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                            {activeRec.procurement_market.estimated_cost_per_kg_inr}
                          </span>
                          <span className="text-[11px] text-slate-500 block">{activeRec.procurement_market.approx_cost_usd}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Unit Pouch Cost</span>
                          <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                            {activeRec.procurement_market.estimated_cost_per_pouch_inr}
                          </span>
                          <span className="text-[11px] text-slate-500 block">Finished pouch conversion</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Minimum Order Qty (MOQ)</span>
                          <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                            {activeRec.procurement_market.moq}
                          </span>
                          <span className="text-[11px] text-slate-500 block">Lead time: {activeRec.procurement_market.lead_time}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                        <div>
                          <strong>Live Supplier Verification Required:</strong> Prices, MOQs, and regional supply quantities vary by custom run specifications and film web widths.
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenSourcing(`${activeRec.name} supplier near Delhi`)}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all flex items-center space-x-2 shadow-sm"
                      >
                        <Search className="w-4 h-4" />
                        <span>Launch Sourcing Assistant for {activeRec.short_name}</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 5: Checklist */}
                  {activeTab === 'checklist' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Pre-Receiving Quality Assurance Checklist
                      </h4>
                      <div className="space-y-2">
                        {activeRec.quality_inspection_checklist.map((item, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900 dark:text-white">{item.check_item}</span>
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {item.standard}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              <strong>Acceptance Criteria:</strong> {item.acceptance_criteria}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Method: {item.how_to_test}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
