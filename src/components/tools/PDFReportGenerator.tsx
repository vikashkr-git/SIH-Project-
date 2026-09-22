import React from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Layers, 
  FileText,
  Calendar,
  Building
} from 'lucide-react';
import { RecommendationResult, UserRole } from '../../types';

interface PDFReportGeneratorProps {
  reportData: RecommendationResult;
  role: UserRole;
  onBack: () => void;
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({
  reportData,
  role,
  onBack,
}) => {
  const topChoice = reportData.top_recommendations[0];
  const query = reportData.query_summary;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workspace</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Role Format: <strong className="uppercase">{role}</strong>
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* The Printable Dossier Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Header Branding */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight">PACKSMART AI</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono uppercase font-bold">
                COMMERCIAL SPECIFICATION
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Intelligent Food Packaging Specification & Decision-Support System
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <div>Document No: <strong>DOC-2026-PK-{Math.floor(1000 + Math.random() * 9000)}</strong></div>
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Role Profile: <strong className="uppercase">{role}</strong></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Commodity</span>
            <span className="font-bold text-sm">{query.commodity}</span>
            <span className="text-[11px] text-slate-500 block">{query.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Storage Climate</span>
            <span className="font-bold text-sm">{query.storage_type}</span>
            <span className="text-[11px] text-slate-500 block">{query.storage_temp_c ?? 22}°C @ {query.relative_humidity_pct ?? 60}% RH</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Shelf Life</span>
            <span className="font-bold text-sm">{query.target_shelf_life_days} Days</span>
            <span className="text-[11px] text-slate-500 block">Transit: {query.transportation.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Decision Confidence</span>
            <span className="font-bold text-sm text-teal-700">{reportData.confidence_assessment.overall_confidence}</span>
            <span className="text-[11px] text-slate-500 block">Model {reportData.confidence_assessment.model_version}</span>
          </div>
        </div>

        {/* Section 2: Selected Packaging Specification */}
        <div className="space-y-4">
          <h3 className="font-bold text-base uppercase tracking-wider border-b border-slate-200 pb-2">
            1. Primary Packaging Specification: {topChoice.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="text-xs space-y-1">
                <span className="text-slate-500 block uppercase text-[10px] font-bold">Polymer Architecture</span>
                <span className="font-bold text-sm">{topChoice.structure}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 block text-[9px]">TOTAL THICKNESS</span>
                  <span className="font-bold text-sm">{topChoice.technical_specifications.thickness_um} µm</span>
                </div>
                <div className="p-2.5 rounded bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 block text-[9px]">OTR PERMEABILITY</span>
                  <span className="font-bold text-sm">{topChoice.technical_specifications.otr_value} cm³/m²·d</span>
                </div>
                <div className="p-2.5 rounded bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 block text-[9px]">WVTR PERMEABILITY</span>
                  <span className="font-bold text-sm">{topChoice.technical_specifications.wvtr_value} g/m²·d</span>
                </div>
                <div className="p-2.5 rounded bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 block text-[9px]">PUNCTURE FORCE</span>
                  <span className="font-bold text-sm">{topChoice.technical_specifications.puncture_resistance_n} N</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-center">
              <img src={topChoice.sample_photo_url} alt={topChoice.name} className="h-40 object-contain" />
            </div>
          </div>
        </div>

        {/* Section 3: Layer by Layer Material Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-base uppercase tracking-wider border-b border-slate-200 pb-2">
            2. Multilayer Structure & Function Breakdown
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
              <tr>
                <th className="p-2.5 border-b">Layer</th>
                <th className="p-2.5 border-b">Position</th>
                <th className="p-2.5 border-b">Substrate Polymer</th>
                <th className="p-2.5 border-b">Gauge (µm)</th>
                <th className="p-2.5 border-b">Functional Barrier Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {topChoice.material_composition.layers.map((l) => (
                <tr key={l.layer_no}>
                  <td className="p-2.5 font-bold font-mono">L{l.layer_no}</td>
                  <td className="p-2.5">{l.position}</td>
                  <td className="p-2.5 font-bold">{l.name}</td>
                  <td className="p-2.5 font-mono">{l.thickness_um} µm</td>
                  <td className="p-2.5 text-slate-600">{l.work}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Scientific Provenance & ASTM Calibration */}
        <div className="space-y-3">
          <h3 className="font-bold text-base uppercase tracking-wider border-b border-slate-200 pb-2">
            3. Scientific Provenance & Testing Methodology
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
            <div>• <strong>Standard Test Methods:</strong> Tested in conformity with {topChoice.scientific_provenance.astm_standard} (ASTM International barrier permeation standards).</div>
            <div>• <strong>Primary Literature Ref:</strong> {topChoice.scientific_provenance.source_ref} • DOI: {topChoice.scientific_provenance.doi}</div>
            <div>• <strong>FSSAI / Food Safety Conformity:</strong> IS 9845 / IS 1060 positive food-contact raw material formulation.</div>
          </div>
        </div>

        {/* Section 5: Regulatory Sign-Off & Legal Notice */}
        <div className="pt-6 border-t-2 border-slate-900 space-y-4">
          <div className="grid grid-cols-2 gap-8 text-xs font-mono">
            <div className="space-y-6">
              <div>PREPARED BY:</div>
              <div className="pt-4 border-b border-slate-400">PACKSMART AI SCIENTIFIC ENGINE</div>
            </div>
            <div className="space-y-6">
              <div>QUALITY & LABORATORY VERIFICATION:</div>
              <div className="pt-4 border-b border-slate-400">AUTHORIZED PACKAGING TECHNOLOGIST</div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed text-justify">
            <strong>Disclaimer:</strong> {reportData.disclaimer} This specification dossier is generated as predictive decision-support based on physical mass transfer principles and published ASTM permeabilities. Production batches must undergo physical heat-seal integrity and real-time migration testing prior to commercial release.
          </p>
        </div>

      </div>
    </div>
  );
};
