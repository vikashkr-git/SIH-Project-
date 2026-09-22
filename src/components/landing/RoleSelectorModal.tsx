import React from 'react';
import { UserRole } from '../../types';
import { Sprout, Factory, Boxes, FlaskConical, Scale, X, ArrowRight, Check } from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  const roles: {
    id: UserRole;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    features: string[];
    accentColor: string;
    badge: string;
  }[] = [
    {
      id: 'farmer',
      title: 'Farmer / FPO Assistant',
      subtitle: 'Post-Harvest Produce & Field Sourcing',
      description: 'Simple, visual, mobile-first interface designed for cultivators, mandis, and farmer producer organizations.',
      icon: Sprout,
      features: [
        'Visual produce cards (Tomato, Mango, Potato, etc.)',
        'Quantity & bag count estimation',
        'Breathability & micro-perforation callouts',
        'One-click Batch QR code & simple field report',
      ],
      accentColor: 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400',
      badge: 'Simple & Visual',
    },
    {
      id: 'producer',
      title: 'Food Producer / Processor',
      subtitle: 'Technical Formulation & Barrier Engineering',
      description: 'Comprehensive industrial dashboard for food processors, packaged brands, and quality managers.',
      icon: Factory,
      features: [
        'Full proximate chemistry inputs (aw, pH, fat %, moisture %)',
        'Top 3 barrier recommendations (OTR, WVTR, CO₂)',
        'Layer-by-layer structure & "Why This Material" breakdown',
        'Packaging material service life vs food shelf life comparison',
        'Multilayer laminate builder & supplier sourcing assistant',
      ],
      accentColor: 'border-teal-500/40 bg-teal-50/50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400',
      badge: 'Technical & Commercial',
    },
    {
      id: 'manufacturer',
      title: 'Packaging Manufacturer / Vendor',
      subtitle: 'B2B Catalog, Inventory & Technical Datasheets',
      description: 'Dedicated manufacturer portal to register polymer specs, film grades, MOQs, and respond to commercial buyer demands.',
      icon: Boxes,
      features: [
        'Register material specifications (OTR, WVTR, seal temp)',
        'Track customer packaging requests & demand matching',
        'Publish ISO / ASTM technical datasheets & price tiers',
        'Inventory status & regional supply radius management',
      ],
      accentColor: 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400',
      badge: 'B2B Vendor Portal',
    },
    {
      id: 'researcher',
      title: 'R&D / Packaging Scientist',
      subtitle: 'Mass Transfer, Permeability & Kinetics Workbench',
      description: 'Advanced simulation workspace for food packaging researchers, polymer scientists, and laboratory engineers.',
      icon: FlaskConical,
      features: [
        'Interactive MAP Headspace Gas Simulator (O₂ / CO₂ curve)',
        'Michaelis-Menten respiration kinetics (Vmax, Km, Ki)',
        'Fickian diffusion model for target film thickness (L)',
        'TRANSMAT gold standard reference dataset viewer',
      ],
      accentColor: 'border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400',
      badge: 'Scientific Modeling',
    },
    {
      id: 'regulator',
      title: 'Regulator / Quality Auditor',
      subtitle: 'Traceability, Batch Verification & Dataset Governance',
      description: 'Governance cockpit for food safety compliance officers, packaging inspectors, and dataset quality auditors.',
      icon: Scale,
      features: [
        'Live Batch QR code verification & digital ledger',
        'Food_Packaging_Dataset_5000 audit dashboard',
        'Outlier detection (flags F00003 Tomato moisture > 100%)',
        'FSSAI / ISO 22000 migration & recyclability inspection',
      ],
      accentColor: 'border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
      badge: 'Audit & Governance',
    },
  ];

  const handleSelect = (roleId: UserRole) => {
    onSelectRole(roleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Persona Selection</span>
              <span className="text-xs text-slate-400 font-mono">• Tailors Entire Experience</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Select Your Operational Role
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choosing a role adapts the navigation, forms, calculation depth, visuals, and reports to your specific domain.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-500 bg-teal-50/40 dark:bg-teal-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg border ${r.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {r.badge}
                      </span>
                      {isSelected && (
                        <span className="flex items-center text-xs font-bold text-teal-600 dark:text-teal-400">
                          <Check className="w-4 h-4 mr-0.5" /> Active
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {r.title}
                  </h4>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-medium mb-2">
                    {r.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {r.description}
                  </p>

                  <ul className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {r.features.map((feat, i) => (
                      <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start">
                        <span className="text-teal-600 dark:text-teal-400 font-bold mr-1.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Enter as {r.title.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
