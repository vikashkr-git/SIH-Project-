import React, { useState } from 'react';
import { Building, MapPin, Search, Copy, Check, ExternalLink, ShieldAlert, AlertTriangle } from 'lucide-react';
import { TopRecommendation } from '../../types';

interface InlineSourcingCardProps {
  activeRecommendation?: TopRecommendation;
}

export const InlineSourcingCard: React.FC<InlineSourcingCardProps> = ({ activeRecommendation }) => {
  const [city, setCity] = useState('Delhi NCR');
  const [state, setState] = useState('Delhi');
  const [country, setCountry] = useState('India');
  const [copied, setCopied] = useState(false);

  if (!activeRecommendation) return null;

  const material = activeRecommendation.name;
  const structure = activeRecommendation.structure;
  const thickness = `${activeRecommendation.technical_specifications.thickness_um} µm`;

  const searchQuery = `${material} ${structure} food packaging supplier in ${city} ${state}`.trim();
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  const indiamartSearchUrl = `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(`${material} packaging ${city}`)}`;

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(searchQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Procurement & Sourcing Specification</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                No Fabricated Data
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Generate exact technical RFQ inquiries for verified commercial packaging converters
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Live Supplier Verification Required
        </span>
      </div>

      {/* Required Specifications Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0B0F19] border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Required Substrate</span>
          <span className="text-xs font-bold text-white block mt-0.5">{material}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Required Structure</span>
          <span className="text-xs font-mono text-teal-400 block mt-0.5">{structure}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Nominal Thickness</span>
          <span className="text-xs font-mono text-cyan-400 block mt-0.5">{thickness}</span>
        </div>
      </div>

      {/* User Location Form */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 block">
          Enter Your Procurement Location (City, State, Country):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Delhi, Ahmedabad, Pune"
              className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">State / Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Maharashtra, UP, Gujarat"
              className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. India"
              className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Generated Search Query Box */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-purple-300">Generated B2B Inquiry Query:</span>
          <button
            type="button"
            onClick={handleCopyQuery}
            className="flex items-center space-x-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Query'}</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs font-mono text-slate-200 break-words">
          "{searchQuery}"
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-md"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Verified Suppliers on Google</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={indiamartSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
          >
            <span>Search on IndiaMART / TradeIndia</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Sourcing Integrity Notice */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Integrity Guarantee:</strong> PackSmart AI does not fabricate fictitious supplier contacts, prices, or MOQ promises. Commercial converters must provide food-grade migration certificates (IS 9845 / 21 CFR 177) and batch COA prior to purchase.
        </p>
      </div>
    </div>
  );
};
