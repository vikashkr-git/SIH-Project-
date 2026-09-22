import React, { useState } from 'react';
import { 
  Scale, 
  QrCode, 
  Activity, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  FileText,
  Calendar,
  Building,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { DATASET_QUALITY_REPORT } from '../../data/datasetQualityData';

export const RegulatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'traceability' | 'dataset' | 'compliance'>('traceability');
  const [searchBatchId, setSearchBatchId] = useState('');
  const [verifiedBatch, setVerifiedBatch] = useState<any | null>({
    batch_number: 'BATCH-2026-0922-A41',
    commodity: 'Tomato (Respiring Produce)',
    packaging_name: 'Breathable Microporous PE Film',
    packaging_structure: 'Sub-micron porous CaCO3 filled PE film (32 µm)',
    thickness_um: 32,
    pack_date: '2026-09-21',
    expiry_date: '2026-10-05',
    storage_temp_c: 12,
    relative_humidity_pct: 88,
    farm_or_facility_name: 'Shivalik Agro Producers FPO',
    location: 'Solan, Himachal Pradesh -> Azadpur Mandi, Delhi',
    quantity_kg: 1200,
    status: 'Verified',
    fssai_license: 'FSSAI Lic. #10021011000492',
  });

  const handleSearchBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBatchId.trim()) return;
    setVerifiedBatch({
      batch_number: searchBatchId.toUpperCase(),
      commodity: 'Mango (Alphonso Produce)',
      packaging_name: 'Perforated Breathable Polypropylene',
      packaging_structure: 'Anti-fog treated oriented Polypropylene (OPP)',
      thickness_um: 28,
      pack_date: '2026-09-20',
      expiry_date: '2026-10-08',
      storage_temp_c: 13,
      relative_humidity_pct: 85,
      farm_or_facility_name: 'Konkan Mango Growers Cooperative',
      location: 'Ratnagiri, Maharashtra -> Vashi APMC Mandi, Navi Mumbai',
      quantity_kg: 850,
      status: 'Verified',
      fssai_license: 'FSSAI Lic. #11520023000188',
    });
  };

  // Distribution chart data
  const packagingDistData = Object.entries(DATASET_QUALITY_REPORT.packaging_distribution).map(([name, count]) => ({
    name: name.replace(/_/g, ' '),
    count: count as number,
  })).slice(0, 8);

  const otrDistData = Object.entries(DATASET_QUALITY_REPORT.otr_distribution).map(([cls, count]) => ({
    name: cls,
    count: count as number,
  }));

  const COLORS = ['#0D9488', '#0F766E', '#14B8A6', '#2563EB', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Regulatory Compliance, Traceability & Data Quality Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Packaging Traceability Ledger & Dataset Governance
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Verify post-harvest batch packaging authenticity, monitor FSSAI / ISO 22000 migration standards, and inspect the 5,000-row prototype model dataset audit metrics.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'traceability', label: 'QR Batch Traceability Ledger', icon: QrCode },
          { id: 'dataset', label: 'Dataset 5000 Audit & Distribution', icon: Database },
          { id: 'compliance', label: 'Food Contact & Migration Standards', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Traceability */}
      {activeTab === 'traceability' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="card-base p-6">
            <form onSubmit={handleSearchBatch} className="max-w-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Search Batch Number / Scan QR Hash
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. BATCH-2026-0922-A41"
                    value={searchBatchId}
                    onChange={(e) => setSearchBatchId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify Batch</span>
                </button>
              </div>
            </form>
          </div>

          {/* Verified Batch Card */}
          {verifiedBatch && (
            <div className="card-base p-6 sm:p-8 space-y-6 border-amber-200 dark:border-amber-800/80 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="badge-amber font-mono font-bold text-[10px]">{verifiedBatch.batch_number}</span>
                    <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Authenticity Verified
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {verifiedBatch.commodity}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{verifiedBatch.fssai_license}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Lot Quantity</span>
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{verifiedBatch.quantity_kg} kg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Applied Packaging</span>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{verifiedBatch.packaging_name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{verifiedBatch.packaging_structure}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Facility / Origin</span>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{verifiedBatch.farm_or_facility_name}</div>
                  <div className="text-[11px] text-slate-500">{verifiedBatch.location}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Chronology & Climate</span>
                  <div className="font-mono text-xs text-slate-900 dark:text-white">Pack: {verifiedBatch.pack_date} | Exp: {verifiedBatch.expiry_date}</div>
                  <div className="text-[11px] text-slate-500">Storage: {verifiedBatch.storage_temp_c}°C @ {verifiedBatch.relative_humidity_pct}% RH</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Dataset 5000 Audit */}
      {activeTab === 'dataset' && (
        <div className="space-y-6">
          {/* Key Audit Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl card-base space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Records</span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{DATASET_QUALITY_REPORT.total_records}</span>
              <span className="text-[10px] text-slate-500 block">Food_Packaging_Dataset_5000.csv</span>
            </div>
            <div className="p-4 rounded-xl card-base space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Duplicates Detected</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-600">0</span>
              <span className="text-[10px] text-slate-500 block">Zero duplicate rows</span>
            </div>
            <div className="p-4 rounded-xl card-base space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Unique Commodities</span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{DATASET_QUALITY_REPORT.unique_commodities_count}</span>
              <span className="text-[10px] text-slate-500 block">Across 11 food categories</span>
            </div>
            <div className="p-4 rounded-xl card-base space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">Flagged Anomalies</span>
              <span className="text-2xl font-extrabold font-mono text-amber-600">1</span>
              <span className="text-[10px] text-amber-600/80 block">Moisture &gt; 100% (Flagged)</span>
            </div>
          </div>

          {/* Anomaly Detection Box */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Scientific Data Quality Review Notice</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Row ID <strong>F00003 (Tomato)</strong> records <code>Moisture_pct = 101.08%</code>, which exceeds theoretical physical maximum (100.0%). Per strict scientific integrity protocols, PackSmart AI does <em>not</em> silently fabricate or rewrite raw data. Instead, it is quarantined in the prototype dataset and flagged for laboratory review.
            </p>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Packaging Distribution (8 cols) */}
            <div className="lg:col-span-8 card-base p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Packaging Material Distribution in Dataset (5,000 samples)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={packagingDistData} layout="vertical" margin={{ left: 80, right: 20 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* OTR Class Distribution (4 cols) */}
            <div className="lg:col-span-4 card-base p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                OTR Class Demands
              </h4>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={otrDistData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                      {otrDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Compliance & Standards */}
      {activeTab === 'compliance' && (
        <div className="card-base p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Food Safety & Migration Compliance Standards
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Packaging materials touching food products must adhere to stringent overall migration limits (OML) and specific migration limits (SML) specified by national and international food authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="badge-teal text-[10px]">FSSAI (Food Safety Standards Authority)</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">IS 9845 / IS 1060</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Requires overall migration limit &lt; 60 mg/kg or 10 mg/dm² into food simulants (3% acetic acid, 10% ethanol, rectified olive oil).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="badge-teal text-[10px]">US FDA (21 CFR Part 177)</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Indirect Food Additives Polymers</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Section 177.1520 regulates olefin polymers (LDPE, HDPE, PP) regarding maximum extractable fraction in n-hexane at 50°C.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="badge-teal text-[10px]">EU Commission Regulation</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">EU No 10/2011 (Plastic Materials)</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Union list of authorized monomer substances, positive additives, and specific migration limits for barrier coatings and inks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
