import React, { useState, useMemo } from 'react';
import { 
  UserRole, 
  RecommendationResult, 
  BatchRecord, 
  RecommendationFormState 
} from '../../types';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  QrCode, 
  FileText, 
  Layers, 
  Activity, 
  Info,
  Truck,
  Thermometer,
  ShieldCheck,
  Building2,
  TrendingDown,
  Check,
  Search,
  Warehouse,
  Navigation,
  Scale,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { calculateLocalRecommendation, getRecommendation, getPackagingPhotoUrl } from '../../services/recommendationEngine';
import { FOODS_CATALOG } from '../../data/foodsCatalog';
import { INDIAN_CROPS_CATALOG, IndianCrop } from '../../data/indianCrops';
import { calculateMandiDistance } from '../../data/mandiLocations';
import { 
  GeoLocationItem, 
  EXTENDED_SOURCE_REGIONS, 
  EXTENDED_APMC_MANDIS 
} from '../../services/mandiGeocodingService';
import { MandiRouteSelector } from '../farmer/MandiRouteSelector';

interface RecommendationWizardProps {
  initialRole?: UserRole;
  onGenerateQR: (batch: Partial<BatchRecord>) => void;
  onDownloadReport: (data: RecommendationResult) => void;
  onFindSourcing: (query: string) => void;
  onOpenLaminate: () => void;
  onOpenResearcherMap: () => void;
}

