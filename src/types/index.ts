export type UserRole = 'farmer' | 'producer' | 'manufacturer' | 'researcher' | 'regulator';

export interface FoodCommodity {
  id: number;
  commodity: string;
  category: string;
  moisture_pct: number;
  fat_pct: number;
  protein_pct: number;
  ph: number;
  respiration_rate_val: number;
  respiration_rate_class: string;
  standard_shelf_life_days: number;
  optimal_storage_type: string;
  optimal_temp_c: number;
  optimal_rh_pct: number;
  map_suitable: boolean;
  optimal_map_gas: string;
  common_packaging?: string;
  typical_market_unit?: string;
  primary_degradation_modes?: string[];
  critical_barrier_needs?: any;
  [key: string]: any;
}



export interface PackagingLayer {
  layer_no: number;
  position: string;
  name: string;
  thickness_um: number;
  function: string;
  work: string;
  material_code?: string;
}

export interface QualityCheckItem {
  check_item: string;
  standard: string;
  acceptance_criteria: string;
  how_to_test: string;
  criticality: 'Critical' | 'Major' | 'Minor';
}

export interface TechnicalSpecs {
  thickness_um: number;
  otr_value: number; // cm3/(m2·day·atm)
  otr_unit: string;
  otr_class: string;
  wvtr_value: number; // g/(m2·day)
  wvtr_unit: string;
  wvtr_class: string;
  co2_permeability: number; // cm3/(m2·day·atm)
  puncture_resistance_n: number;
  tensile_strength_mpa: number;
  sealing_temp_range_c: string;
  seal_strength_n_15mm: number;
  min_temperature_c: number;
  breathable: boolean;
  micro_perforated: boolean;
  map_suitable: boolean;
  light_barrier: string;
  test_conditions?: string;
}

export interface SustainabilityProfile {
  recyclability_class: string;
  recyclability_stream: string;
  recycled_content_pct: number;
  biodegradable: boolean;
  compostable: boolean;
  bio_based_pct: number;
  relative_cost_index: number;
}

export interface ProcurementMarket {
  estimated_cost_per_kg_inr: string;
  estimated_cost_per_pouch_inr: string;
  approx_cost_usd: string;
  moq: string;
  lead_time: string;
  sourcing_channels: string[];
  live_status?: string;
}

export interface MaterialDurability {
  virgin_material_shelf_life: string;
  packaged_product_protection_duration: string;
  unfilled_storage_conditions: string;
  aging_failure_modes: string;
}

export interface RecommendationExplanation {
  reasons_why: string[];
  cautions_limitations: string[];
  radar_metrics: {
    oxygen_barrier: number;
    moisture_barrier: number;
    mechanical_strength: number;
    thermal_stability: number;
    sustainability: number;
    cost_efficiency: number;
  };
}

export interface TopRecommendation {
  rank: number;
  id: string;
  short_name: string;
  name: string;
  structure: string;
  category: string;
  suitability_score: number;
  sample_photo_url: string;
  technical_specifications: TechnicalSpecs;
  sustainability_profile: SustainabilityProfile;
  scientific_provenance: {
    source_ref: string;
    astm_standard: string;
    doi: string;
  };
  material_composition: {
    layers: PackagingLayer[];
    why_this_material_short: string;
  };
  procurement_market: ProcurementMarket;
  quality_inspection_checklist: QualityCheckItem[];
  material_durability: MaterialDurability;
  explanation: RecommendationExplanation;
}

export interface DisqualifiedCandidate {
  id: string;
  short_name: string;
  name: string;
  reasons: string[];
}

export interface RecommendationResult {
  query_summary: {
    commodity: string;
    category: string;
    storage_type: string;
    transportation: string;
    target_shelf_life_days: number;
    optimization_goal: string;
    storage_temp_c?: number;
    relative_humidity_pct?: number;
  };
  scientific_requirements: {
    commodity: string;
    category: string;
    is_fresh_produce: boolean;
    is_frozen: boolean;
    is_chilled: boolean;
    is_long_transit: boolean;
    water_activity_aw_estimated: number;
    vapor_pressure_delta_kpa: number;
    oxidation_risk_index: number;
    target_wvtr_range: { min: number; max: number; unit: string };
    wvtr_class_demand: string;
    moisture_risk_analysis: string;
    target_otr_range: { min: number; max: number; unit: string };
    otr_class_demand: string;
    oxygen_risk_analysis: string;
    thermal_mechanical_demands: {
      min_operating_temp_c: number;
      required_puncture_n: number;
      required_tensile_mpa: number;
      thermal_risk: string;
    };
    map_recommendations: {
      active_mode: boolean;
      respiration_severity: string;
      respiration_rate_mg_co2_kg_hr: number;
      breathable_packaging_required: boolean;
      micro_perforation_recommended: boolean;
      recommended_headspace_gas: string;
      anaerobic_compensation_threshold_o2: number;
      co2_injury_threshold_pct: number;
      scientific_rationale: string;
    };
  };
  top_recommendations: TopRecommendation[];
  sustainable_alternative?: TopRecommendation;
  disqualified_candidates: DisqualifiedCandidate[];
  confidence_assessment: {
    overall_confidence: string;
    score_separation: number;
    evidence_sources_count: number;
    empirical_measurements_analyzed: number;
    model_version: string;
  };
  disclaimer: string;
}

export interface RecommendationFormState {
  commodity: string;
  category: string;
  moisture_pct: number;
  fat_pct: number;
  protein_pct: number;
  ph: number;
  respiration_rate: number;
  shelf_life_days: number;
  storage_temp_c: number;
  relative_humidity_pct: number;
  storage_type: string;
  transportation: string;
  optimization_goal: string;
  packaging_format?: string;
  target_volume?: number;
  user_role?: UserRole;
  harvest_quantity_kg?: number;
}

export interface BatchRecord {
  id: string;
  batch_number: string;
  commodity: string;
  packaging_id: string;
  packaging_name: string;
  packaging_structure: string;
  thickness_um: number;
  pack_date: string;
  expiry_date: string;
  storage_temp_c: number;
  relative_humidity_pct: number;
  farm_or_facility_name: string;
  location: string;
  quantity_kg: number;
  status: 'Verified' | 'Pending Inspection' | 'In Transit' | 'Expired';
  qr_data_string: string;
  created_at: string;
}

export interface ScientificSource {
  id: string;
  source_name: string;
  title: string;
  authors: string;
  year: number;
  publisher_or_journal: string | null;
  url: string;
  doi: string;
  scope?: string;
  confidence_tier?: string;
  confidence_score?: number;
  provenance_type?: string;
  [key: string]: any;
}



export interface ManufacturerMaterial {
  id: string;
  name: string;
  polymer_family: string;
  structure: string;
  thickness_range: string;
  otr_value: number;
  wvtr_value: number;
  co2_permeability: number;
  tensile_strength_mpa: number;
  seal_range: string;
  moq: string;
  price_per_sqm_inr: number;
  recyclability_stream: string;
  is_compostable: boolean;
  is_bio_based: boolean;
  food_contact_approval: string;
  regions: string[];
  stock_status: 'In Stock' | 'Custom Run Only' | 'Low Inventory';
}
