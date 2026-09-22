import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  SlidersHorizontal, 
  Download, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { ManufacturerMaterial } from '../../types';
import { PACKAGING_CATALOG } from '../../data/materialsCatalog';

export const ManufacturerDashboard: React.FC = () => {
  // Initial vendor catalog items initialized from materials catalog
  const [materials, setMaterials] = useState<ManufacturerMaterial[]>([
    {
      id: 'VEND-001',
      name: 'Metallized PET / Polyethylene Laminate Roll',
      polymer_family: 'PET / LDPE',
      structure: 'Met-PET (12µm) / Primer / LDPE (60µm)',
      thickness_range: '65 – 85 µm',
      otr_value: 1.2,
      wvtr_value: 0.8,
      co2_permeability: 4.5,
      tensile_strength_mpa: 45.0,
      seal_range: '125 – 150°C',
      moq: '500 kg / 2,500 m²',
      price_per_sqm_inr: 42.5,
      recyclability_stream: 'Code 7 (Other Multilayer)',
      is_compostable: false,
      is_bio_based: false,
      food_contact_approval: 'FSSAI / FDA 21 CFR 177.1520',
      regions: ['North India (NCR, Punjab, Haryana)', 'West India (Gujarat, Maharashtra)'],
      stock_status: 'In Stock',
    },
    {
      id: 'VEND-002',
      name: 'Laser Micro-Perforated Produce Film Web',
      polymer_family: 'LLDPE / LDPE Blend',
      structure: 'Blown LLDPE with 100µm precision laser vent grid',
      thickness_range: '30 – 40 µm',
      otr_value: 8500.0,
      wvtr_value: 14.5,
      co2_permeability: 9200.0,
      tensile_strength_mpa: 28.0,
      seal_range: '105 – 130°C',
      moq: '300 kg / 3,000 m²',
      price_per_sqm_inr: 28.0,
      recyclability_stream: 'Code 4 (LDPE Mono-Stream)',
      is_compostable: false,
      is_bio_based: false,
      food_contact_approval: 'IS 9845 / EU 10/2011',
      regions: ['Pan India Supply'],
      stock_status: 'In Stock',
    },
    {
      id: 'VEND-003',
      name: 'Certified Compostable Bio-Film Pouch Grade',
      polymer_family: 'PLA / PBAT Bio-Polymer',
      structure: 'Extruded Polylactic Acid / PBAT blend',
      thickness_range: '25 – 50 µm',
      otr_value: 380.0,
      wvtr_value: 165.0,
      co2_permeability: 1200.0,
      tensile_strength_mpa: 22.0,
      seal_range: '95 – 115°C',
      moq: '200 kg / 1,500 m²',
      price_per_sqm_inr: 68.0,
      recyclability_stream: 'Industrial Compostable (EN 13432)',
      is_compostable: true,
      is_bio_based: true,
      food_contact_approval: 'ASTM D6400 / IS 17088',
      regions: ['NCR, Bangalore, Pune, Ahmedabad'],
      stock_status: 'Custom Run Only',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form for new material registration
  const [newMat, setNewMat] = useState<Partial<ManufacturerMaterial>>({
    name: '',
    polymer_family: 'BOPP / PE',
    structure: '',
    thickness_range: '50 – 70 µm',
    otr_value: 5.0,
    wvtr_value: 2.0,
    co2_permeability: 18.0,
    tensile_strength_mpa: 35.0,
    seal_range: '110 – 135°C',
    moq: '500 kg',
    price_per_sqm_inr: 35.0,
    recyclability_stream: 'Code 5 (PP)',
    is_compostable: false,
    is_bio_based: false,
    food_contact_approval: 'FSSAI / FDA Compliant',
    regions: ['All India'],
    stock_status: 'In Stock',
  });

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMat.name || !newMat.structure) return;

    const created: ManufacturerMaterial = {
      id: `VEND-00${materials.length + 1}`,
      name: newMat.name,
      polymer_family: newMat.polymer_family || 'PE',
      structure: newMat.structure,
      thickness_range: newMat.thickness_range || '50 µm',
      otr_value: Number(newMat.otr_value) || 10,
      wvtr_value: Number(newMat.wvtr_value) || 5,
      co2_permeability: Number(newMat.co2_permeability) || 20,
      tensile_strength_mpa: Number(newMat.tensile_strength_mpa) || 30,
      seal_range: newMat.seal_range || '120°C',
      moq: newMat.moq || '500 kg',
      price_per_sqm_inr: Number(newMat.price_per_sqm_inr) || 40,
      recyclability_stream: newMat.recyclability_stream || 'Code 4',
      is_compostable: !!newMat.is_compostable,
      is_bio_based: !!newMat.is_bio_based,
      food_contact_approval: newMat.food_contact_approval || 'FSSAI Compliant',
      regions: newMat.regions || ['Pan India'],
      stock_status: newMat.stock_status || 'In Stock',
    };

    setMaterials([created, ...materials]);
    setShowAddModal(false);
    setNewMat({ name: '', structure: '' });
  };

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.polymer_family.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.structure.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Boxes className="w-4 h-4 text-blue-400" />
            <span>Packaging Manufacturer & Converter Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Inventory, Film Specifications & Buyer Demand Matching
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Manage your polymer roll grades, ASTM barrier ratings, MOQ thresholds, and deliver certified technical datasheets to commercial food processors.
          </p>
        </div>
      </div>

      {/* Top Controls & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl card-base space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Materials</span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{materials.length} Grades</span>
          <span className="text-[11px] text-teal-600 block">All verified ASTM compliant</span>
        </div>
        <div className="p-4 rounded-xl card-base space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Matching Inquiries</span>
          <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">14 Active</span>
          <span className="text-[11px] text-slate-500 block">Potato chips & produce buyers</span>
        </div>
        <div className="p-4 rounded-xl card-base space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Inventory Status</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">92% Ready</span>
          <span className="text-[11px] text-slate-500 block">Stock film available for dispatch</span>
        </div>
        <div className="p-4 rounded-xl card-base space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Average MOQ</span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">350 kg</span>
          <span className="text-[11px] text-slate-500 block">Standard production run</span>
        </div>
      </div>

      {/* Material Inventory Table */}
      <div className="card-base p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manufacturer Material Catalog & Barrier Ratings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Film specifications registered for automated recommendation matching.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search polymer or structure..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Material</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / Structure</th>
                <th className="py-3 px-4">OTR / WVTR</th>
                <th className="py-3 px-4">Gauge</th>
                <th className="py-3 px-4">MOQ & Price</th>
                <th className="py-3 px-4">Recycling Stream</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{mat.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{mat.structure}</div>
                    <div className="text-[10px] text-teal-600 font-medium mt-0.5">{mat.food_contact_approval}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div>OTR: <strong>{mat.otr_value}</strong> cm³/m²·d</div>
                    <div>WVTR: <strong>{mat.wvtr_value}</strong> g/m²·d</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {mat.thickness_range}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white font-mono">₹{mat.price_per_sqm_inr} / m²</div>
                    <div className="text-[10px] text-slate-500">MOQ: {mat.moq}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {mat.recyclability_stream.split(' ')[0]} {mat.recyclability_stream.split(' ')[1]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      mat.stock_status === 'In Stock' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {mat.stock_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        title="Download Technical Datasheet"
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Edit specifications"
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Material */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Register New Packaging Film / Roll Specification
            </h3>

            <form onSubmit={handleAddMaterial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Material Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BOPP / Met-PET Laminate"
                    value={newMat.name}
                    onChange={(e) => setNewMat({ ...newMat, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Polymer Family</label>
                  <input
                    type="text"
                    placeholder="e.g. OPP / EVOH / PE"
                    value={newMat.polymer_family}
                    onChange={(e) => setNewMat({ ...newMat, polymer_family: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Structure Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOPP (20µm) / Primer / LDPE (40µm)"
                  value={newMat.structure}
                  onChange={(e) => setNewMat({ ...newMat, structure: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">OTR (cm³/m²·d)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMat.otr_value}
                    onChange={(e) => setNewMat({ ...newMat, otr_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WVTR (g/m²·d)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMat.wvtr_value}
                    onChange={(e) => setNewMat({ ...newMat, wvtr_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMat.price_per_sqm_inr}
                    onChange={(e) => setNewMat({ ...newMat, price_per_sqm_inr: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">MOQ</label>
                  <input
                    type="text"
                    value={newMat.moq}
                    onChange={(e) => setNewMat({ ...newMat, moq: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Recycling Stream</label>
                  <input
                    type="text"
                    value={newMat.recyclability_stream}
                    onChange={(e) => setNewMat({ ...newMat, recyclability_stream: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
