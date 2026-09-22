import React from 'react';
import { Sparkles, ArrowDown, CheckCircle2, ChevronRight } from 'lucide-react';
import { DecisionPathwayStep } from '../../types';

interface ExplainabilityFlowCardProps {
  pathway?: DecisionPathwayStep[];
}

export const ExplainabilityFlowCard: React.FC<ExplainabilityFlowCardProps> = ({ pathway }) => {
  if (!pathway || pathway.length === 0) return null;

  return (
    <div className="bg-[#131B2E] border-2 border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              How did PackSmart AI reach this recommendation?
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic, multi-factor decision logic evaluating food chemistry, environment, and barrier demands
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
          7-Step Transparent Pipeline
        </span>
      </div>

      {/* 7-Step Vertical Flow with connecting line */}
      <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-cyan-500 before:to-emerald-500 before:hidden sm:before:block">
        {pathway.map((step, idx) => (
          <div
            key={step.step_number}
            className="sm:pl-10 relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            {/* Step Number Circle */}
            <div className="sm:absolute sm:left-2 sm:top-1/2 sm:-translate-y-1/2 w-7 h-7 rounded-full bg-slate-900 border-2 border-teal-400 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shadow-md">
              {step.step_number}
            </div>

            <div className="space-y-1 flex-1">
              <div className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <span>{step.step_title}</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {step.input_evaluated}
              </p>
            </div>

            <div className="sm:text-right max-w-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Decision Engine Output</span>
              <span className="text-xs font-bold text-slate-200 block">
                {step.decision_output}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