export const RecommendationWizard: React.FC<RecommendationWizardProps> = ({
  initialRole,
  onGenerateQR,
  onDownloadReport,
  onFindSourcing,
  onOpenLaminate,
  onOpenResearcherMap,
}) => {
  // Wizard Navigation:
  // 1: User Profile ("Aap kis type ke user hain?")
  // 2: Food Profile (✨ Food Commodity Characteristics matching screenshot)
  // 3: Storage Climate / Purpose (Store vs Mandi Sale)
  // 4: Transit Stress / Map Distance (Map distance auto calculation)
  // 5: Decision Goal (Optimization priorities)
  // 6: Recommendation Results (With special "Badi Wali Packing" for farmers)
  const [currentStep, setCurrentStep] = useState<number>(initialRole ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'farmer');

  // Loading & Result States
  const [loading, setLoading] = useState(false);
  const [recResult, setRecResult] = useState<RecommendationResult | null>(null);
  const [producerSelectedRank, setProducerSelectedRank] = useState<number>(1);
  const [producerViewMode, setProducerViewMode] = useState<'dossier' | 'compare'>('dossier');

  // Smooth scroll to top when step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // ----------------------------------------------------
  // FARMER SPECIFIC STATES
  // ----------------------------------------------------
  const [selectedCropId, setSelectedCropId] = useState<string>('crop_tomato');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'quintal'>('kg');
  const [weightInputValue, setWeightInputValue] = useState<number>(1000);
  const [farmerPurpose, setFarmerPurpose] = useState<'sale' | 'store'>('sale');
  const [sourceLocation, setSourceLocation] = useState<GeoLocationItem>(EXTENDED_SOURCE_REGIONS[0]);
  const [destinationMandi, setDestinationMandi] = useState<GeoLocationItem>(EXTENDED_APMC_MANDIS[0]);
  const [storageDurationDays, setStorageDurationDays] = useState<number>(30);
  const [storageFacility, setStorageFacility] = useState<'ambient_godown' | 'cold_storage'>('ambient_godown');

  // Computed total weight in KG
  const totalWeightKg = useMemo(() => {
    return weightUnit === 'quintal' ? weightInputValue * 100 : weightInputValue;
  }, [weightUnit, weightInputValue]);

  // Selected crop details from Indian Crops Catalog
  const selectedIndianCrop = useMemo(() => {
    return INDIAN_CROPS_CATALOG.find(c => c.id === selectedCropId) || INDIAN_CROPS_CATALOG[0];
  }, [selectedCropId]);

  // Map Road Distance Calculation
  const distanceInfo = useMemo(() => {
    return calculateMandiDistance(
      sourceLocation.lat,
      sourceLocation.lon,
      destinationMandi.lat,
      destinationMandi.lon
    );
  }, [sourceLocation, destinationMandi]);

  // Determine active bulk packaging recommendation for farmers
  const farmerRecommendedPackaging = useMemo(() => {
    if (farmerPurpose === 'store') {
      return selectedIndianCrop.storagePackaging;
    }
    if (distanceInfo.distanceKm > 250) {
      return selectedIndianCrop.longDistancePackaging;
    }
    return selectedIndianCrop.primaryBulkPackaging;
  }, [farmerPurpose, selectedIndianCrop, distanceInfo]);

  // Sacks & cost calculations for farmer
  const totalBagsNeeded = Math.ceil(totalWeightKg / farmerRecommendedPackaging.capacityKg);
  const estimatedCostMin = totalBagsNeeded * farmerRecommendedPackaging.estimatedCostMin;
  const estimatedCostMax = totalBagsNeeded * farmerRecommendedPackaging.estimatedCostMax;

  // ----------------------------------------------------
  // GENERAL PROXIMATE STATE (Step 2)
  // ----------------------------------------------------
  const [selectedCropName, setSelectedCropName] = useState('Tomato (Fresh Produce)');
  const [category, setCategory] = useState('Fresh Produce');
  const [moisturePct, setMoisturePct] = useState(94.5);
  const [fatPct, setFatPct] = useState(0.2);
  const [proteinPct, setProteinPct] = useState(0.9);
  const [acidityPh, setAcidityPh] = useState(4.3);
  const [respirationRate, setRespirationRate] = useState(18.5);
  const [targetShelfLifeDays, setTargetShelfLifeDays] = useState(14);

  // ----------------------------------------------------
  // STORAGE CLIMATE STATE (Step 3)
  // ----------------------------------------------------
  const [storageType, setStorageType] = useState('Ambient');
  const [storageTempC, setStorageTempC] = useState(16);
  const [relativeHumidityPct, setRelativeHumidityPct] = useState(85);

  // ----------------------------------------------------
  // TRANSIT STRESS STATE (Step 4)
  // ----------------------------------------------------
  const [transportationMode, setTransportationMode] = useState('Local_Truck');
  const [stackingLayers, setStackingLayers] = useState('Standard (4–5 Boxes/Sacks)');
  const [roadSeverity, setRoadSeverity] = useState('Medium Vibration (Mandi Rural Haul)');

  // ----------------------------------------------------
  // DECISION GOAL STATE (Step 5)
  // ----------------------------------------------------
  const [optimizationGoal, setOptimizationGoal] = useState('Balanced');

  // Quick picks list based on role
  const quickPicks = useMemo(() => {
    if (selectedRole === 'farmer') {
      return [
        { label: 'Tamatar', fullName: 'Tomato', cropId: 'crop_tomato', m: 94.5, f: 0.2, p: 0.9, ph: 4.3, cat: 'Vegetable' },
        { label: 'Aaloo', fullName: 'Potato', cropId: 'crop_potato', m: 79.0, f: 0.1, p: 2.0, ph: 5.6, cat: 'Vegetable' },
        { label: 'Pyaaz', fullName: 'Onion', cropId: 'crop_onion', m: 89.0, f: 0.1, p: 1.1, ph: 5.4, cat: 'Vegetable' },
        { label: 'Aam', fullName: 'Mango', cropId: 'crop_mango', m: 83.5, f: 0.4, p: 0.8, ph: 4.0, cat: 'Fruit' },
        { label: 'Kela', fullName: 'Banana', cropId: 'crop_banana', m: 74.0, f: 0.3, p: 1.3, ph: 4.8, cat: 'Fruit' },
        { label: 'Seb', fullName: 'Apple', cropId: 'crop_apple', m: 85.0, f: 0.2, p: 0.3, ph: 3.8, cat: 'Fruit' },
        { label: 'Lahsun', fullName: 'Garlic', cropId: 'crop_garlic', m: 65.0, f: 0.5, p: 6.4, ph: 6.0, cat: 'Vegetable' },
        { label: 'Hari Mirch', fullName: 'Green Chilli', cropId: 'crop_green_chilli', m: 88.0, f: 0.4, p: 1.9, ph: 5.2, cat: 'Vegetable' },
        { label: 'Gehun', fullName: 'Wheat', cropId: 'crop_wheat', m: 12.0, f: 1.5, p: 12.0, ph: 6.2, cat: 'Grain_Pulse' },
        { label: 'Dhaan / Rice', fullName: 'Paddy / Rice', cropId: 'crop_paddy', m: 13.0, f: 0.7, p: 7.1, ph: 6.4, cat: 'Grain_Pulse' },
      ];
    }
    return [
      { label: 'Tomato', fullName: 'Tomato (Fresh Produce)', cat: 'Fresh Produce', m: 94.5, f: 0.2, p: 0.9, ph: 4.3, resp: 18.5, shelf: 14, temp: 13 },
      { label: 'Potato Chips', fullName: 'Potato Chips (Snack)', cat: 'Snacks', m: 2.0, f: 34.5, p: 6.5, ph: 6.2, resp: 0.0, shelf: 180, temp: 22 },
      { label: 'Milk Powder', fullName: 'Milk Powder (Dairy)', cat: 'Dairy', m: 3.5, f: 26.5, p: 25.0, ph: 6.6, resp: 0.0, shelf: 365, temp: 20 },
      { label: 'Strawberries', fullName: 'Strawberries (Fresh)', cat: 'Fresh Produce', m: 91.0, f: 0.3, p: 0.7, ph: 3.5, resp: 35.0, shelf: 7, temp: 4 },
      { label: 'Fresh Fish', fullName: 'Fresh Fish (Fillet)', cat: 'Meat', m: 76.0, f: 4.5, p: 19.5, ph: 6.5, resp: 0.0, shelf: 8, temp: 2 },
      { label: 'Honey', fullName: 'Honey (Syrup)', cat: 'Sweeteners', m: 17.2, f: 0.0, p: 0.3, ph: 3.9, resp: 0.0, shelf: 730, temp: 24 },
    ];
  }, [selectedRole]);

  // Apply quick pick
  const applyQuickPick = (item: any) => {
    if (selectedRole === 'farmer') {
      setSelectedCropId(item.cropId);
      setSelectedCropName(item.fullName);
      setCategory(item.cat);
      setMoisturePct(item.m);
      setFatPct(item.f);
      setProteinPct(item.p);
      setAcidityPh(item.ph);
    } else {
      setSelectedCropName(item.fullName);
      setCategory(item.cat);
      setMoisturePct(item.m);
      setFatPct(item.f);
      setProteinPct(item.p);
      setAcidityPh(item.ph);
      setRespirationRate(item.resp || 0);
      setTargetShelfLifeDays(item.shelf || 30);
      setStorageTempC(item.temp || 20);
    }
  };

  // Sync crop selection when dropdown changes in Farmer mode
  const handleFarmerCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const crop = INDIAN_CROPS_CATALOG.find(c => c.id === cropId);
    if (crop) {
      setSelectedCropName(crop.name);
      setCategory(crop.category);
      // Populate standard proximate moisture/fat/protein
      if (crop.category === 'Vegetable') {
        setMoisturePct(crop.id.includes('potato') ? 79 : crop.id.includes('garlic') ? 65 : 92);
        setFatPct(0.2);
        setProteinPct(crop.id.includes('garlic') ? 6.4 : 1.5);
        setAcidityPh(crop.id.includes('tomato') ? 4.3 : 5.8);
      } else if (crop.category === 'Fruit') {
        setMoisturePct(84);
        setFatPct(0.3);
        setProteinPct(0.8);
        setAcidityPh(3.8);
      } else {
        // Grains & Pulses
        setMoisturePct(12.5);
        setFatPct(1.8);
        setProteinPct(11.5);
        setAcidityPh(6.3);
      }
      setTargetShelfLifeDays(crop.shelfLifeDaysAmbient);
      setStorageTempC(crop.idealTempC);
    }
  };

  // USDA autofill trigger for Producer/Expert mode
  const handleUSDAAutofill = () => {
    const match = FOODS_CATALOG.find(f => 
      f.commodity.toLowerCase().includes(selectedCropName.toLowerCase().split(' ')[0])
    );
    if (match) {
      setMoisturePct(match.moisture_pct);
      setFatPct(match.fat_pct);
      setProteinPct(match.protein_pct);
      setAcidityPh(match.ph);
      setRespirationRate(match.respiration_rate_val);
      setTargetShelfLifeDays(match.standard_shelf_life_days);
      setStorageTempC(match.optimal_temp_c);
      setRelativeHumidityPct(match.optimal_rh_pct);
      setCategory(match.category);
    }
  };

  // Run Recommendation Analysis
  const handleComputeRecommendation = async () => {
    setLoading(true);

    const formState: RecommendationFormState = {
      commodity: selectedRole === 'farmer' ? selectedIndianCrop.name : selectedCropName.split(' (')[0],
      category: selectedRole === 'farmer' ? selectedIndianCrop.category : category,
      moisture_pct: moisturePct,
      fat_pct: fatPct,
      protein_pct: proteinPct,
      ph: acidityPh,
      respiration_rate: respirationRate,
      shelf_life_days: selectedRole === 'farmer' ? selectedIndianCrop.shelfLifeDaysAmbient : targetShelfLifeDays,
      storage_temp_c: storageTempC,
      relative_humidity_pct: relativeHumidityPct,
      storage_type: selectedRole === 'farmer' 
        ? (farmerPurpose === 'store' ? (storageFacility === 'cold_storage' ? 'Chilled' : 'Ambient') : 'Ambient')
        : storageType,
      transportation: selectedRole === 'farmer'
        ? (farmerPurpose === 'sale' ? (distanceInfo.distanceKm > 250 ? 'Long_Distance' : 'Local_Truck') : 'Local_Truck')
        : transportationMode,
      optimization_goal: optimizationGoal,
      user_role: selectedRole,
      harvest_quantity_kg: totalWeightKg,
      packaging_format: selectedRole === 'farmer' ? 'bulk' : 'retail',
    };

    try {
      const res = await getRecommendation(formState);
      setRecResult(res);
      setCurrentStep(6);
    } catch (err) {
      console.warn('Using local calculations:', err);
      const res = calculateLocalRecommendation(formState);
      setRecResult(res);
      setCurrentStep(6);
    } finally {
      setLoading(false);
    }
  };

  // Step 2-5 Nav steps
  const navSteps = [
    { number: 1, id: 2, label: selectedRole === 'farmer' ? 'Fasal & Wazan' : 'Food Profile' },
    { number: 2, id: 3, label: selectedRole === 'farmer' ? 'Purpose & Storage' : 'Storage Climate' },
    { number: 3, id: 4, label: selectedRole === 'farmer' ? 'Mandi Map Route' : 'Transit Stress' },
    { number: 4, id: 5, label: selectedRole === 'farmer' ? 'Kharcha & Priority' : 'Decision Goal' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">

      {/* ========================================================================= */}
      {/* STEP 1: USER ROLE VERIFICATION ("AAP KIS TYPE KE USER HAIN?")            */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              Profile Verification • Aap Kis Type Ke User Hain?
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pehle Batayein, Aap Kaun Hain?
            </h1>
            <p className="text-sm text-slate-400">
              Select your role. If you are a <strong className="text-yellow-400">Farmer</strong>, PackSmart AI will configure <strong>Badi Wali Packing (20–50 kg master sacks/liners)</strong> for your Indian crops instead of small retail pouches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Option 1: Farmer / FPO */}
            <div
              onClick={() => {
                setSelectedRole('farmer');
                setCurrentStep(2);
              }}
              className="bg-[#131B2E] p-6 rounded-2xl border-2 border-slate-800 hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🌾
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                    Option 1 • Kisan / Mandi
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Farmer / FPO (Kisan)
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Post-Harvest Produce & Mandi Dispatch
                  </p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I harvest or aggregate Indian crops (Tomato, Potato, Onion, Mango, Wheat). I need <strong className="text-yellow-400">badi wali packing</strong> (20–50 kg sacks/liners), GPS distance calculation, and batch QR codes for mandi transport.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div className="text-yellow-400/90 font-medium">✓ All Indian Crops & Total Weight</div>
                  <div>✓ Badi Wali Packing (20–50 kg)</div>
                  <div>✓ GPS Road Distance & Travel Time</div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-yellow-400">
                <span>Continue as Farmer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Option 2: Food Producer / Processor */}
            <div
              onClick={() => {
                setSelectedRole('producer');
                setCurrentStep(2);
              }}
              className="bg-[#131B2E] p-6 rounded-2xl border-2 border-slate-800 hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.2)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-400/20 text-teal-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏭
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Option 2 • FMCG / Brand
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Food Producer / Processor
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Packaged Food & Brand Manufacturer
                  </p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I manufacture packaged consumer foods (Potato Chips, Milk Powder, Snacks). Need consumer retail pouches (250g–2kg) with barrier optimization (OTR & WVTR).
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div>✓ Retail Pillow / Stand-up Pouches</div>
                  <div>✓ Proximate Lipid Rancidity Modeling</div>
                  <div>✓ Multi-Objective Optimization</div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400">
                <span>Continue as Producer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Option 3: Packaging Expert / R&D */}
            <div
              onClick={() => {
                setSelectedRole('researcher');
                onOpenResearcherMap();
              }}
              className="bg-[#131B2E] p-6 rounded-2xl border-2 border-slate-800 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.2)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-400/20 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🔬
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Option 3 • R&D & Engineering
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Packaging Expert / R&D
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Polymer & Film Technologist
                  </p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I don't need consumer suggestions. I need deep <strong className="text-purple-400">layer-by-layer breakdown</strong> (why each material was used), lifespan/temperature/pressure limits, and <strong className="text-purple-400">multi-material side-by-side comparison</strong> with Green vs Red highlights.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div className="text-purple-300 font-medium">✓ Micro-Layer Breakdown & Why Used</div>
                  <div>✓ Side-by-Side Comparison (Green vs Red)</div>
                  <div>✓ Lifespan, Thermal & Puncture Force Limits</div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Open R&D Studio Directly</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Option 4: Regulatory Inspector / Auditor */}
            <div
              onClick={() => {
                setSelectedRole('regulator');
                setCurrentStep(2);
              }}
              className="bg-[#131B2E] p-6 rounded-2xl border-2 border-slate-800 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.2)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⚖️
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Option 4 • Compliance
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Quality Auditor / Regulator
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Traceability & Migration Standards
                  </p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I audit packaging compliance, verify digital QR traceability, or validate global food contact standards (IS 9845 / FDA 21 CFR / ISO 22000).
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div>✓ IS 9845 Overall Migration Limits</div>
                  <div>✓ Cryptographic Batch QR Verification</div>
                  <div>✓ Dataset Integrity Audit</div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Continue as Auditor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEPS 2 TO 5: MULTI-STEP NAVIGATION CONTAINER                            */}
      {/* ========================================================================= */}
      {currentStep >= 2 && currentStep <= 5 && (
        <div className="bg-[#0B0F19] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8 animate-fadeIn">
          
          {/* Top Step Pill Navigation with Glowing Yellow Pill & Underline Progress */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {navSteps.map((s) => {
                  const isActive = currentStep === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentStep(s.id)}
                      className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                        isActive
                          ? 'bg-[#FACC15] text-slate-950 shadow-[0_0_25px_rgba(250,204,21,0.4)] scale-105'
                          : 'bg-[#131B2E] border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold ${
                        isActive ? 'bg-slate-950 text-[#FACC15]' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.number}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Profile Badge & Switcher */}
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-[#131B2E] text-xs font-bold text-yellow-400 hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>User Type: {selectedRole.toUpperCase()} (Switch)</span>
              </button>
            </div>

            {/* Glowing Gradient Progress Bar Underneath Navigation */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#FACC15] via-[#EC4899] to-[#06B6D4] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 2: FOOD PROFILE / FASAL KI JAANKARI                                   */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header with Sparkle Icon */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xl sm:text-2xl font-black text-white">
                  <span className="text-[#FACC15] text-2xl">✨</span>
                  <h2>{selectedRole === 'farmer' ? 'Fasal Ki Jaankari Aur Kul Wazan' : 'Food Commodity Characteristics'}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {selectedRole === 'farmer' 
                    ? 'Apni fasal chunein aur kul katai wazan darj karein. System iske mutabiq badi bori aur rate nikalega.' 
                    : 'Select standard benchmark foods from reference database or adjust proximate parameters.'}
                </p>
              </div>

              {/* Special Researcher Banner */}
              {selectedRole === 'researcher' && (
                <div className="bg-purple-950/40 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-purple-400 font-black text-sm">
                      <span className="text-lg">🔬</span>
                      <span>Packaging Expert & R&D Mode Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenResearcherMap}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-105"
                    >
                      <span>Open R&D Deep-Dive & Comparison Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Researchers do not need consumer packaging suggestions. Use our dedicated studio to inspect layer-by-layer polymer architectures, understand <em>why each material is used</em>, evaluate physical pressure/force limits, and run <strong>multi-material side-by-side benchmark comparisons with Green (Superior) vs Red (Weaker) highlights</strong>.
                  </p>
                </div>
              )}

              {/* Quick Picks Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
                  QUICK PICKS:
                </span>
                {quickPicks.map((qp: any) => {
                  const isSelected = selectedRole === 'farmer' 
                    ? selectedCropId === qp.cropId 
                    : selectedCropName === qp.fullName;
                  return (
                    <button
                      key={qp.label}
                      type="button"
                      onClick={() => applyQuickPick(qp)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#FACC15] text-slate-950 shadow-[0_0_15px_rgba(250,204,21,0.35)] scale-105'
                          : 'bg-[#131B2E] border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {qp.label}
                    </button>
                  );
                })}
              </div>

              {/* Inputs Row */}
              {selectedRole === 'farmer' ? (
                /* FARMER MODE: CROP DROPDOWN (ONLY INDIAN CROPS) + TOTAL WEIGHT */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Indian Crop Picker (Strictly Crops, No Snacks/Meat/Dairy) */}
                  <div className="md:col-span-7 bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        🌾 Apni Fasal Chunein (Select Indian Crop)
                      </label>
                      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                        {INDIAN_CROPS_CATALOG.length} Indian Crops Available
                      </span>
                    </div>
                    <select
                      value={selectedCropId}
                      onChange={(e) => handleFarmerCropChange(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-yellow-400"
                    >
                      <optgroup label="🥦 Sabziyan (Vegetables)">
                        {INDIAN_CROPS_CATALOG.filter(c => c.category === 'Vegetable').map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.hindiName})</option>
                        ))}
                      </optgroup>
                      <optgroup label="🍎 Phal (Fruits)">
                        {INDIAN_CROPS_CATALOG.filter(c => c.category === 'Fruit').map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.hindiName})</option>
                        ))}
                      </optgroup>
                      <optgroup label="🌾 Anaaj & Dalein (Grains & Pulses)">
                        {INDIAN_CROPS_CATALOG.filter(c => c.category === 'Grain_Pulse').map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.hindiName})</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Harvest Weight Input with Kg / Quintal Toggle */}
                  <div className="md:col-span-5 bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        ⚖️ Kul Fasal Ka Wazan (Harvest Weight)
                      </label>
                      <span className="font-mono text-xs font-bold text-yellow-400">
                        = {totalWeightKg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-7">
                        <input
                          type="number"
                          min="1"
                          step="10"
                          value={weightInputValue}
                          onChange={(e) => setWeightInputValue(Math.max(1, parseFloat(e.target.value) || 0))}
                          className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-base font-black font-mono text-yellow-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div className="col-span-5 flex items-center bg-[#0B0F19] p-1 rounded-xl border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setWeightUnit('kg')}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                            weightUnit === 'kg' 
                              ? 'bg-yellow-400 text-slate-950 font-black' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('quintal')}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                            weightUnit === 'quintal' 
                              ? 'bg-yellow-400 text-slate-950 font-black' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          क्विंटल
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* PRODUCER / EXPERT MODE: COMMODITY + USDA AUTOFILL */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        Commodity Name
                      </label>
                      <button
                        type="button"
                        onClick={handleUSDAAutofill}
                        className="px-2.5 py-0.5 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 text-[10px] font-extrabold uppercase tracking-wider transition-colors"
                      >
                        USDA AUTOFILL
                      </button>
                    </div>
                    <select
                      value={selectedCropName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCropName(val);
                        const qp = quickPicks.find((q: any) => q.fullName === val || q.label === val);
                        if (qp) applyQuickPick(qp);
                      }}
                      className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-yellow-400"
                    >
                      {quickPicks.map((q: any) => (
                        <option key={q.fullName} value={q.fullName}>{q.fullName}</option>
                      ))}
                      {FOODS_CATALOG.filter(f => !quickPicks.some((q: any) => q.fullName.includes(f.commodity))).map(f => (
                        <option key={f.id} value={`${f.commodity} (${f.category})`}>
                          {f.commodity} ({f.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      Food Category
                    </label>
                    <div className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-200">
                      {category}
                    </div>
                  </div>
                </div>
              )}

              {/* 4 Colored Metric Cards (Exact match to screenshot!) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Moisture % -> Bold Pink #EC4899 */}
                <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
                  <div className="text-xs font-semibold text-slate-400">
                    Moisture (%)
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePct}
                    onChange={(e) => setMoisturePct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black text-[#EC4899] font-mono focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Transpiration moisture pool</div>
                </div>

                {/* Fat / Lipid % -> Bold Warm Yellow #FACC15 */}
                <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
                  <div className="text-xs font-semibold text-slate-400">
                    Fat / Lipid (%)
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={fatPct}
                    onChange={(e) => setFatPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black text-[#FACC15] font-mono focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Lipid auto-oxidation risk</div>
                </div>

                {/* Protein % -> Bold Cyan #06B6D4 */}
                <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
                  <div className="text-xs font-semibold text-slate-400">
                    Protein (%)
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={proteinPct}
                    onChange={(e) => setProteinPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black text-[#06B6D4] font-mono focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Enzymatic decay kinetics</div>
                </div>

                {/* Acidity (pH) -> Bold Emerald Green #10B981 */}
                <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
                  <div className="text-xs font-semibold text-slate-400">
                    Acidity (pH)
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={acidityPh}
                    onChange={(e) => setAcidityPh(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black text-[#10B981] font-mono focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Microbial proliferation safety</div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to User Type</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 text-xs font-black hover:bg-yellow-300 transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                >
                  <span>Next: {selectedRole === 'farmer' ? 'Purpose & Storage' : 'Storage Climate'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: STORAGE CLIMATE / FARMER PURPOSE (STORE VS MANDI SALE)            */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xl sm:text-2xl font-black text-white">
                  <span className="text-[#06B6D4] text-2xl">🌡️</span>
                  <h2>{selectedRole === 'farmer' ? 'Fasal Ka Purpose Aur Storage Ki Jaankari' : 'Storage Climate & Atmosphere Controls'}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {selectedRole === 'farmer'
                    ? 'Pehle batayein aap fasal ko godown mein store karna chahte hain ya mandi mein bechna chahte hain.'
                    : 'Configure post-harvest holding temperature and relative humidity to model transpiration.'}
                </p>
              </div>

              {selectedRole === 'farmer' ? (
                /* FARMER SPECIFIC PURPOSE FLOW */
                <div className="space-y-5">
                  {/* Purpose Question: Store vs Mandi Sale */}
                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">
                      1. Aap Fasal Ka Kya Karna Chahte Hain? (Choose Purpose)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setFarmerPurpose('sale')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 ${
                          farmerPurpose === 'sale'
                            ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                            : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Truck className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm font-black text-white">Mandi Mein Bechna Hai (Transit Sale)</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Fasal ko gaadi mein load karke mandi le jaana hai. System road distance measure karke packaging suggest karega.
                        </p>
                      </div>

                      <div
                        onClick={() => setFarmerPurpose('store')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 ${
                          farmerPurpose === 'store'
                            ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                            : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Warehouse className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm font-black text-white">Store Karna Hai (Godown / Cold Storage)</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Bhav badhne tak godown ya cold storage mein rakhna hai.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* If Store: Storage Details */}
                  {farmerPurpose === 'store' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-2">
                        <label className="text-xs font-bold text-slate-300 block">
                          Kitne Din Store Karna Hai?
                        </label>
                        <select
                          value={storageDurationDays}
                          onChange={(e) => setStorageDurationDays(parseInt(e.target.value))}
                          className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white"
                        >
                          <option value={15}>15 Din Tak (Short Term)</option>
                          <option value={30}>1 Mahina (30 Din)</option>
                          <option value={60}>2 Mahine (60 Din)</option>
                          <option value={120}>3–4 Mahine (Long Season Storage)</option>
                        </select>
                      </div>

                      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-2">
                        <label className="text-xs font-bold text-slate-300 block">
                          Storage Facility Kaisi Hai?
                        </label>
                        <select
                          value={storageFacility}
                          onChange={(e) => setStorageFacility(e.target.value as any)}
                          className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white"
                        >
                          <option value="ambient_godown">Shaded Godown / Chawl (Normal Room Temp)</option>
                          <option value="cold_storage">Cold Storage (Controlled Chilled 4–10°C)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Temperature Control Question: ONLY ASK IF CROP NEEDS TEMP CONTROL */}
                  {selectedIndianCrop.needsTempControl ? (
                    <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5 space-y-2 animate-fadeIn">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Thermometer className="w-4 h-4" />
                        <span>Temperature-Sensitive Crop Notice ({selectedIndianCrop.hindiName})</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedIndianCrop.hindiName} garam dhoop mein jaldi gal sakti hai (Adarsh Tapmaan: <strong>{selectedIndianCrop.idealTempC}°C</strong>). Packaging mein <strong>anti-sweat perforated liner</strong> aur chhed waali packaging use ki jaayegi taaki pasina na bane.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        <strong>No Cold Storage Needed:</strong> {selectedIndianCrop.hindiName} normal room temperature par safe rehti hai. Iske liye cooling temperature set karne ki zaroorat nahi hai.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* PRODUCER / EXPERT SLIDERS */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">
                      Storage Environment Type
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'Ambient', label: 'Covered Mandi Shed / Ambient (15–32°C)', desc: 'Natural air flow, room temperature godown' },
                        { id: 'Chilled', label: 'Cold Storage / Chilled (4–12°C)', desc: 'Controlled refrigeration for fruits & vegetables' },
                        { id: 'Frozen', label: 'Sub-Zero Frozen (< -18°C)', desc: 'Cryogenic frozen seafood, meat, or vegetables' },
                      ].map((env) => (
                        <div
                          key={env.id}
                          onClick={() => setStorageType(env.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            storageType === env.id
                              ? 'bg-cyan-950/40 border-cyan-400 text-white'
                              : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{env.label}</div>
                          <div className="text-[11px] text-slate-500">{env.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">
                        Storage Temperature (°C)
                      </label>
                      <span className="text-lg font-black text-cyan-400 font-mono">
                        {storageTempC} °C
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-25"
                      max="45"
                      value={storageTempC}
                      onChange={(e) => setStorageTempC(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>-25°C Frozen</span>
                      <span>4°C Chilled</span>
                      <span>22°C Room</span>
                      <span>45°C Hot Mandi</span>
                    </div>
                  </div>

                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">
                        Relative Humidity (RH %)
                      </label>
                      <span className="text-lg font-black text-cyan-400 font-mono">
                        {relativeHumidityPct} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="98"
                      value={relativeHumidityPct}
                      onChange={(e) => setRelativeHumidityPct(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>30% Dry</span>
                      <span>65% Standard</span>
                      <span>90% Fresh Produce</span>
                      <span>98% Saturated</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: {selectedRole === 'farmer' ? 'Fasal & Wazan' : 'Food Profile'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 text-xs font-black hover:bg-yellow-300 transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                >
                  <span>Next: {selectedRole === 'farmer' ? 'Mandi Map Route' : 'Transit Stress'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: TRANSIT STRESS / MAP DISTANCE (AUTOMATIC GPS MEASUREMENT)          */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xl sm:text-2xl font-black text-white">
                  <span className="text-[#EC4899] text-2xl">🚛</span>
                  <h2>{selectedRole === 'farmer' ? 'Mandi Ka Rasta Aur GPS Distance' : 'Transit Stress & Physical Durability'}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {selectedRole === 'farmer'
                    ? 'Map coordinates se road distance measure karke packaging shock durability tay ki jaayegi.'
                    : 'Select transit distance and mechanical stacking stresses.'}
                </p>
              </div>

              {selectedRole === 'farmer' ? (
                /* FARMER MAP DISTANCE FLOW */
                <div className="space-y-5">
                  {farmerPurpose === 'sale' ? (
                    <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5">
                      <MandiRouteSelector
                        initialSource={sourceLocation}
                        initialMandi={destinationMandi}
                        onRouteChange={(routeData) => {
                          setSourceLocation(routeData.sourceLocation);
                          setDestinationMandi(routeData.destinationMandi);
                        }}
                      />
                    </div>
                  ) : (
                    /* If Farmer Purpose is Store */
                    <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                      <div className="text-3xl">🏢</div>
                      <h3 className="text-base font-bold text-white">Local Farm-to-Godown Transfer Selected</h3>
                      <p className="text-xs text-slate-400 max-w-xl mx-auto">
                        Aapne store karne ka option chuna hai ({storageDurationDays} din). Highway transit shocks nahi honge, isliye stacking load aur godown ventilation ke mutabiq packing suggest ki jaayegi.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* PRODUCER / EXPERT TRANSIT FLOW */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">
                      Transit Distance & Logistics Route
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'Local_Truck', label: 'Local Mandi Truck (< 50 km / 2 hours)', desc: 'Short-distance haul to local distribution yard' },
                        { id: 'Long_Distance', label: 'Inter-State Highway Haul (100–600 km / 12–24h)', desc: 'Rough roads, prolonged vibration stress' },
                        { id: 'Export_Air', label: 'Cold-Chain Reefer Truck / Export (> 1000 km)', desc: 'Palletized multi-tier stacking' },
                      ].map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setTransportationMode(t.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            transportationMode === t.id
                              ? 'bg-pink-950/40 border-pink-400 text-white'
                              : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{t.label}</div>
                          <div className="text-[11px] text-slate-500">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-2">
                        Vertical Stacking Load
                      </label>
                      <select
                        value={stackingLayers}
                        onChange={(e) => setStackingLayers(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-white"
                      >
                        <option value="Standard (4–5 Boxes/Sacks)">Standard 4–5 Layers</option>
                        <option value="Heavy (6–8 Layers Sacks)">Heavy 6–8 Layers</option>
                        <option value="Double-Stacked Pallets">Double-Stacked Pallets</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-2">
                        Road Severity & Handling
                      </label>
                      <select
                        value={roadSeverity}
                        onChange={(e) => setRoadSeverity(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-white"
                      >
                        <option value="Smooth Paved Highway">Smooth Paved Highway</option>
                        <option value="Medium Vibration (Mandi Rural Haul)">Medium Vibration (Rural Mandi Haul)</option>
                        <option value="Severe Rough Roads (High Flex-Fatigue)">Severe Rough Roads</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: {selectedRole === 'farmer' ? 'Purpose & Storage' : 'Storage Climate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 text-xs font-black hover:bg-yellow-300 transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                >
                  <span>Next: {selectedRole === 'farmer' ? 'Kharcha & Priority' : 'Decision Goal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: DECISION GOAL / PRIORITY                                         */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xl sm:text-2xl font-black text-white">
                  <span className="text-[#10B981] text-2xl">🎯</span>
                  <h2>{selectedRole === 'farmer' ? 'Packaging Ka Kharcha Aur Priority' : 'Decision Goal & Priority Constraints'}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {selectedRole === 'farmer' 
                    ? 'Chunein ki aapko sabse kam kharcha chahiye ya fasal ki 100% suraksha.' 
                    : 'Specify your primary optimization objective.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: 'Balanced',
                    title: selectedRole === 'farmer' ? 'Balanced (Sahi Daam & Suraksha)' : 'Balanced Optimization',
                    icon: '⚖️',
                    desc: selectedRole === 'farmer' ? 'Suraksha aur bori ke daam ke beech behtareen santulan.' : 'Optimal trade-off between preservation and cost.',
                  },
                  {
                    id: 'Cost',
                    title: selectedRole === 'farmer' ? 'Sabse Kam Kharcha' : 'Lowest Packaging Cost',
                    icon: '💰',
                    desc: selectedRole === 'farmer' ? 'Per-bori kharcha sabse kam taaki mandi munafa badhe.' : 'Minimizes packaging expense per kg of harvest.',
                  },
                  {
                    id: 'Performance',
                    title: selectedRole === 'farmer' ? 'Puri Suraksha (Zero Daag)' : 'Maximum Protection',
                    icon: '🛡️',
                    desc: selectedRole === 'farmer' ? 'Fasal ko dabne aur galne se 100% bachaav.' : 'Highest barrier and shock protection.',
                  },
                  {
                    id: 'Sustainability',
                    title: selectedRole === 'farmer' ? '100% Desi / Recyclable Bori' : '100% Recyclable Eco-Friendly',
                    icon: '🌿',
                    desc: selectedRole === 'farmer' ? 'Paryavaran-anukool aur baar-baar use hone wali bori.' : 'Prioritizes recyclable mono-materials.',
                  },
                ].map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setOptimizationGoal(g.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      optimizationGoal === g.id
                        ? 'bg-emerald-950/40 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                        : 'bg-[#131B2E] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-3xl">{g.icon}</div>
                      <div className="text-sm font-bold text-white">{g.title}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{g.desc}</div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-bold text-emerald-400">
                      {optimizationGoal === g.id ? '✓ Selected Priority' : 'Click to Select'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready to Analyze Banner */}
              <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ready to Analyze: {selectedRole === 'farmer' ? selectedIndianCrop.hindiName : selectedCropName}
                  </div>
                  <div className="text-sm text-white font-medium">
                    {selectedRole === 'farmer' ? (
                      <span>
                        Fasal: <strong className="text-yellow-400">{selectedIndianCrop.name}</strong> | Wazan: <strong>{totalWeightKg.toLocaleString()} kg</strong> | Purpose: <strong>{farmerPurpose === 'sale' ? `${destinationMandi.name} (${distanceInfo.distanceKm} km)` : 'Storage'}</strong>
                      </span>
                    ) : (
                      <span>
                        Profile: <strong className="text-yellow-400">{selectedRole.toUpperCase()}</strong> | Storage: <strong>{storageType} ({storageTempC}°C)</strong> | Goal: <strong>{optimizationGoal}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleComputeRecommendation}
                  disabled={loading}
                  className="px-8 py-3.5 rounded-2xl bg-[#FACC15] text-slate-950 text-sm font-black hover:bg-yellow-300 transition-all flex items-center space-x-2 shadow-[0_0_25px_rgba(250,204,21,0.4)] disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>{loading ? 'Analyzing Packaging...' : 'Generate Packaging Recommendations'}</span>
                </button>
              </div>

              {/* Navigation Footer */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: {selectedRole === 'farmer' ? 'Mandi Map Route' : 'Transit Stress'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: RECOMMENDATION RESULTS (BADI WALI PACKING FOR FARMERS)            */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header & Back Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131B2E] p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-black text-lg">
                ✨
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                  AI Decision Dossier • {selectedRole.toUpperCase()} MODE
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Recommended Packaging for {selectedRole === 'farmer' ? selectedIndianCrop.hindiName : (recResult?.query_summary.commodity || selectedCropName)}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Inputs</span>
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0B0F19] text-xs font-bold text-yellow-400 hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change User Type</span>
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SPECIAL BANNER FOR FARMERS: "BADI WALI PACKING"                   */}
          {/* ================================================================ */}
          {selectedRole === 'farmer' ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-500/20 via-emerald-500/15 to-transparent p-6 sm:p-8 rounded-3xl border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.15)] space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">🌾</span>
                    <div>
                      <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-yellow-400 text-slate-950 mb-1">
                        KISAN BADI WALI PACKING • VERIFIED FOR MANDI & STORAGE
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        {farmerRecommendedPackaging.simpleHindiName}
                      </h3>
                      <p className="text-xs sm:text-sm text-yellow-300 font-bold">
                        Standard Name: {farmerRecommendedPackaging.simpleName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Harvest Weight</span>
                    <span className="text-3xl font-black text-yellow-400 font-mono">
                      {totalWeightKg.toLocaleString()} kg
                    </span>
                  </div>
                </div>

                {/* Practical Metric Cards for Farmer */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#0B0F19]/90 p-4 rounded-2xl border border-yellow-400/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Units Needed</span>
                    <span className="text-2xl font-black text-yellow-400 font-mono">
                      {totalBagsNeeded} Units
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {farmerRecommendedPackaging.capacityKg} kg / unit bori
                    </span>
                  </div>

                  <div className="bg-[#0B0F19]/90 p-4 rounded-2xl border border-yellow-400/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Dukaan Rate (Per Unit)</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {farmerRecommendedPackaging.estimatedCostInr}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Ready stock rate
                    </span>
                  </div>

                  <div className="bg-[#0B0F19]/90 p-4 rounded-2xl border border-yellow-400/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Total Kharcha</span>
                    <span className="text-xl font-black text-white font-mono">
                      ₹{estimatedCostMin.toLocaleString()} – ₹{estimatedCostMax.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      For {totalBagsNeeded} bags
                    </span>
                  </div>

                  <div className="bg-[#0B0F19]/90 p-4 rounded-2xl border border-yellow-400/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      {farmerPurpose === 'sale' ? 'Mandi Distance' : 'Storage Life'}
                    </span>
                    <span className="text-base font-bold text-cyan-400 truncate block">
                      {farmerPurpose === 'sale' ? `${distanceInfo.distanceKm} km (~${distanceInfo.travelHours}h)` : `${storageDurationDays} Din Safe`}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {farmerPurpose === 'sale' ? destinationMandi.name.split(' ')[0] : 'Covered Godown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Packaging HD Real Photo & Shopkeeper Dialogue Box */}
              <div className="bg-[#131B2E] p-6 sm:p-8 rounded-3xl border-2 border-yellow-400/40 shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Real HD Photo */}
                  <div className="md:col-span-5 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-950 p-3 shadow-inner flex items-center justify-center relative group">
                    <img
                      src={farmerRecommendedPackaging.photoUrl}
                      alt={farmerRecommendedPackaging.simpleName}
                      onError={(e) => {
                        e.currentTarget.src = selectedIndianCrop.category === 'Vegetable' 
                          ? '/packaging/bulk_leno_sack.jpg' 
                          : '/packaging/bulk_micro_perf_liner.jpg';
                      }}
                      className="w-full h-60 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-center text-[10px] text-white font-bold">
                      Asli Packaging Ka Photo (Real HD Look)
                    </div>
                  </div>

                  {/* Why & Market Phrase */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Dukaandaar Se Kya Bolein */}
                    <div className="p-4 rounded-2xl bg-yellow-400/10 border-2 border-yellow-400/40 space-y-1.5">
                      <div className="flex items-center space-x-2 text-yellow-400 font-black text-xs uppercase tracking-wider">
                        <span>🗣️</span>
                        <span>Dukaandaar Ya Mandi Dealer Se Kya Bol Kar Maange:</span>
                      </div>
                      <div className="text-sm font-bold text-white pl-3 border-l-2 border-yellow-400 italic">
                        "{farmerRecommendedPackaging.marketPhrase}"
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                      <span className="text-yellow-400 font-bold block uppercase text-[11px]">
                        Fasal Ki Suraksha Ka Kaaran:
                      </span>
                      <p>{farmerRecommendedPackaging.description}</p>
                      <ul className="space-y-1 pt-1 text-slate-400">
                        <li>• Hawa ka bahaav bana rehta hai jisse pasina aur fafund nahi lagti.</li>
                        <li>• Gaadi mein upar-neeche dabne se fasal daagi aur pichakti nahi hai.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Hub */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onGenerateQR({
                        commodity: selectedIndianCrop.name,
                        packaging_name: farmerRecommendedPackaging.simpleName,
                        packaging_structure: farmerRecommendedPackaging.simpleHindiName,
                        thickness_um: 180,
                        quantity_kg: totalWeightKg,
                        farm_or_facility_name: 'Kisan Harvest Batch',
                        location: farmerPurpose === 'sale' ? destinationMandi.name : 'Farm Godown',
                        expiry_date: new Date(Date.now() + selectedIndianCrop.shelfLifeDaysAmbient * 86400000).toISOString().split('T')[0],
                      });
                    }}
                    className="px-5 py-3 rounded-xl bg-[#FACC15] text-slate-950 font-black text-xs hover:bg-yellow-300 transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(250,204,21,0.25)]"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Print Mandi QR Batch Label</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (recResult) {
                        onDownloadReport(recResult);
                      }
                    }}
                    className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Download Report PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onFindSourcing(`${farmerRecommendedPackaging.simpleName} supplier near ${destinationMandi.name}`)}
                    className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                  >
                    <Search className="w-4 h-4 text-yellow-400" />
                    <span>Find Local Mandi Suppliers</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================ */
            /* FOOD PRODUCER / PROCESSOR: 3 OPTIONS & SIDE-BY-SIDE COMPARISON   */
            /* ================================================================ */
            recResult && recResult.top_recommendations.length > 0 && (() => {
              const topRecs = recResult.top_recommendations;
              const activeProducerRec = topRecs.find(r => r.rank === producerSelectedRank) || topRecs[0];
              const bestOTR = Math.min(...topRecs.map(r => r.technical_specifications.otr_value));
              const bestWVTR = Math.min(...topRecs.map(r => r.technical_specifications.wvtr_value));
              const bestPuncture = Math.max(...topRecs.map(r => r.technical_specifications.puncture_resistance_n));
              const bestTensile = Math.max(...topRecs.map(r => r.technical_specifications.tensile_strength_mpa));
              const bestCostIndex = Math.min(...topRecs.map(r => r.sustainability_profile.relative_cost_index));

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Mode Switcher Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#0B0F19] rounded-2xl border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setProducerViewMode('dossier')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                          producerViewMode === 'dossier'
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-white" />
                        <span>Specification Dossier (Rank {producerSelectedRank})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProducerViewMode('compare')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                          producerViewMode === 'compare'
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Scale className="w-4 h-4 text-teal-400" />
                        <span>Compare All 3 Formulations Side-by-Side</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/20 text-white font-mono uppercase tracking-wider">
                          Green vs Red
                        </span>
                      </button>
                    </div>

                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {producerViewMode === 'compare' ? '⚡ Side-by-Side Benchmarking Active' : `Active: Rank ${producerSelectedRank} Choice`}
                    </span>
                  </div>

                  {/* 3 Clickable Strategic Option Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topRecs.map((rec) => {
                      const isSelected = producerSelectedRank === rec.rank;
                      const photoUrl = rec.sample_photo_url || getPackagingPhotoUrl(rec.short_name, selectedCropName);
                      return (
                        <div
                          key={rec.id}
                          onClick={() => setProducerSelectedRank(rec.rank)}
                          className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden bg-[#131B2E] ${
                            isSelected
                              ? 'border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.3)] ring-2 ring-teal-500/20'
                              : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Rank Badge & Score */}
                            <div className="flex items-center justify-between">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                rec.rank === 1 ? 'bg-teal-500 text-slate-950' : rec.rank === 2 ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                              }`}>
                                {rec.rank === 1 ? '🌟 Rank 1 Choice' : rec.rank === 2 ? '🛡️ Rank 2 Choice' : '🌿 Rank 3 Choice'}
                              </span>
                              <span className="font-mono text-xs font-black text-teal-400">
                                {rec.suitability_score} / 100
                              </span>
                            </div>

                            {/* Archetype subtitle */}
                            <div className="text-[11px] font-bold text-teal-300">
                              {rec.archetype || (rec.rank === 1 ? 'Optimal Standard Solution' : rec.rank === 2 ? 'Ultra-Barrier Defense' : 'Sustainable / Value Alternative')}
                            </div>

                            {/* Physical Photo */}
                            <div className="h-36 w-full rounded-xl bg-[#0B0F19] p-2 border border-slate-800 flex items-center justify-center overflow-hidden relative group-hover:border-teal-500/40 transition-colors">
                              <img
                                src={photoUrl}
                                alt={rec.name}
                                onError={(e) => { e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg'; }}
                                className="h-32 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300">
                                {rec.technical_specifications.thickness_um} µm
                              </span>
                            </div>

                            {/* Material Name & Structure */}
                            <div>
                              <h4 className="font-extrabold text-white text-xs line-clamp-2 group-hover:text-teal-400 transition-colors">
                                {rec.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-1 font-mono line-clamp-1">
                                {rec.structure}
                              </p>
                            </div>

                            {/* Key specs */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                              <div className="p-1.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-slate-300">
                                <span className="text-slate-400 block text-[9px]">OTR Barrier</span>
                                <strong className="text-teal-400">{rec.technical_specifications.otr_value}</strong>
                              </div>
                              <div className="p-1.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-slate-300">
                                <span className="text-slate-400 block text-[9px]">WVTR Barrier</span>
                                <strong className="text-teal-400">{rec.technical_specifications.wvtr_value}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Footer Indicator */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-teal-400">
                            <span>{isSelected ? '✓ Active Formulation' : 'Select Solution'}</span>
                            <ArrowRight className={`w-3.5 h-3.5 transform transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* COMPARISON VIEW VS DOSSIER VIEW */}
                  {producerViewMode === 'compare' ? (
                    /* 3-WAY COMPARISON GRID */
                    <div className="space-y-6">
                      <div className="bg-[#0B0F19] border border-teal-500/30 rounded-2xl p-4 text-xs text-slate-300 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Scale className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span>Strict Green vs Red Benchmarking: Superior parameters highlighted in <strong className="text-emerald-400 font-bold">BOLD GREEN</strong> and weaker parameters in <strong className="text-rose-400 font-bold">BOLD RED</strong>.</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topRecs.map((mat, mIdx) => {
                          const photoUrl = mat.sample_photo_url || getPackagingPhotoUrl(mat.short_name, selectedCropName);
                          const isBestOTR = mat.technical_specifications.otr_value === bestOTR;
                          const isBestWVTR = mat.technical_specifications.wvtr_value === bestWVTR;
                          const isBestPuncture = mat.technical_specifications.puncture_resistance_n === bestPuncture;
                          const isBestTensile = mat.technical_specifications.tensile_strength_mpa === bestTensile;
                          const isBestCost = mat.sustainability_profile.relative_cost_index === bestCostIndex;
                          const isEcoFriendly = (mat.sustainability_profile.bio_based_pct > 0 || mat.sustainability_profile.recyclability_class.includes('High') || mat.sustainability_profile.compostable);

                          return (
                            <div
                              key={mat.id}
                              className={`bg-[#131B2E] border-2 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between ${
                                producerSelectedRank === mat.rank ? 'border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.25)]' : 'border-slate-800'
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    mat.rank === 1 ? 'bg-teal-500 text-slate-950' : mat.rank === 2 ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                                  }`}>
                                    Candidate {mIdx === 0 ? 'A (Rank 1)' : mIdx === 1 ? 'B (Rank 2)' : 'C (Rank 3)'}
                                  </span>
                                  <span className="font-mono text-xs font-bold text-teal-400">
                                    {mat.suitability_score} / 100
                                  </span>
                                </div>

                                <div className="h-40 rounded-2xl bg-[#0B0F19] p-2 flex items-center justify-center border border-slate-800 overflow-hidden">
                                  <img
                                    src={photoUrl}
                                    alt={mat.name}
                                    onError={(e) => { e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg'; }}
                                    className="h-36 w-full object-contain rounded-xl"
                                  />
                                </div>

                                <div>
                                  <h3 className="text-base font-extrabold text-white line-clamp-1">{mat.name}</h3>
                                  <span className="text-xs font-mono text-slate-400 block mt-0.5 line-clamp-1">{mat.structure}</span>
                                </div>
                              </div>

                              {/* Strict Green vs Red Metrics */}
                              <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                                {/* OTR */}
                                <div className={`p-2.5 rounded-xl border ${isBestOTR ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-rose-950/20 border-rose-500/30'}`}>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 uppercase font-bold">Oxygen (OTR)</span>
                                    <span className={`font-black px-1.5 py-0.5 rounded ${isBestOTR ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'}`}>
                                      {isBestOTR ? '✓ BEST BARRIER' : '✗ WEAKER'}
                                    </span>
                                  </div>
                                  <div className={`text-base font-mono font-black mt-0.5 ${isBestOTR ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {mat.technical_specifications.otr_value} <span className="text-xs font-normal text-slate-400">cm³/(m²·d·atm)</span>
                                  </div>
                                </div>

                                {/* WVTR */}
                                <div className={`p-2.5 rounded-xl border ${isBestWVTR ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-rose-950/20 border-rose-500/30'}`}>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 uppercase font-bold">Moisture (WVTR)</span>
                                    <span className={`font-black px-1.5 py-0.5 rounded ${isBestWVTR ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'}`}>
                                      {isBestWVTR ? '✓ BEST BARRIER' : '✗ WEAKER'}
                                    </span>
                                  </div>
                                  <div className={`text-base font-mono font-black mt-0.5 ${isBestWVTR ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {mat.technical_specifications.wvtr_value} <span className="text-xs font-normal text-slate-400">g/(m²·day)</span>
                                  </div>
                                </div>

                                {/* Puncture */}
                                <div className={`p-2.5 rounded-xl border ${isBestPuncture ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-rose-950/20 border-rose-500/30'}`}>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 uppercase font-bold">Puncture Force</span>
                                    <span className={`font-black px-1.5 py-0.5 rounded ${isBestPuncture ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'}`}>
                                      {isBestPuncture ? '✓ STRONGEST' : '✗ LOWER FORCE'}
                                    </span>
                                  </div>
                                  <div className={`text-base font-mono font-black mt-0.5 ${isBestPuncture ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {mat.technical_specifications.puncture_resistance_n} <span className="text-xs font-normal text-slate-400">N</span>
                                  </div>
                                </div>

                                {/* Tensile */}
                                <div className={`p-2.5 rounded-xl border ${isBestTensile ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-rose-950/20 border-rose-500/30'}`}>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 uppercase font-bold">Tensile Strength</span>
                                    <span className={`font-black px-1.5 py-0.5 rounded ${isBestTensile ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'}`}>
                                      {isBestTensile ? '✓ STRONGEST' : '✗ LOWER'}
                                    </span>
                                  </div>
                                  <div className={`text-base font-mono font-black mt-0.5 ${isBestTensile ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {mat.technical_specifications.tensile_strength_mpa} <span className="text-xs font-normal text-slate-400">MPa</span>
                                  </div>
                                </div>

                                {/* Cost Index */}
                                <div className={`p-2.5 rounded-xl border ${isBestCost ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-rose-950/20 border-rose-500/30'}`}>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 uppercase font-bold">Cost Economy</span>
                                    <span className={`font-black px-1.5 py-0.5 rounded ${isBestCost ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-400'}`}>
                                      {isBestCost ? '✓ LOWER EXPENSE' : '✗ HIGHER COST'}
                                    </span>
                                  </div>
                                  <div className={`text-sm font-mono font-black mt-0.5 ${isBestCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    Index {mat.sustainability_profile.relative_cost_index} • {mat.procurement_market.estimated_cost_per_pouch_inr}
                                  </div>
                                </div>

                                {/* Circularity */}
                                <div className={`p-2.5 rounded-xl border ${isEcoFriendly ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-[#0B0F19] border-slate-800'}`}>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 uppercase font-bold">Circularity</span>
                                    <span className={`font-black px-1.5 py-0.5 rounded ${isEcoFriendly ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                                      {isEcoFriendly ? '✓ ECO CIRCULAR' : 'CONVENTIONAL'}
                                    </span>
                                  </div>
                                  <div className={`text-xs font-bold mt-0.5 ${isEcoFriendly ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {mat.sustainability_profile.recyclability_stream}
                                  </div>
                                </div>
                              </div>

                              {/* Action to adopt */}
                              <div className="pt-3 border-t border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProducerSelectedRank(mat.rank);
                                    setProducerViewMode('dossier');
                                  }}
                                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                                    producerSelectedRank === mat.rank
                                      ? 'bg-teal-600 text-white'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  <span>{producerSelectedRank === mat.rank ? '✓ Selected — View Dossier' : 'Adopt & View Dossier'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* DOSSIER VIEW FOR SELECTED CANDIDATE */
                    <div className="bg-[#131B2E] p-6 sm:p-8 rounded-3xl border-2 border-teal-500/40 shadow-xl space-y-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500 text-slate-950">
                              Rank {activeProducerRec.rank} Choice • {activeProducerRec.archetype || 'Optimal Standard Solution'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {activeProducerRec.category}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                            {activeProducerRec.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                            Structure: <strong className="text-slate-200">{activeProducerRec.structure}</strong>
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setProducerViewMode('compare')}
                            className="px-3.5 py-2 rounded-xl bg-teal-600/20 border border-teal-500/40 text-teal-300 text-xs font-bold hover:bg-teal-600/30 flex items-center space-x-1.5"
                          >
                            <Scale className="w-4 h-4 text-teal-400" />
                            <span>Compare All 3 Formulations</span>
                          </button>
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Match Score</span>
                            <span className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">
                              {activeProducerRec.suitability_score} / 100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 rounded-2xl bg-[#0B0F19] p-4 border border-slate-800 flex items-center justify-center shadow-inner">
                          <img
                            src={activeProducerRec.sample_photo_url || getPackagingPhotoUrl(activeProducerRec.short_name, selectedCropName)}
                            alt={activeProducerRec.name}
                            onError={(e) => {
                              e.currentTarget.src = '/packaging/clear_barrier_pouch.jpg';
                            }}
                            className="h-48 object-contain rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-7 grid grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Thickness</span>
                            <span className="text-lg font-bold font-mono text-white">
                              {activeProducerRec.technical_specifications.thickness_um} µm
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Oxygen Transmission (OTR)</span>
                            <span className="text-lg font-bold font-mono text-teal-400">
                              {activeProducerRec.technical_specifications.otr_value}
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Water Vapor (WVTR)</span>
                            <span className="text-lg font-bold font-mono text-teal-400">
                              {activeProducerRec.technical_specifications.wvtr_value}
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Recyclability</span>
                            <span className="text-sm font-bold text-white truncate block">
                              {activeProducerRec.sustainability_profile.recyclability_stream}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onGenerateQR({
                              commodity: recResult.query_summary.commodity,
                              packaging_id: activeProducerRec.id,
                              packaging_name: activeProducerRec.name,
                              packaging_structure: activeProducerRec.structure,
                              thickness_um: activeProducerRec.technical_specifications.thickness_um,
                              quantity_kg: 500,
                              farm_or_facility_name: 'Packaging Facility',
                              location: 'Industrial Plant',
                            });
                          }}
                          className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs hover:bg-teal-400 transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(20,184,166,0.25)]"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Generate QR Batch Label</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDownloadReport(recResult)}
                          className="px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                        >
                          <FileText className="w-4 h-4 text-teal-400" />
                          <span>Download Specification PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onFindSourcing(activeProducerRec.name)}
                          className="px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                        >
                          <Search className="w-4 h-4 text-teal-400" />
                          <span>Find Suppliers</span>
                        </button>

                        <button
                          type="button"
                          onClick={onOpenLaminate}
                          className="px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5"
                        >
                          <Layers className="w-4 h-4 text-teal-400" />
                          <span>Build Laminate</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}

        </div>
      )}

    </div>
  );
};
