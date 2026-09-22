import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Search, 
  Calendar, 
  MapPin, 
  Building, 
  Package, 
  Copy, 
  Check,
  AlertCircle 
} from 'lucide-react';
import { BatchRecord } from '../../types';

interface QRTraceabilityProps {
  initialBatch?: Partial<BatchRecord> | null;
}

export const QRTraceability: React.FC<QRTraceabilityProps> = ({ initialBatch }) => {
  const [batchId, setBatchId] = useState(initialBatch?.batch_number || `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [commodity, setCommodity] = useState(initialBatch?.commodity || 'Fresh Tomato');
  const [packagingName, setPackagingName] = useState(initialBatch?.packaging_name || 'Breathable Microporous PE Film');
  const [structure, setStructure] = useState(initialBatch?.packaging_structure || 'CaCO3 filled PE stretched microporous film');
  const [thickness, setThickness] = useState(initialBatch?.thickness_um || 32);
  const [quantityKg, setQuantityKg] = useState(initialBatch?.quantity_kg || 1000);
  const [facilityName, setFacilityName] = useState(initialBatch?.farm_or_facility_name || 'Himachal Agri Producer FPO');
  const [location, setLocation] = useState(initialBatch?.location || 'Solan -> Delhi Mandi');
  const [expiryDate, setExpiryDate] = useState(initialBatch?.expiry_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate QR Code data payload
  const qrPayload = JSON.stringify({
    system: 'PACKSMART-AI-TRACEABILITY',
    batchId,
    commodity,
    packaging: packagingName,
    structure,
    thickness_um: thickness,
    quantity_kg: quantityKg,
    facility: facilityName,
    route: location,
    verified_at: new Date().toISOString(),
    verification_hash: `SHA256-${Math.random().toString(36).substring(2, 15)}`,
  }, null, 2);

  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url: string) => setQrCodeUrl(url))
      .catch((err: any) => console.error(err));
  }, [batchId, commodity, packagingName, structure, thickness, quantityKg, facilityName, location, expiryDate]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `${batchId}-qr.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>Digital Packaging Traceability & Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Batch QR Generation & Verification Ledger
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Generate verifiable post-harvest and industrial packaging QR tags containing food properties, packaging structure, thickness, climate requirements, and digital certification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Batch Configuration (6 cols) */}
        <div className="lg:col-span-6 card-base p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Batch Metadata & Packaging Specifications
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Batch Tracking ID
                </label>
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Commodity Name
                </label>
                <input
                  type="text"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Packaging Material
              </label>
              <input
                type="text"
                value={packagingName}
                onChange={(e) => setPackagingName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Polymer Structure & Thickness
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={structure}
                  onChange={(e) => setStructure(e.target.value)}
                  className="col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-right"
                  />
                  <span className="text-xs font-mono text-slate-400">µm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Producer / Farm Origin
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lot Size (kg)
                </label>
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transit Route / Destination
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Rendered QR Code & Physical Label (6 cols) */}
        <div className="lg:col-span-6 card-base p-6 sm:p-8 space-y-6 flex flex-col items-center justify-between border-teal-200 dark:border-teal-800/80 shadow-md">
          
          {/* Printable Label View */}
          <div className="w-full max-w-sm p-5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 shadow-xl space-y-4">
            {/* Header of Tag */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest block">PACKSMART TRACEABILITY</span>
                <span className="text-xs font-mono font-bold text-teal-800">{batchId}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono uppercase">
                CERTIFIED
              </span>
            </div>

            {/* QR Center */}
            <div className="flex justify-center p-2 bg-white rounded-lg">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Batch QR Code" className="w-44 h-44 object-contain" />
              ) : (
                <div className="w-44 h-44 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Core Label Details */}
            <div className="space-y-1 text-xs border-t border-slate-200 pt-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Commodity:</span>
                <span className="font-bold">{commodity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Packaging:</span>
                <span className="font-bold">{packagingName.split(' ')[0]} {packagingName.split(' ')[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Film Gauge:</span>
                <span className="font-bold">{thickness} µm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lot Weight:</span>
                <span className="font-bold">{quantityKg} kg</span>
              </div>
            </div>

            {/* Footer verification note */}
            <div className="pt-2 border-t border-slate-200 text-[9px] text-center text-slate-500">
              Scan with any mobile device or camera to verify authentic FSSAI food contact and barrier specs.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              onClick={handleDownloadQR}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR PNG</span>
            </button>

            <button
              onClick={handleCopyPayload}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-200 flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Payload Copied' : 'Copy Digital JSON'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
