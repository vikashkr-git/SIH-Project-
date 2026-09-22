import React from 'react';
import { ShieldCheck, ExternalLink, Database, FileText } from 'lucide-react';
import { UserRole } from '../../types';

interface FooterProps {
  onSelectRole: (role: UserRole) => void;
  onSelectView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRole, onSelectView }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand & Mission */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-teal-500/40 p-1 flex items-center justify-center">
              <img src="/logo.svg" alt="PackSmart AI" className="w-full h-full" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">PACKSMART AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Intelligent Food Packaging Specification & Decision-Support System powered by food chemistry, mass-transfer physics, and validated empirical permeabilities.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-teal-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Commercial Decision-Support Platform</span>
          </div>
        </div>

        {/* Roles Navigation */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Role Workspaces</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => { onSelectRole('farmer'); onSelectView('dashboard'); }} className="hover:text-white transition-colors">
                Farmer & FPO Assistant
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('producer'); onSelectView('dashboard'); }} className="hover:text-white transition-colors">
                Food Producer & Processor
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('manufacturer'); onSelectView('dashboard'); }} className="hover:text-white transition-colors">
                Packaging Manufacturer / Vendor
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('researcher'); onSelectView('dashboard'); }} className="hover:text-white transition-colors">
                R&D & Science Workbench
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('regulator'); onSelectView('dashboard'); }} className="hover:text-white transition-colors">
                Regulator & Compliance Audit
              </button>
            </li>
          </ul>
        </div>

        {/* Scientific Tools */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Scientific Systems</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => { onSelectRole('researcher'); onSelectView('map'); }} className="hover:text-white transition-colors">
                MAP Headspace Simulator
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('researcher'); onSelectView('kinetics'); }} className="hover:text-white transition-colors">
                Michaelis-Menten Respiration Kinetics
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('producer'); onSelectView('laminate'); }} className="hover:text-white transition-colors">
                Multilayer Laminate Builder
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectRole('regulator'); onSelectView('dataquality'); }} className="hover:text-white transition-colors">
                Dataset 5000 Quality Audit
              </button>
            </li>
            <li>
              <button onClick={() => onSelectView('library')} className="hover:text-white transition-colors">
                Packaging Material Library (15 Standards)
              </button>
            </li>
          </ul>
        </div>

        {/* Scientific Sources & Standards */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Validated Standards</h4>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-center space-x-1.5">
              <Database className="w-3 h-3 text-teal-400" />
              <span>USDA FoodData Central (ARS 2024)</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <FileText className="w-3 h-3 text-teal-400" />
              <span>TRANSMAT Gold Standard (DOI: 10.1016/j.dib.2021.107135)</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <ExternalLink className="w-3 h-3 text-teal-400" />
              <span>Yeh & Turan (2026 npj Science of Food)</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>ASTM D3985 (OTR) / ASTM F1249 (WVTR)</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>FSSAI / ISO 22000 Food Contact Standards</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Provenance & Regulatory Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          © 2026 PackSmart AI Technologies. All rights reserved. Decision-support intelligence grounded in peer-reviewed mass transfer physics.
        </p>
        <p className="text-slate-400 max-w-2xl text-center md:text-right">
          <strong>Notice:</strong> Outputs constitute predictive decision-support recommendations. Physical packaging seal integrity, migration compliance, and commercial shelf-life must be experimentally validated under designated ISO / FSSAI protocols.
        </p>
      </div>
    </footer>
  );
};
