import React from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { ShelfLifeAnalysis } from '../../types';

interface ShelfLifeDistinctionCardProps {
  shelfLife?: ShelfLifeAnalysis;
}

export const ShelfLifeDistinctionCard: React.FC<ShelfLifeDistinctionCardProps> = ({ shelfLife }) => {
  if (!shelfLife) return null;

  return (
    <div className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Shelf-Life Integrity & Validation Framework
            </h3>
            <p className="text-xs text-slate-400">
              Clear distinction between consumer shelf-life target, model estimates, experimental verification, and material service life
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
          FSSAI / ASTM Protocol Aligned
        </span>
      </div>

      {/* 4 Distinct Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Food Shelf-Life Target */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. Food Shelf-Life Target</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              User Goal
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-white">
            {shelfLife.target_shelf_life_days} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <p className="text-xs text-slate-400">
            Target distribution window required for retail merchandising and consumption.
          </p>
        </div>

        {/* 2. Model-Estimated Shelf Life */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>2. Model-Estimated Shelf Life</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-300 border border-yellow-400/20">
              Theoretical Model
            </span>
          </div>
          <div className="text-sm font-bold text-yellow-400 leading-snug">
            {shelfLife.model_estimated_shelf_life}
          </div>
          <p className="text-xs text-slate-400">
            Computed by barrier mass transfer equations (Fickian permeation & lipid oxidation kinetics). Not a commercial warranty.
          </p>
        </div>

        {/* 3. Experimentally Validated Shelf Life */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>3. Experimentally Validated Shelf Life</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Lab Requirement
            </span>
          </div>
          <div className="text-xs font-bold text-rose-300">
            ⚠️ {shelfLife.experimental_validation_status}
          </div>
          <p className="text-xs text-slate-400">
            Model estimations must not be used as final commercial expiry dates without real-time or accelerated shelf-life testing (ASLT).
          </p>
        </div>

        {/* 4. Packaging Material Service Life */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Packaging Material Service Life</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Warehouse Durability
            </span>
          </div>
          <div className="text-xs font-bold text-emerald-300">
            {shelfLife.packaging_material_service_life}
          </div>
          <p className="text-xs text-slate-400">
            Duration during which unfilled rollstock or pouches retain seal strength and barrier integrity before packing.
          </p>
        </div>
      </div>
    </div>
  );
};
