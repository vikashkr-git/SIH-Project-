import React from 'react';
import { Leaf, Scale, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SustainabilityTradeOffs, TopRecommendation } from '../../types';

interface SustainabilityTradeOffsCardProps {
  tradeOffs?: SustainabilityTradeOffs;
  activeRecommendation?: TopRecommendation;
  sustainableAlternative?: TopRecommendation;
}

export const SustainabilityTradeOffsCard: React.FC<SustainabilityTradeOffsCardProps> = ({
  tradeOffs,
  activeRecommendation,
  sustainableAlternative,
}) => {
  if (!tradeOffs) return null;

  return (
    <div className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Sustainability & Circularity Trade-Off Analysis</span>
            </h3>
            <p className="text-xs text-slate-400">
              Balanced scientific evaluation: Barrier protection vs Food waste prevention vs Material recyclability
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          EPR Compliance Aligned
        </span>
      </div>

      {/* Trade-Off Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trade-Off 1: Barrier vs Shelf Life */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold">
            <Scale className="w-4 h-4" />
            <span>Barrier ↔ Shelf Life</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {tradeOffs.barrier_vs_shelf_life}
          </p>
        </div>

        {/* Trade-Off 2: Shelf Life vs Material Usage */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
            <Scale className="w-4 h-4" />
            <span>Shelf Life ↔ Material Usage</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {tradeOffs.shelf_life_vs_material_usage}
          </p>
        </div>

        {/* Trade-Off 3: Material Complexity vs Recyclability */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
            <Scale className="w-4 h-4" />
            <span>Complexity ↔ Recyclability</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {tradeOffs.material_vs_recyclability}
          </p>
        </div>
      </div>

      {/* Circularity Alternative Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#0B0F19] border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Circularity Recommendation & Bio-Alternatives</span>
          </div>
          {sustainableAlternative && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Alternative: {sustainableAlternative.short_name}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          {tradeOffs.circularity_recommendation}
        </p>

        {activeRecommendation && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Recyclability Stream</span>
              <span className="text-white font-bold">{activeRecommendation.sustainability_profile.recyclability_stream}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Bio-Based Content</span>
              <span className="text-emerald-400 font-bold">{activeRecommendation.sustainability_profile.bio_based_pct}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Compostable</span>
              <span className={activeRecommendation.sustainability_profile.compostable ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {activeRecommendation.sustainability_profile.compostable ? 'Yes (Industrial)' : 'No'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">EPR Material Impact</span>
              <span className="text-cyan-400 font-bold">{activeRecommendation.sustainability_profile.recyclability_class}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
