import React from 'react';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Sprout, 
  Factory, 
  Boxes, 
  FlaskConical, 
  Scale, 
  Layers, 
  Activity, 
  QrCode, 
  BookOpen, 
  FileText,
  Search,
  Sparkles
} from 'lucide-react';


interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  openRoleModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  openRoleModal,
  darkMode,
  onToggleDarkMode,
  activeView,
  onSelectView,
}) => {
  const roleConfig = {
    farmer: { label: 'Farmer / FPO', icon: Sprout, badge: 'Assistant Mode', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
    producer: { label: 'Food Producer', icon: Factory, badge: 'Technical Mode', color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' },
    manufacturer: { label: 'Packaging Vendor', icon: Boxes, badge: 'B2B Portal', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
    researcher: { label: 'R&D / Science', icon: FlaskConical, badge: 'Lab Workbench', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' },
    regulator: { label: 'Regulator / Audit', icon: Scale, badge: 'Audit Ledger', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  }[currentRole];

  const RoleIcon = roleConfig.icon;

  // Role-specific navigation items
  const getNavItems = () => {
    switch (currentRole) {
      case 'farmer':
        return [
          { id: 'wizard', label: 'AI Wizard', icon: Sparkles },
          { id: 'dashboard', label: 'My Assistant', icon: Sprout },
          { id: 'qr', label: 'Batch QR', icon: QrCode },
          { id: 'sourcing', label: 'Find Packaging', icon: Search },
          { id: 'reports', label: 'Farmer Reports', icon: FileText },
        ];
      case 'producer':
        return [
          { id: 'wizard', label: 'AI Wizard', icon: Sparkles },
          { id: 'dashboard', label: 'Specification', icon: Factory },
          { id: 'laminate', label: 'Laminate Builder', icon: Layers },
          { id: 'library', label: 'Material Library', icon: BookOpen },
          { id: 'sourcing', label: 'Suppliers', icon: Search },
          { id: 'reports', label: 'Dossiers', icon: FileText },
        ];
      case 'manufacturer':
        return [
          { id: 'wizard', label: 'AI Wizard', icon: Sparkles },
          { id: 'dashboard', label: 'Inventory & Specs', icon: Boxes },
          { id: 'library', label: 'Material Catalog', icon: BookOpen },
          { id: 'sourcing', label: 'Customer Requests', icon: Search },
          { id: 'reports', label: 'Datasheets', icon: FileText },
        ];
      case 'researcher':
        return [
          { id: 'wizard', label: 'AI Wizard', icon: Sparkles },
          { id: 'dashboard', label: 'Research Workbench', icon: FlaskConical },
          { id: 'map', label: 'MAP Simulator', icon: Activity },
          { id: 'kinetics', label: 'Respiration & Diffusion', icon: Layers },
          { id: 'laminate', label: 'Laminate Modeling', icon: Layers },
          { id: 'library', label: 'Reference Data', icon: BookOpen },
        ];
      case 'regulator':
        return [
          { id: 'wizard', label: 'AI Wizard', icon: Sparkles },
          { id: 'dashboard', label: 'Audit Dashboard', icon: Scale },
          { id: 'qr', label: 'QR Verification', icon: QrCode },
          { id: 'dataquality', label: 'Dataset 5000 Audit', icon: Activity },
          { id: 'library', label: 'Compliance Specs', icon: BookOpen },
        ];
      default:
        return [];
    }
  };


  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => onSelectView('landing')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 border border-teal-600/40 p-1.5 flex items-center justify-center shadow-sm">
              <img src="/logo.svg" alt="PackSmart AI" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">PACKSMART</span>
                <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-teal-600 text-white tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Food Packaging Specification & Decision Support</p>
            </div>
          </div>

          {/* Role Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area: Role Selector & Mode Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Active Role Selector Pill */}
            <button
              onClick={openRoleModal}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] shadow-sm whitespace-nowrap ${roleConfig.color}`}
              title="Click to switch role / user persona"
            >
              <RoleIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-extrabold whitespace-nowrap">{roleConfig.label}</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 ml-1">
                Switch
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Scientific Provenance Indicator */}
            <div className="hidden lg:flex items-center space-x-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>ASTM / USDA Calibrated</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
