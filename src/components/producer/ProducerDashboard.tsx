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
  Check
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
  Tooltip as RechartsTooltip
} from 'recharts';
import { RecommendationFormState, RecommendationResult, TopRecommendation } from '../../types';
import { FOODS_CATALOG } from '../../data/foodsCatalog';
import { getRecommendation } from '../../services/recommendationEngine';

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

  // Load a quick food preset
  const handleSelectPreset = (foodName: string) => {
    const food = FOODS_CATALOG.find(f => f.commodity === foodName);
    if (food) {
      setFormState({
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
      });
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
        <div className="relative z-10 max-w-3xl space-y-2">
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
        <div className="lg:col-span-8 space-y-6">
          {recResult && (
            <>
              {/* Top 3 Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recResult.top_recommendations.map((rec) => {
                  const isSelected = selectedRank === rec.rank;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRank(rec.rank)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-white dark:bg-slate-900 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            rec.rank === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            Rank {rec.rank} Choice
                          </span>
                          <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                            {rec.suitability_score} / 100
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2">
                          {rec.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 font-mono">
                          {rec.technical_specifications.thickness_um} µm • {rec.technical_specifications.otr_class}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-teal-600">
                        <span>{isSelected ? 'Viewing Details' : 'Select'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Recommendation Detailed Card */}
              {activeRec && (
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
