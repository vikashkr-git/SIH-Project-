import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, Thermometer, Wind, Droplets, Flame, Bug, Truck } from 'lucide-react';
import { FoodRiskAnalysis, RiskLevel } from '../../types';

interface FoodRiskAnalysisCardProps {
  riskAnalysis?: FoodRiskAnalysis;
}

export const FoodRiskAnalysisCard: React.FC<FoodRiskAnalysisCardProps> = ({ riskAnalysis }) => {
  if (!riskAnalysis) return null;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <AlertTriangle className="w-3 h-3" />
            <span>High Risk</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" />
            <span>Medium Risk</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Low Risk</span>
          </span>
        );
    }
  };

  const risks = [
    {
      item: riskAnalysis.moisture_risk,
      icon: Droplets,
      color: 'text-cyan-400'
    },
    {
      item: riskAnalysis.oxidation_risk,
      icon: Flame,
      color: 'text-orange-400'
    },
    {
      item: riskAnalysis.respiration_risk,
      icon: Wind,
      color: 'text-emerald-400'
    },
    {
      item: riskAnalysis.microbial_spoilage_risk,
      icon: Bug,
      color: 'text-rose-400'
    },
    {
      item: riskAnalysis.temperature_risk,
      icon: Thermometer,
      color: 'text-amber-400'
    },
    {
      item: riskAnalysis.transportation_risk,
      icon: Truck,
      color: 'text-purple-400'
    },
  ];

  return (
    <div className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Food Risk Analysis</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-normal">
                6 Critical Vectors
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated against food proximate chemistry, living respiration, storage temperature, and transit mode
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Decision Support System
        </span>
      </div>

      {/* Grid of 6 Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {risks.map(({ item, icon: Icon, color }) => (
          <div
            key={item.risk_name}
            className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs font-bold text-white">{item.risk_name}</span>
              </div>
              {getRiskBadge(item.level)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Mandatory Decision Support Disclaimer */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-normal">
          <strong>Decision Support Notice:</strong> {riskAnalysis.disclaimer}
        </p>
      </div>
    </div>
  );
};
