import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { PackagingLayer } from '../../types';

interface AvailableSubstrate {
  code: string;
  name: string;
  defaultThickness: number;
  minThickness: number;
  maxThickness: number;
  function: string;
  specificOTR: number; // cm3·µm/(m2·d·atm)
  specificWVTR: number; // g·µm/(m2·d)
  color: string;
  recyclabilityImpact: string;
}

const SUBSTRATES: AvailableSubstrate[] = [
  { code: 'PET', name: 'BOPET (Biaxially Oriented PET)', defaultThickness: 12, minThickness: 8, maxThickness: 25, function: 'Outer Printability & Tensile Strength', specificOTR: 1200, specificWVTR: 450, color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300', recyclabilityImpact: 'PET stream if mono' },
  { code: 'AL_FOIL', name: 'Aluminum Foil (Al-Foil)', defaultThickness: 9, minThickness: 6, maxThickness: 20, function: 'Absolute Gas, Vapor & Light Barrier', specificOTR: 0.1, specificWVTR: 0.05, color: 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', recyclabilityImpact: 'Disqualifies mono-stream recycling' },
  { code: 'MET_PET', name: 'Metallized PET (Met-PET)', defaultThickness: 12, minThickness: 10, maxThickness: 20, function: 'High Vacuum Deposition Barrier', specificOTR: 15, specificWVTR: 10, color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300', recyclabilityImpact: 'Code 7 Multilayer' },
  { code: 'EVOH', name: 'EVOH Core (Ethylene Vinyl Alcohol)', defaultThickness: 5, minThickness: 3, maxThickness: 15, function: 'Ultra-High Oxygen Barrier (Recyclable)', specificOTR: 3, specificWVTR: 220, color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300', recyclabilityImpact: 'Recyclable if < 5 wt%' },
  { code: 'BOPP', name: 'BOPP (Biaxially Oriented PP)', defaultThickness: 20, minThickness: 15, maxThickness: 40, function: 'Glossy Crisp Moisture Barrier', specificOTR: 2000, specificWVTR: 120, color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', recyclabilityImpact: 'Code 5 (PP stream)' },
  { code: 'LDPE', name: 'LDPE Sealant (Low-Density PE)', defaultThickness: 50, minThickness: 25, maxThickness: 120, function: 'Heat Seal Fusion & Hermetic Integrity', specificOTR: 6000, specificWVTR: 250, color: 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300', recyclabilityImpact: 'Code 4 (PE stream)' },
  { code: 'PAPER', name: 'Kraft Paper / Bleached Bleach', defaultThickness: 40, minThickness: 30, maxThickness: 80, function: 'Rigidity & Renewable Tactile Texture', specificOTR: 25000, specificWVTR: 1800, color: 'border-amber-600 bg-amber-100/40 text-amber-800 dark:text-amber-200', recyclabilityImpact: 'Pulpable if PE < 15%' },
  { code: 'PLA', name: 'Bio-Polymer PLA / PBAT', defaultThickness: 30, minThickness: 20, maxThickness: 60, function: 'Certified Industrial Compostable Film', specificOTR: 8000, specificWVTR: 4500, color: 'border-green-600 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300', recyclabilityImpact: 'Compostable stream' },
];

export const LaminateBuilder: React.FC = () => {
  const [layers, setLayers] = useState<PackagingLayer[]>([
    { layer_no: 1, position: 'Outer', name: 'BOPET (Biaxially Oriented PET)', thickness_um: 12, function: 'Printability & Tensile Strength', work: 'Exterior surface shield', material_code: 'PET' },
    { layer_no: 2, position: 'Barrier Core', name: 'Aluminum Foil (Al-Foil)', thickness_um: 9, function: 'Absolute Gas, Vapor & Light Barrier', work: 'Hermetic light and gas block', material_code: 'AL_FOIL' },
    { layer_no: 3, position: 'Inner Sealant', name: 'LDPE Sealant (Low-Density PE)', thickness_um: 60, function: 'Heat Seal Fusion & Hermetic Integrity', work: 'Internal food contact seal', material_code: 'LDPE' },
  ]);

  const [selectedSubstrate, setSelectedSubstrate] = useState<string>('EVOH');

  // Add Layer
  const handleAddLayer = () => {
    const sub = SUBSTRATES.find(s => s.code === selectedSubstrate);
    if (!sub) return;

    const newLayer: PackagingLayer = {
      layer_no: layers.length + 1,
      position: layers.length === 0 ? 'Outer' : 'Core',
      name: sub.name,
      thickness_um: sub.defaultThickness,
      function: sub.function,
      work: sub.function,
      material_code: sub.code,
    };
    setLayers([...layers, newLayer]);
  };

  // Remove Layer
  const handleRemoveLayer = (idx: number) => {
    if (layers.length <= 1) return;
    const updated = layers.filter((_, i) => i !== idx).map((l, i) => ({
      ...l,
      layer_no: i + 1,
      position: i === 0 ? 'Outer' : i === layers.length - 2 ? 'Inner Sealant' : 'Core',
    }));
    setLayers(updated);
  };

  // Move Layer Up
  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...layers];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    const updated = copy.map((l, i) => ({
      ...l,
      layer_no: i + 1,
      position: i === 0 ? 'Outer' : i === copy.length - 1 ? 'Inner Sealant' : 'Core',
    }));
    setLayers(updated);
  };

  // Move Layer Down
  const handleMoveDown = (idx: number) => {
    if (idx >= layers.length - 1) return;
    const copy = [...layers];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    const updated = copy.map((l, i) => ({
      ...l,
      layer_no: i + 1,
      position: i === 0 ? 'Outer' : i === copy.length - 1 ? 'Inner Sealant' : 'Core',
    }));
    setLayers(updated);
  };

  // Update Thickness
  const handleThicknessChange = (idx: number, val: number) => {
    const updated = [...layers];
    updated[idx].thickness_um = Math.max(2, val);
    setLayers(updated);
  };

  // Composite Calculations (Series resistance analogy: 1/OTR = sum(thickness_i / specific_OTR_i))
  const compositeMetrics = React.useMemo(() => {
    let totalThickness = 0;
    let invOTR = 0;
    let invWVTR = 0;
    let hasAlFoil = false;
    let isMonoPE = true;
    let isMonoPP = true;

    for (const l of layers) {
      totalThickness += l.thickness_um;
      const sub = SUBSTRATES.find(s => s.code === l.material_code) || SUBSTRATES[0];
      if (l.material_code === 'AL_FOIL') hasAlFoil = true;
      if (l.material_code !== 'LDPE') isMonoPE = false;
      if (l.material_code !== 'BOPP') isMonoPP = false;

      // Resistance contribution
      invOTR += (l.thickness_um / sub.specificOTR);
      invWVTR += (l.thickness_um / sub.specificWVTR);
    }

    const calculatedOTR = hasAlFoil ? 0.05 : (1 / Math.max(0.0001, invOTR));
    const calculatedWVTR = hasAlFoil ? 0.02 : (1 / Math.max(0.0001, invWVTR));

    const recyclability = hasAlFoil 
      ? 'Code 7 (Other / Non-Recyclable Multilayer)' 
      : isMonoPE 
      ? 'Code 4 (100% Recyclable PE Mono-Material)' 
      : isMonoPP 
      ? 'Code 5 (100% Recyclable PP Mono-Material)' 
      : 'Code 7 (Multilayer Barrier Film)';

    return {
      totalThickness,
      calculatedOTR: calculatedOTR < 0.1 ? '< 0.1' : calculatedOTR.toFixed(2),
      calculatedWVTR: calculatedWVTR < 0.1 ? '< 0.05' : calculatedWVTR.toFixed(2),
      recyclability,
      hasAlFoil,
    };
  }, [layers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Interactive Multilayer Composite Modeler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Multilayer Laminate Structure Builder
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Stack, reorder, and configure individual polymer substrates. PackSmart AI dynamically calculates composite gas barrier resistances (OTR/WVTR) and evaluates circular recyclability streams.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Layer Stack (7 cols) */}
        <div className="lg:col-span-7 card-base p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Composite Stack ({layers.length} Layers)
              </h3>
              <p className="text-xs text-slate-500">Outer layer at top, inner sealant layer at bottom.</p>
            </div>
            <button
              onClick={() => setLayers([
                { layer_no: 1, position: 'Outer', name: 'BOPET (Biaxially Oriented PET)', thickness_um: 12, function: 'Printability & Tensile Strength', work: 'Exterior surface shield', material_code: 'PET' },
                { layer_no: 2, position: 'Barrier Core', name: 'Aluminum Foil (Al-Foil)', thickness_um: 9, function: 'Absolute Gas, Vapor & Light Barrier', work: 'Hermetic light and gas block', material_code: 'AL_FOIL' },
                { layer_no: 3, position: 'Inner Sealant', name: 'LDPE Sealant (Low-Density PE)', thickness_um: 60, function: 'Heat Seal Fusion & Hermetic Integrity', work: 'Internal food contact seal', material_code: 'LDPE' },
              ])}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Layers List */}
          <div className="space-y-3">
            {layers.map((layer, idx) => {
              const sub = SUBSTRATES.find(s => s.code === layer.material_code) || SUBSTRATES[0];
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm space-y-3 transition-all hover:border-teal-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">
                        L{layer.layer_no}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{layer.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {layer.position}
                      </span>
                    </div>

                    {/* Reorder and Delete */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="Move layer up"
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === layers.length - 1}
                        title="Move layer down"
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveLayer(idx)}
                        disabled={layers.length <= 1}
                        title="Remove layer"
                        className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thickness Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Thickness Gauge:</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">{layer.thickness_um} µm</span>
                    </div>
                    <input
                      type="range"
                      min={sub.minThickness}
                      max={sub.maxThickness * 2}
                      value={layer.thickness_um}
                      onChange={(e) => handleThicknessChange(idx, parseInt(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Function: {sub.function}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Add Layer Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Add Substrate:</span>
              <select
                value={selectedSubstrate}
                onChange={(e) => setSelectedSubstrate(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              >
                {SUBSTRATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddLayer}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Layer to Laminate</span>
            </button>
          </div>
        </div>

        {/* Right Column: Composite Properties Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-base p-6 space-y-6 border-teal-200 dark:border-teal-800/60 shadow-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Composite Barrier Properties
            </h3>

            {/* Total Gauge */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Laminate Thickness</span>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {compositeMetrics.totalThickness} µm
              </div>
              <span className="text-[11px] text-slate-500">Calculated sum of all {layers.length} layers</span>
            </div>

            {/* Calculated OTR & WVTR */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Calculated OTR</span>
                <div className="text-xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                  {compositeMetrics.calculatedOTR}
                </div>
                <span className="text-[10px] text-slate-500">cm³/(m²·day·atm)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Calculated WVTR</span>
                <div className="text-xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                  {compositeMetrics.calculatedWVTR}
                </div>
                <span className="text-[10px] text-slate-500">g/(m²·day)</span>
              </div>
            </div>

            {/* Circularity & Recyclability */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Circularity Stream</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {compositeMetrics.recyclability}
              </div>
              {compositeMetrics.hasAlFoil ? (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed">
                  Notice: Inclusion of aluminum foil provides absolute barrier but disqualifies the film from municipal mechanical recycling. Consider EVOH core for recyclable barrier applications.
                </p>
              ) : (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed">
                  Excellent circular compatibility. Non-foil barrier retains polymer stream identity for regranulation.
                </p>
              )}
            </div>

            {/* Download Laminate Spec Sheet */}
            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-slate-900 text-white dark:bg-teal-600 font-bold text-xs hover:bg-slate-800 dark:hover:bg-teal-500 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Print Laminate Spec Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
