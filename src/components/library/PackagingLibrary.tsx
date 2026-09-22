import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { PACKAGING_CATALOG, CatalogMaterial } from '../../data/materialsCatalog';

export const PackagingLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mapFilter, setMapFilter] = useState<string>('All');
  const [recyclableOnly, setRecyclableOnly] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<CatalogMaterial | null>(null);

  const categories = ['All', 'Multilayer Barrier Laminate', 'Controlled Permeability', 'High-Barrier Foil Laminate', 'Mono-Material Barrier', 'Circular Economy Polymer', 'Industrial Rigid / Foil'];

  const filteredMaterials = PACKAGING_CATALOG.filter((mat) => {
    const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.structure.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || mat.category === selectedCategory;
    const matchesMap = mapFilter === 'All' || (mapFilter === 'Yes' ? mat.map_suitable : !mat.map_suitable);
    const matchesRecycle = !recyclableOnly || mat.recyclability_class.includes('High') || mat.biodegradable;

    return matchesSearch && matchesCategory && matchesMap && matchesRecycle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Empirical Packaging Standards Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Packaging Material & Barrier Substrate Library
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Standardized barrier profiles for 15 industrial food packaging materials calibrated under ASTM D3985 (OTR), ASTM F1249 (WVTR), and peer-reviewed permeabilities.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card-base p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by polymer, trade name or structure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={recyclableOnly}
                onChange={(e) => setRecyclableOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Recyclable / Circular Only</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Showing <strong>{filteredMaterials.length}</strong> of {PACKAGING_CATALOG.length} standardized materials</span>
          <span className="font-mono text-[11px]">Calibrated under ASTM climatic chambers</span>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="card-base p-6 space-y-4 hover:border-teal-500/50 transition-all flex flex-col justify-between hover:shadow-md"
          >
            <div>
              {/* Image Preview */}
              <div className="rounded-xl overflow-hidden bg-slate-950 p-2 border border-slate-800 mb-4 flex items-center justify-center">
                <img
                  src={mat.sample_photo_url}
                  alt={mat.name}
                  className="h-36 object-contain"
                />
              </div>

              {/* Title & Category */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="badge-teal text-[10px] uppercase font-bold">{mat.short_name}</span>
                  <span className="font-mono text-xs text-slate-500 font-bold">{mat.total_thickness_um} µm</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {mat.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5 line-clamp-1">
                  {mat.structure}
                </p>
              </div>

              {/* Barrier Ratings Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[9px] uppercase">OTR Value</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{mat.otr_value}</span>
                  <span className="text-[9px] text-slate-500 block">cm³/m²·d·atm</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[9px] uppercase">WVTR Value</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{mat.wvtr_value}</span>
                  <span className="text-[9px] text-slate-500 block">g/m²·d</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[9px] uppercase">Puncture</span>
                  <span className="font-bold text-slate-900 dark:text-white">{mat.puncture_resistance_n} N</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[9px] uppercase">Stream</span>
                  <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{mat.recyclability_stream.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Modal Trigger & DOI */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
              <button
                onClick={() => setSelectedMaterial(mat)}
                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
              >
                <span>View Full Specifications</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-mono text-slate-400">{mat.astm_standard}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Full Material Specification Dossier */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="badge-teal uppercase text-[10px] font-bold">{selectedMaterial.short_name}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedMaterial.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedMaterial.structure}</p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 flex items-center justify-center">
              <img src={selectedMaterial.sample_photo_url} alt={selectedMaterial.name} className="h-44 object-contain" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px]">OTR</span>
                <span className="font-bold text-teal-600">{selectedMaterial.otr_value} cm³/m²·d</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px]">WVTR</span>
                <span className="font-bold text-teal-600">{selectedMaterial.wvtr_value} g/m²·d</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px]">CO₂TR</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedMaterial.co2_permeability}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px]">Dart Puncture</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedMaterial.puncture_resistance_n} N</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Primary Food Applications</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMaterial.primary_applications.map((app, idx) => (
                  <span key={idx} className="badge-slate text-xs">{app}</span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>Scientific Provenance: <strong>{selectedMaterial.source_ref}</strong></div>
              <div>Standard Test Method: <strong>{selectedMaterial.astm_standard}</strong></div>
              <div>DOI Citation: <span className="font-mono text-teal-600">{selectedMaterial.doi}</span></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white dark:bg-teal-600 text-xs font-bold"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
