import React from 'react';
import { UserRole } from '../../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Zap, 
  Sprout, 
  Factory, 
  Boxes, 
  FlaskConical, 
  Scale, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  BarChart3,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onStartWizard: () => void;
  openRoleModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onStartWizard,
  openRoleModal,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Next-Gen Packaging Decision-Support Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Smart Packaging Decisions. <br />
                <span className="text-teal-700 dark:text-teal-400">Powered by Food Science & AI.</span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Analyze food properties, storage conditions, and transportation requirements to discover packaging solutions scientifically engineered for your product.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartWizard}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 text-white dark:bg-teal-600 dark:text-white font-semibold text-sm hover:bg-slate-800 dark:hover:bg-teal-500 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>Get Packaging Recommendation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={openRoleModal}
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center space-x-2"
                >
                  <span>Select User Persona</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span>ASTM D3985 / F1249</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span>USDA ARS FoodData</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span>FSSAI / ISO Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Pipeline Graphic */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                  <span>SCIENTIFIC SPECIFICATION PIPELINE</span>
                  <span className="font-mono text-teal-600 dark:text-teal-400">PACKSMART-CORE</span>
                </div>

                {/* Pipeline Flow Steps */}
                <div className="space-y-3 mt-4">
                  {/* Step 1: Food Properties */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                        01
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Food Matrix Chemistry</div>
                        <div className="text-[11px] text-slate-500">Moisture %, Aw, Fat %, pH, Respiration</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Input</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-400">
                    <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                  </div>

                  {/* Step 2: Risk Analysis */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                        02
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Degradation Risk Analysis</div>
                        <div className="text-[11px] text-slate-500">Oxidation, Caking, Respiration, Transit Flex</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Model</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-400">
                    <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                  </div>

                  {/* Step 3: Packaging Barrier Requirements */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                        03
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Barrier Specification Matrix</div>
                        <div className="text-[11px] text-slate-500">Target OTR, WVTR, Puncture N, MAP Suitability</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">ASTM</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-400">
                    <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                  </div>

                  {/* Step 4: AI Recommendation */}
                  <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-600 dark:border-teal-500 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                        04
                      </div>
                      <div>
                        <div className="text-xs font-bold text-teal-900 dark:text-teal-200">Top 3 Ranked Solutions</div>
                        <div className="text-[11px] text-teal-700 dark:text-teal-400">Structure, Thickness, Sourcing & QR</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-600 text-white">Rank 1–3</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 font-mono">Zero hard-coded guesses • Multi-objective ranking</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW PACKSMART AI WORKS (6-Step Pipeline) */}
      <section className="py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Engineered Decision Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              How PackSmart AI Works
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
              Moving from raw food science to industrial packaging procurement in six systematic steps.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Input', desc: 'Food properties, target shelf life, storage climate, transit duration.' },
              { step: '02', title: 'Analyze', desc: 'Evaluates moisture sensitivity, lipid oxidation, respiration rates.' },
              { step: '03', title: 'Recommend', desc: 'Applies physics disqualification rules and scores material candidates.' },
              { step: '04', title: 'Compare', desc: 'Evaluates barrier trade-offs, OTR vs WVTR, tensile strength, and cost.' },
              { step: '05', title: 'Source', desc: 'Generates localized supplier queries with transparency verification flags.' },
              { step: '06', title: 'Report', desc: 'Generates export-ready PDF specifications and verifiable batch QR codes.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-extrabold text-teal-600 dark:text-teal-400">{item.step}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUILT FOR DIFFERENT USERS (5 Personas) */}
      <section className="py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Tailored Workspaces</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Engineered for Every Stakeholder
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-3">
              The entire application adapts its terminology, density, and tools to each persona.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { role: 'farmer', title: 'Farmer / FPO', icon: Sprout, desc: 'Visual, mobile-first produce assistant. Breathable pouch recommendations, harvest batch QR codes.' },
              { role: 'producer', title: 'Food Producer', icon: Factory, desc: 'Complete chemical input matrix, TOP 3 recommendations, layer anatomy, service-life vs shelf-life.' },
              { role: 'manufacturer', title: 'Packaging Vendor', icon: Boxes, desc: 'Register polymer specs, film rolls, OTR/WVTR datasheets, and match live customer requests.' },
              { role: 'researcher', title: 'R&D / Science', icon: FlaskConical, desc: 'MAP Headspace simulator, Michaelis-Menten respiration kinetics, and Fickian permeability engine.' },
              { role: 'regulator', title: 'Regulator / Audit', icon: Scale, desc: 'Batch traceability lookup, QR code verifier, and Dataset 5000 quality distribution audits.' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  onClick={() => onSelectRole(p.role as UserRole)}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-600/50 dark:hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-md"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                    <span>Open Mode</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PACKAGING INTELLIGENCE (Technical Barrier Standards) */}
      <section className="py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Packaging Intelligence</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                Standardized Mass-Transfer Barrier Metrics
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                PackSmart AI grounds recommendations in empirical permeabilities tested under strict ASTM and ISO climatic conditions. Every parameter is anchored in physical units.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Oxygen Transmission (OTR)</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-mono mt-1">cm³/(m²·day·atm)</div>
                  <div className="text-[11px] text-slate-500 mt-1">ASTM D3985 at 23°C, 0% RH. Essential for rancidity prevention.</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Water Vapor (WVTR)</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-mono mt-1">g/(m²·day)</div>
                  <div className="text-[11px] text-slate-500 mt-1">ASTM F1249 at 38°C, 90% RH. Prevents powder caking & sogginess.</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Carbon Dioxide (CO₂TR)</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-mono mt-1">cm³/(m²·day·atm)</div>
                  <div className="text-[11px] text-slate-500 mt-1">ASTM F2476. Regulates equilibrium in modified atmosphere produce.</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Mechanical Puncture</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-mono mt-1">Newtons (N)</div>
                  <div className="text-[11px] text-slate-500 mt-1">ASTM F392 / ASTM D1709. Resists bone puncture & transport flexing.</div>
                </div>
              </div>
            </div>

            {/* Visual Material Anatomy Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold tracking-wider text-slate-300 uppercase">Multilayer Laminate Anatomy</span>
                <span className="font-mono text-teal-400">PET / Al-Foil / PE</span>
              </div>

              <div className="space-y-3 mt-5">
                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Layer 1: PET (Polyethylene Terephthalate) • 12 µm</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">Outer Layer</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Provides printability, dimensional stability, and puncture resistance.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-teal-500/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-300">Layer 2: Aluminum Foil • 9 µm</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-900/60 text-teal-300">Barrier Core</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Total hermetic barrier to oxygen, moisture, and light (Zero UV transmission).</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Layer 3: LDPE (Low-Density Polyethylene) • 60 µm</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300">Sealant Layer</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Direct food-contact seal layer with broad heat-sealing temperature window.</p>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Total Thickness: <strong>81 µm</strong></span>
                <span className="text-teal-400 font-mono">OTR: 0.05 • WVTR: 0.02</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUSTAINABILITY TRADE-OFF MATRIX */}
      <section className="py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Circular Design</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Balancing Barrier vs Sustainability
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-3">
              We never blindly label packaging "eco-friendly." PackSmart AI evaluates the real trade-off between food waste reduction and recyclability streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-teal-600 dark:text-teal-400 font-bold text-sm mb-1">Mono-Material PE/PP</div>
              <div className="text-xs text-slate-500 font-mono mb-3">Code 4 / Code 5</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Single-polymer streams offer 100% mechanical recyclability, but require oriented or metallized coatings to achieve ultra-barrier protection.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-teal-600 dark:text-teal-400 font-bold text-sm mb-1">Non-Foil EVOH Laminate</div>
              <div className="text-xs text-slate-500 font-mono mb-3">Recyclable Barrier</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Replaces non-recyclable aluminum foil with EVOH (&lt; 5 wt%), retaining oxygen protection while conforming to municipal recycling streams.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-teal-600 dark:text-teal-400 font-bold text-sm mb-1">Certified Bio-Polymer (PLA/PBAT)</div>
              <div className="text-xs text-slate-500 font-mono mb-3">Compostable Stream</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                100% industrial compostable alternative ideal for short shelf-life fresh produce and organic bakery goods with high moisture tolerance.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-teal-600 dark:text-teal-400 font-bold text-sm mb-1">Post-Consumer PCR (rPET)</div>
              <div className="text-xs text-slate-500 font-mono mb-3">Circular Loop</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Utilizes up to 70% post-consumer recycled content, drastically reducing carbon footprint while maintaining optical clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-20 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Engineer the Ideal Packaging for Your Food?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Get instant scientific recommendations, layer-by-layer specifications, local sourcing queries, and verifiable batch QR codes in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartWizard}
              className="px-8 py-4 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-500 transition-all shadow-xl hover:scale-105 flex items-center space-x-2"
            >
              <span>Launch Packaging Recommendation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={openRoleModal}
              className="px-8 py-4 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm hover:bg-slate-700 transition-all"
            >
              <span>Explore Roles & Personas</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
