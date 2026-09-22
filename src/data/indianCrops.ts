export interface IndianCrop {
  id: string;
  name: string;
  hindiName: string;
  category: 'Vegetable' | 'Fruit' | 'Grain_Pulse';
  icon: string;
  needsTempControl: boolean;
  idealTempC: number;
  shelfLifeDaysAmbient: number;
  shelfLifeDaysCold: number;
  respirationRate: number; // mg CO2 / kg hr
  primaryBulkPackaging: {
    id: string;
    simpleName: string;
    simpleHindiName: string;
    capacityKg: number;
    estimatedCostInr: string;
    estimatedCostMin: number;
    estimatedCostMax: number;
    photoUrl: string;
    marketPhrase: string;
    description: string;
  };
  longDistancePackaging: {
    id: string;
    simpleName: string;
    simpleHindiName: string;
    capacityKg: number;
    estimatedCostInr: string;
    estimatedCostMin: number;
    estimatedCostMax: number;
    photoUrl: string;
    marketPhrase: string;
    description: string;
  };
  storagePackaging: {
    id: string;
    simpleName: string;
    simpleHindiName: string;
    capacityKg: number;
    estimatedCostInr: string;
    estimatedCostMin: number;
    estimatedCostMax: number;
    photoUrl: string;
    marketPhrase: string;
    description: string;
  };
}

export const INDIAN_CROPS_CATALOG: IndianCrop[] = [
  // ----------------------------------------------------
  // VEGETABLES (SABZIYAN)
  // ----------------------------------------------------
  {
    id: 'crop_tomato',
    name: 'Tomato',
    hindiName: 'Tamatar (टमाटर)',
    category: 'Vegetable',
    icon: '🍅',
    needsTempControl: true,
    idealTempC: 13,
    shelfLifeDaysAmbient: 7,
    shelfLifeDaysCold: 21,
    respirationRate: 18.5,
    primaryBulkPackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '20–25 kg Crate Liner (Micro-Perforated)',
      simpleHindiName: '20-25 kg Tamatar Crate Ki Chhed Waali Panni',
      capacityKg: 25,
      estimatedCostInr: '₹5 – ₹8 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 8,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, 25 kg plastic crate ke liye anti-fog laser hole waali liner sheet chahiye.',
      description: 'Micro-holes exhaust respiratory CO2 and prevent condensation sweating, stopping rot inside mandi crates.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg 5-Ply Ventilated Master Box',
      simpleHindiName: '20 kg Hawa Ke Chhed Waala 5-Ply Dabba',
      capacityKg: 20,
      estimatedCostInr: '₹30 – ₹45 / box',
      estimatedCostMin: 30,
      estimatedCostMax: 45,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, door mandi ke liye 5-ply hawa ke chhed waala heavy carton chahiye.',
      description: 'Resists truck vibration and bottom layer crushing during 8-tier vertical stacking on highway transit.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Anti-Fog Micro-Perforated Cold Storage Liner',
      simpleHindiName: 'Cold Storage Ke Liye Anti-Fog Crate Panni',
      capacityKg: 25,
      estimatedCostInr: '₹6 – ₹9 / sheet',
      estimatedCostMin: 6,
      estimatedCostMax: 9,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, cold storage ke liye anti-fog perforated liner panni chahiye.',
      description: 'Maintains 90% relative humidity without water droplets accumulating on tomato skin.'
    }
  },
  {
    id: 'crop_potato',
    name: 'Potato',
    hindiName: 'Aaloo (आलू)',
    category: 'Vegetable',
    icon: '🥔',
    needsTempControl: false,
    idealTempC: 10,
    shelfLifeDaysAmbient: 60,
    shelfLifeDaysCold: 180,
    respirationRate: 5.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '50 kg Ventilated Leno Mesh Bori',
      simpleHindiName: '50 kg Aaloo Ki Jaali Waali Badi Bori (Leno Bag)',
      capacityKg: 50,
      estimatedCostInr: '₹15 – ₹22 / bori',
      estimatedCostMin: 15,
      estimatedCostMax: 22,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, 50 kg aaloo ke liye high-strength leno mesh bori chahiye 60 GSM drawstring ke saath.',
      description: 'Allows 360° open air circulation, stops heat buildup in truck beds, and withstands 50 kg stack load.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '50 kg Heavy-Duty Leno Mesh Sack (Reinforced)',
      simpleHindiName: '50 kg Heavy Woven Leno Bori (Door Mandi)',
      capacityKg: 50,
      estimatedCostInr: '₹18 – ₹25 / bori',
      estimatedCostMin: 18,
      estimatedCostMax: 25,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, inter-state transit ke liye heavy gauge 65 GSM leno bori chahiye.',
      description: 'Tear-resistant virgin polypropylene weave protects tubers from bruising over rough roads.'
    },
    storagePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '50 kg Cold Storage Leno Sack',
      simpleHindiName: 'Cold Storage Aaloo Bori (50 kg)',
      capacityKg: 50,
      estimatedCostInr: '₹16 – ₹22 / bori',
      estimatedCostMin: 16,
      estimatedCostMax: 22,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, cold storage godown ke liye ventilation bori chahiye.',
      description: 'Allows chilled air penetration to suppress sprouting while maintaining skin turgidity.'
    }
  },
  {
    id: 'crop_onion',
    name: 'Onion',
    hindiName: 'Pyaaz (प्याज)',
    category: 'Vegetable',
    icon: '🧅',
    needsTempControl: false,
    idealTempC: 18,
    shelfLifeDaysAmbient: 90,
    shelfLifeDaysCold: 210,
    respirationRate: 4.5,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '45–50 kg Red Leno Mesh Bori',
      simpleHindiName: '45-50 kg Pyaaz Ki Laal Jaali Bori',
      capacityKg: 50,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, 50 kg pyaaz ke liye laal rang ki leno mesh bori chahiye.',
      description: 'Maximum breathability prevents neck rot and moisture sweating during humid transit.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '50 kg Heavy-Duty Leno Mesh Sack',
      simpleHindiName: '50 kg Pyaaz Heavy Transit Bori',
      capacityKg: 50,
      estimatedCostInr: '₹16 – ₹24 / bori',
      estimatedCostMin: 16,
      estimatedCostMax: 24,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, door mandi transit ke liye heavy gauge mesh bori chahiye.',
      description: 'Reinforced bottom seam supports rough loading and unloading at wholesale APMC yards.'
    },
    storagePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: 'Godown Aerated Mesh Bag (40 kg)',
      simpleHindiName: 'Godown Chhalni Pyaaz Bori (40 kg)',
      capacityKg: 40,
      estimatedCostInr: '₹14 – ₹19 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 19,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, shaded chawl/godown storage ke liye open mesh bori chahiye.',
      description: 'Ensures dry cross-ventilation to prevent outer bulb scale softening.'
    }
  },
  {
    id: 'crop_garlic',
    name: 'Garlic',
    hindiName: 'Lahsun (लहसुन)',
    category: 'Vegetable',
    icon: '🧄',
    needsTempControl: false,
    idealTempC: 18,
    shelfLifeDaysAmbient: 120,
    shelfLifeDaysCold: 240,
    respirationRate: 3.5,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '25–30 kg White/Orange Leno Mesh Bag',
      simpleHindiName: '25-30 kg Lahsun Ki Jaali Bori',
      capacityKg: 30,
      estimatedCostInr: '₹12 – ₹18 / bori',
      estimatedCostMin: 12,
      estimatedCostMax: 18,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, lahsun ke liye 25-30 kg mesh bori chahiye.',
      description: 'Continuous airflow prevents fungal mold and keeps bulb dry.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '30 kg Heavy Leno Bag',
      simpleHindiName: '30 kg Heavy Lahsun Bori',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, inter-state transit ke liye reinforced lahsun bori chahiye.',
      description: 'Prevents clove damage and skin flaking under stacking.'
    },
    storagePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: 'Dry Godown Mesh Bag',
      simpleHindiName: 'Dry Godown Lahsun Bag',
      capacityKg: 25,
      estimatedCostInr: '₹11 – ₹16 / bori',
      estimatedCostMin: 11,
      estimatedCostMax: 16,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, godown storage ke liye open mesh bag chahiye.',
      description: 'Stops bulb moisture retention and rot.'
    }
  },
  {
    id: 'crop_chilli',
    name: 'Green Chilli',
    hindiName: 'Hari Mirch (हरी मिर्च)',
    category: 'Vegetable',
    icon: '🌶️',
    needsTempControl: true,
    idealTempC: 8,
    shelfLifeDaysAmbient: 6,
    shelfLifeDaysCold: 18,
    respirationRate: 20.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '10–15 kg Crate Liner (Breathable Anti-Fog)',
      simpleHindiName: '10-15 kg Mirch Crate Ki Chhed Waali Panni',
      capacityKg: 15,
      estimatedCostInr: '₹4.50 – ₹7 / sheet',
      estimatedCostMin: 4.5,
      estimatedCostMax: 7,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, hari mirch ke liye crate liner anti-fog panni chahiye.',
      description: 'Laser micro-vents exhaust moisture to prevent stalk mold and blackening.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '10 kg Ventilated Corrugated Box',
      simpleHindiName: '10 kg Mirch Ventilated Carton',
      capacityKg: 10,
      estimatedCostInr: '₹22 – ₹35 / box',
      estimatedCostMin: 22,
      estimatedCostMax: 35,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, long distance hari mirch export box chahiye hawa ke chhed waala.',
      description: 'Prevents crushing and maintains fresh green color during highway transit.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Cold-Chain Perforated Crate Sheet',
      simpleHindiName: 'Cold Room Mirch Liner',
      capacityKg: 15,
      estimatedCostInr: '₹5 – ₹8 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 8,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, cold room storage ke liye micro perforated liner chahiye.',
      description: 'Locks in crispness and delays shriveling.'
    }
  },
  {
    id: 'crop_capsicum',
    name: 'Capsicum / Bell Pepper',
    hindiName: 'Shimla Mirch (शिमला मिर्च)',
    category: 'Vegetable',
    icon: '🫑',
    needsTempControl: true,
    idealTempC: 10,
    shelfLifeDaysAmbient: 7,
    shelfLifeDaysCold: 20,
    respirationRate: 15.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '15–20 kg Crate Liner Sheet',
      simpleHindiName: '15-20 kg Shimla Mirch Crate Panni',
      capacityKg: 20,
      estimatedCostInr: '₹5 – ₹8 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 8,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, shimla mirch ke crate ke liye liner panni chahiye.',
      description: 'Eliminates moisture condensation on smooth fruit skin.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '15 kg 5-Ply Ventilated Carton',
      simpleHindiName: '15 kg 5-Ply Shimla Mirch Dabba',
      capacityKg: 15,
      estimatedCostInr: '₹26 – ₹40 / box',
      estimatedCostMin: 26,
      estimatedCostMax: 40,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, 5-ply hawa waala dabba chahiye shimla mirch ke liye.',
      description: 'Rigid corrugated flutes protect hollow bell structure from crushing.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Controlled Humidity Liner',
      simpleHindiName: 'Humidity Control Crate Liner',
      capacityKg: 20,
      estimatedCostInr: '₹6 – ₹9 / sheet',
      estimatedCostMin: 6,
      estimatedCostMax: 9,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, cold storage ke liye humidity buffer panni chahiye.',
      description: 'Preserves turgidity and stops skin wrinkling.'
    }
  },
  {
    id: 'crop_cauliflower',
    name: 'Cauliflower & Cabbage',
    hindiName: 'Gobhi / Phool Gobhi / Patta Gobhi (गोभी)',
    category: 'Vegetable',
    icon: '🥦',
    needsTempControl: true,
    idealTempC: 5,
    shelfLifeDaysAmbient: 5,
    shelfLifeDaysCold: 18,
    respirationRate: 25.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '25–30 kg Wide-Mesh Leno Sack',
      simpleHindiName: '25-30 kg Gobhi Ki Badi Jaali Bori',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, gobhi ke liye wide mesh waali bori chahiye.',
      description: 'Open mesh prevents florets from turning yellow or sweating in transport.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg Master Ventilated Shipper',
      simpleHindiName: '20 kg Gobhi Master Box',
      capacityKg: 20,
      estimatedCostInr: '₹30 – ₹45 / box',
      estimatedCostMin: 30,
      estimatedCostMax: 45,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, heavy carton chahiye gobhi export/highway transit ke liye.',
      description: 'Protects delicate curd from browning due to road vibration.'
    },
    storagePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: 'Cold Room Aerated Sack',
      simpleHindiName: 'Cold Room Gobhi Mesh Bag',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, cold room ke liye gobhi bori chahiye.',
      description: 'Ensures cold air contact to retain crisp texture.'
    }
  },
  {
    id: 'crop_carrot',
    name: 'Carrot & Radish',
    hindiName: 'Gajar / Mooli (गाजर / मूली)',
    category: 'Vegetable',
    icon: '🥕',
    needsTempControl: false,
    idealTempC: 4,
    shelfLifeDaysAmbient: 8,
    shelfLifeDaysCold: 40,
    respirationRate: 12.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '40–50 kg Leno Mesh Bag',
      simpleHindiName: '40-50 kg Gajar/Mooli Ki Jaali Bori',
      capacityKg: 50,
      estimatedCostInr: '₹15 – ₹22 / bori',
      estimatedCostMin: 15,
      estimatedCostMax: 22,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, 50 kg gajar ke liye leno jaali bori chahiye.',
      description: 'Exhausts heat generated by roots while allowing dirt shakeout.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '50 kg Heavy Woven Bag',
      simpleHindiName: '50 kg Heavy Duty Gajar Bori',
      capacityKg: 50,
      estimatedCostInr: '₹18 – ₹25 / bori',
      estimatedCostMin: 18,
      estimatedCostMax: 25,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, heavy duty mesh bori chahiye gajar transport ke liye.',
      description: 'Supports high stack compression in open mandi trucks.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '25 kg Moisture Retention Crate Liner',
      simpleHindiName: '25 kg Cold Storage Gajar Liner',
      capacityKg: 25,
      estimatedCostInr: '₹5 – ₹8 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 8,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, cold storage ke liye gajar liner chahiye.',
      description: 'Prevents moisture evaporation and rubbery carrot texture.'
    }
  },
  {
    id: 'crop_ginger',
    name: 'Ginger',
    hindiName: 'Adrak (अदरक)',
    category: 'Vegetable',
    icon: '🫚',
    needsTempControl: false,
    idealTempC: 13,
    shelfLifeDaysAmbient: 30,
    shelfLifeDaysCold: 90,
    respirationRate: 6.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '25–30 kg Leno Mesh Sack',
      simpleHindiName: '25-30 kg Adrak Ki Jaali Bori',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, adrak ke liye 30 kg jaali bori chahiye.',
      description: 'Promotes rhizome curing and prevents subterranean mold.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg Export Master Shipper',
      simpleHindiName: '20 kg Adrak Export Dabba',
      capacityKg: 20,
      estimatedCostInr: '₹30 – ₹45 / box',
      estimatedCostMin: 30,
      estimatedCostMax: 45,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, adrak export ke liye 5-ply dabba chahiye.',
      description: 'Ensures zero finger breakage during multi-day haulage.'
    },
    storagePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: 'Cool Godown Mesh Bag',
      simpleHindiName: 'Godown Adrak Mesh Bag',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, godown storage ke liye adrak bori chahiye.',
      description: 'Maintains fresh skin without dehydration shriveling.'
    }
  },

  // ----------------------------------------------------
  // FRUITS (PHAL)
  // ----------------------------------------------------
  {
    id: 'crop_mango',
    name: 'Mango',
    hindiName: 'Aam (आम)',
    category: 'Fruit',
    icon: '🥭',
    needsTempControl: true,
    idealTempC: 13,
    shelfLifeDaysAmbient: 8,
    shelfLifeDaysCold: 25,
    respirationRate: 22.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '20 kg Crate Liner Sheet',
      simpleHindiName: '20 kg Aam Crate Ki Chhed Waali Panni',
      capacityKg: 20,
      estimatedCostInr: '₹5 – ₹8 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 8,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, aam ke crate ke liye micro perforated panni chahiye.',
      description: 'Allows respiratory ethylene dissipation to prevent rapid premature ripening and black spotting.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg Master Export Shipper Box',
      simpleHindiName: 'Aam Export Master Dabba (5-Ply Corrugated)',
      capacityKg: 20,
      estimatedCostInr: '₹35 – ₹55 / box',
      estimatedCostMin: 35,
      estimatedCostMax: 55,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, aam mandi/export ke liye partition waala heavy 5-ply carton chahiye.',
      description: 'Equipped with partition trays and ventilation vents to completely prevent fruit-on-fruit bruising.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Ripening Buffer Liner',
      simpleHindiName: 'Controlled Atmosphere Aam Liner',
      capacityKg: 20,
      estimatedCostInr: '₹6 – ₹9 / sheet',
      estimatedCostMin: 6,
      estimatedCostMax: 9,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, ripening control ke liye liner chahiye.',
      description: 'Delays senescence and anthracnose mold development in cold storage.'
    }
  },
  {
    id: 'crop_banana',
    name: 'Banana',
    hindiName: 'Kela (केला)',
    category: 'Fruit',
    icon: '🍌',
    needsTempControl: true,
    idealTempC: 14,
    shelfLifeDaysAmbient: 6,
    shelfLifeDaysCold: 20,
    respirationRate: 28.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '13–15 kg Banana Crate Liner (Perforated LDPE)',
      simpleHindiName: '13-15 kg Kela Crate Ki Panni',
      capacityKg: 15,
      estimatedCostInr: '₹5 – ₹7 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 7,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, kela ke crate ke liye perforated liner panni chahiye.',
      description: 'Prevents skin abrasion and latex staining during transport.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '13 kg Heavy-Duty Banana Carton (Telescopic)',
      simpleHindiName: '13 kg Kela Telescopic Export Box',
      capacityKg: 13,
      estimatedCostInr: '₹32 – ₹48 / box',
      estimatedCostMin: 32,
      estimatedCostMax: 48,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, telescopic 13 kg kela box chahiye vents ke saath.',
      description: 'Two-piece telescopic design resists vertical pallet compression.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Green Life Extension Liner',
      simpleHindiName: 'Green Life Kela Liner Panni',
      capacityKg: 15,
      estimatedCostInr: '₹6 – ₹9 / sheet',
      estimatedCostMin: 6,
      estimatedCostMax: 9,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, kela green stage delay karne waali panni chahiye.',
      description: 'Retards ripening gas exchange to extend green harvest window.'
    }
  },
  {
    id: 'crop_apple',
    name: 'Apple',
    hindiName: 'Seb (सेब)',
    category: 'Fruit',
    icon: '🍎',
    needsTempControl: true,
    idealTempC: 3,
    shelfLifeDaysAmbient: 14,
    shelfLifeDaysCold: 150,
    respirationRate: 8.5,
    primaryBulkPackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg Corrugated Master Apple Box (with Trays)',
      simpleHindiName: '20 kg Seb Ka Tray Waala Corrugated Dabba',
      capacityKg: 20,
      estimatedCostInr: '₹38 – ₹58 / box',
      estimatedCostMin: 38,
      estimatedCostMax: 58,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, seb ke liye tray waala heavy 5-ply master dabba chahiye.',
      description: 'Moulded pulp trays cushion each individual apple, completely isolating fruits from shock.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg High-Strength Cold Chain Carton',
      simpleHindiName: '20 kg Cold Chain Seb Box',
      capacityKg: 20,
      estimatedCostInr: '₹42 – ₹62 / box',
      estimatedCostMin: 42,
      estimatedCostMax: 62,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, high moisture resistant kraft dabba chahiye seb ke liye.',
      description: 'Resin-impregnated kraft board will not soften or sag in refrigerated reefers.'
    },
    storagePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: 'CA Storage Apple Shipper',
      simpleHindiName: 'Controlled Atmosphere Seb Box',
      capacityKg: 20,
      estimatedCostInr: '₹40 – ₹60 / box',
      estimatedCostMin: 40,
      estimatedCostMax: 60,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, CA storage seb box chahiye.',
      description: 'Maintains structure under 6-month cold room humidity.'
    }
  },
  {
    id: 'crop_citrus',
    name: 'Orange / Sweet Lime / Lemon',
    hindiName: 'Santra / Mosambi / Nimbu (संतरा / मौसंबी / नींबू)',
    category: 'Fruit',
    icon: '🍊',
    needsTempControl: false,
    idealTempC: 8,
    shelfLifeDaysAmbient: 14,
    shelfLifeDaysCold: 60,
    respirationRate: 10.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: '25–30 kg Leno Mesh Sack',
      simpleHindiName: '25-30 kg Santra / Mosambi Ki Jaali Bori',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, santra/mosambi ke liye 30 kg mesh bori chahiye.',
      description: '360° air flow prevents mold rot on citrus rind while displaying fruit color.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg Ventilated Citrus Box',
      simpleHindiName: '20 kg Citrus Master Dabba',
      capacityKg: 20,
      estimatedCostInr: '₹28 – ₹44 / box',
      estimatedCostMin: 28,
      estimatedCostMax: 44,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, citrus transit ke liye hawa waala 5-ply dabba chahiye.',
      description: 'Die-cut vents prevent heat suffocation and rind squashing.'
    },
    storagePackaging: {
      id: 'PKG_BULK_LENO_SACK',
      simpleName: 'Chilled Storage Leno Bag',
      simpleHindiName: 'Cold Room Citrus Mesh Bag',
      capacityKg: 30,
      estimatedCostInr: '₹14 – ₹20 / bori',
      estimatedCostMin: 14,
      estimatedCostMax: 20,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, cold room ke liye citrus jaali bori chahiye.',
      description: 'Retards moisture shrinkage without rind browning.'
    }
  },
  {
    id: 'crop_grapes',
    name: 'Grapes',
    hindiName: 'Angoor (अंगूर)',
    category: 'Fruit',
    icon: '🍇',
    needsTempControl: true,
    idealTempC: 1,
    shelfLifeDaysAmbient: 4,
    shelfLifeDaysCold: 45,
    respirationRate: 12.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: '5–10 kg Grape Crate Liner (with SO2 Pad)',
      simpleHindiName: '5-10 kg Angoor Liner Panni (SO2 Pad Ke Saath)',
      capacityKg: 10,
      estimatedCostInr: '₹8 – ₹14 / set',
      estimatedCostMin: 8,
      estimatedCostMax: 14,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, angoor ke crate ke liye SO2 sheet aur liner panni chahiye.',
      description: 'Includes micro-vent liner and sulfur dioxide pad to eliminate Botrytis grey mold.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '5 kg / 9 kg Grape Export Master Carton',
      simpleHindiName: 'Angoor Export Master Carton (5 kg)',
      capacityKg: 5,
      estimatedCostInr: '₹26 – ₹38 / box',
      estimatedCostMin: 26,
      estimatedCostMax: 38,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, angoor export box chahiye punnet support ke saath.',
      description: 'Moisture-resistant coating maintains stack integrity in refrigerated marine containers.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Cold Storage SO2 Guard Liner',
      simpleHindiName: 'Cold Storage Angoor SO2 Sheet',
      capacityKg: 10,
      estimatedCostInr: '₹8 – ₹14 / set',
      estimatedCostMin: 8,
      estimatedCostMax: 14,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, cold storage angoor preservative sheet chahiye.',
      description: 'Guarantees 45-day fresh bunch stem greenness.'
    }
  },
  {
    id: 'crop_pomegranate',
    name: 'Pomegranate',
    hindiName: 'Anar (अनार)',
    category: 'Fruit',
    icon: '🔴',
    needsTempControl: true,
    idealTempC: 7,
    shelfLifeDaysAmbient: 14,
    shelfLifeDaysCold: 60,
    respirationRate: 8.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '12 kg Master Pomegranate Shipper Box',
      simpleHindiName: '12 kg Anar Master Shipper Dabba',
      capacityKg: 12,
      estimatedCostInr: '₹30 – ₹45 / box',
      estimatedCostMin: 30,
      estimatedCostMax: 45,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, anar ke liye partition waala master carton chahiye.',
      description: 'Protects fruit crown and prevents rind scuffing during mandi transport.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '15 kg 5-Ply Export Shipper Box',
      simpleHindiName: 'Anar Export 5-Ply Box (15 kg)',
      capacityKg: 15,
      estimatedCostInr: '₹34 – ₹50 / box',
      estimatedCostMin: 34,
      estimatedCostMax: 50,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, anar export ke liye heavy 5-ply box chahiye.',
      description: 'Withstands rough highway vibration and vertical load.'
    },
    storagePackaging: {
      id: 'PKG_BULK_PERF_LINER',
      simpleName: 'Anti-Desiccation Crate Liner',
      simpleHindiName: 'Cold Storage Anar Liner',
      capacityKg: 15,
      estimatedCostInr: '₹5 – ₹8 / sheet',
      estimatedCostMin: 5,
      estimatedCostMax: 8,
      photoUrl: '/packaging/bulk_micro_perf_liner.jpg',
      marketPhrase: 'Bhaiya, cold storage anar liner panni chahiye.',
      description: 'Stops rind drying and browning.'
    }
  },
  {
    id: 'crop_watermelon',
    name: 'Watermelon & Muskmelon',
    hindiName: 'Tarbooj / Kharbooja (तरबूज / खरबूजा)',
    category: 'Fruit',
    icon: '🍉',
    needsTempControl: false,
    idealTempC: 12,
    shelfLifeDaysAmbient: 10,
    shelfLifeDaysCold: 25,
    respirationRate: 10.0,
    primaryBulkPackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '20 kg Corrugated Master Melon Box (Heavy 5-Ply)',
      simpleHindiName: '20 kg Tarbooj Heavy Corrugated Box',
      capacityKg: 20,
      estimatedCostInr: '₹34 – ₹50 / box',
      estimatedCostMin: 34,
      estimatedCostMax: 50,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, tarbooj ke liye heavy 5-ply box chahiye.',
      description: 'Prevents heavy fruit bursting and rind cracks during transit.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: '25 kg Master Bin Carton',
      simpleHindiName: '25 kg Heavy Melon Bin Box',
      capacityKg: 25,
      estimatedCostInr: '₹38 – ₹55 / box',
      estimatedCostMin: 38,
      estimatedCostMax: 55,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, melon transit ke liye bin box chahiye.',
      description: 'Reinforced kraft fluting supports vertical transit pressure.'
    },
    storagePackaging: {
      id: 'PKG_BULK_CORRUGATED_MASTER',
      simpleName: 'Ventilated Storage Carton',
      simpleHindiName: 'Shaded Godown Melon Box',
      capacityKg: 20,
      estimatedCostInr: '₹32 – ₹46 / box',
      estimatedCostMin: 32,
      estimatedCostMax: 46,
      photoUrl: '/packaging/heavy_duty_corrugated_master.jpg',
      marketPhrase: 'Bhaiya, godown melon box chahiye.',
      description: 'Side aeration holes release trapped metabolic heat.'
    }
  },

  // ----------------------------------------------------
  // GRAINS & PULSES (ANAAJ AUR DALEIN)
  // ----------------------------------------------------
  {
    id: 'crop_wheat',
    name: 'Wheat',
    hindiName: 'Gehun (गेहूं)',
    category: 'Grain_Pulse',
    icon: '🌾',
    needsTempControl: false,
    idealTempC: 22,
    shelfLifeDaysAmbient: 365,
    shelfLifeDaysCold: 730,
    respirationRate: 0.1,
    primaryBulkPackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg PP/HDPE Woven Bag (or Jute Gunny Bag)',
      simpleHindiName: '50 kg Gehun Ki Woven Bori / Taat Ka Bora',
      capacityKg: 50,
      estimatedCostInr: '₹18 – ₹28 / bori',
      estimatedCostMin: 18,
      estimatedCostMax: 28,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, 50 kg gehun ke liye food grade PP woven bori ya taat ki bori chahiye.',
      description: 'High tensile strength holds 50 kg without tearing during hook handling and truck loading.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg Laminated PP Woven Bag (Moisture Shield)',
      simpleHindiName: '50 kg Laminated Gehun Bori (Seelan Se Bachav)',
      capacityKg: 50,
      estimatedCostInr: '₹22 – ₹32 / bori',
      estimatedCostMin: 22,
      estimatedCostMax: 32,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, barish aur seelan se bachne waali laminated bori chahiye gehun ke liye.',
      description: 'Polyethylene outer lamination blocks rain and road splash during open wagon transit.'
    },
    storagePackaging: {
      id: 'PKG_BULK_HERMETIC',
      simpleName: '50 kg Hermetic Grain Storage Bag (PICS Bag)',
      simpleHindiName: '50 kg Hermetic Bori (Keeda/Ghun Na Lagne Waali)',
      capacityKg: 50,
      estimatedCostInr: '₹65 – ₹95 / bag',
      estimatedCostMin: 65,
      estimatedCostMax: 95,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, gehun me keeda/ghun na lage aisi hermetic PICS bori chahiye.',
      description: 'Multi-layer oxygen-barrier bag suffocates weevils naturally without poisonous chemical tablets.'
    }
  },
  {
    id: 'crop_rice',
    name: 'Paddy / Rice',
    hindiName: 'Dhaan / Chawal (धान / चावल)',
    category: 'Grain_Pulse',
    icon: '🌾',
    needsTempControl: false,
    idealTempC: 22,
    shelfLifeDaysAmbient: 365,
    shelfLifeDaysCold: 730,
    respirationRate: 0.1,
    primaryBulkPackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg Woven Sack (PP or Traditional Jute)',
      simpleHindiName: '50 kg Dhaan Ki Bori (PP Woven / Taat)',
      capacityKg: 50,
      estimatedCostInr: '₹18 – ₹28 / bori',
      estimatedCostMin: 18,
      estimatedCostMax: 28,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, 50 kg dhaan ke liye standard mandi bori chahiye.',
      description: 'Breathable woven structure prevents grain sweating and yellowing.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg Reinforced Woven Sack',
      simpleHindiName: '50 kg Heavy Duty Dhaan Bori',
      capacityKg: 50,
      estimatedCostInr: '₹20 – ₹30 / bori',
      estimatedCostMin: 20,
      estimatedCostMax: 30,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, railway wagon / interstate transit waali chawal bori chahiye.',
      description: 'High tear strength withstands multi-tier warehouse stacking.'
    },
    storagePackaging: {
      id: 'PKG_BULK_HERMETIC',
      simpleName: '50 kg Hermetic Grain Bag',
      simpleHindiName: 'Keeda-Mukt Hermetic Chawal Bori (50 kg)',
      capacityKg: 50,
      estimatedCostInr: '₹65 – ₹95 / bag',
      estimatedCostMin: 65,
      estimatedCostMax: 95,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, ghun/keede se bachav ke liye hermetic grain storage bag chahiye.',
      description: 'Protects aroma and moisture equilibrium without chemical pesticide fumigation.'
    }
  },
  {
    id: 'crop_maize',
    name: 'Maize / Corn',
    hindiName: 'Makka (मक्का)',
    category: 'Grain_Pulse',
    icon: '🌽',
    needsTempControl: false,
    idealTempC: 22,
    shelfLifeDaysAmbient: 180,
    shelfLifeDaysCold: 365,
    respirationRate: 0.2,
    primaryBulkPackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg PP Woven Sack',
      simpleHindiName: '50 kg Makka Ki Woven Bori',
      capacityKg: 50,
      estimatedCostInr: '₹16 – ₹24 / bori',
      estimatedCostMin: 16,
      estimatedCostMax: 24,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, 50 kg makka ke liye PP woven bori chahiye.',
      description: 'Prevents bag burst under heavy corn grain weight.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg Heavy Laminated Woven Bag',
      simpleHindiName: '50 kg Makka Laminated Bori',
      capacityKg: 50,
      estimatedCostInr: '₹20 – ₹28 / bori',
      estimatedCostMin: 20,
      estimatedCostMax: 28,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, moisture proof makka bori chahiye.',
      description: 'Stops fungal aflatoxin growth caused by transit humidity.'
    },
    storagePackaging: {
      id: 'PKG_BULK_HERMETIC',
      simpleName: '50 kg Hermetic Storage Bag',
      simpleHindiName: 'Makka Hermetic Storage Bag (50 kg)',
      capacityKg: 50,
      estimatedCostInr: '₹65 – ₹95 / bag',
      estimatedCostMin: 65,
      estimatedCostMax: 95,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, makka godown storage ke liye airtight hermetic bag chahiye.',
      description: 'Eliminates weevil damage and preserves germination power.'
    }
  },
  {
    id: 'crop_pulses',
    name: 'Pulses / Dal / Chickpea',
    hindiName: 'Dal / Chana / Moong (दाल / चना / मूंग)',
    category: 'Grain_Pulse',
    icon: '🟤',
    needsTempControl: false,
    idealTempC: 20,
    shelfLifeDaysAmbient: 365,
    shelfLifeDaysCold: 730,
    respirationRate: 0.1,
    primaryBulkPackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '30–50 kg PP Woven Sack',
      simpleHindiName: '30-50 kg Dal/Chana Ki Bori',
      capacityKg: 50,
      estimatedCostInr: '₹18 – ₹26 / bori',
      estimatedCostMin: 18,
      estimatedCostMax: 26,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, dal/chana ke liye 50 kg bori chahiye.',
      description: 'Tough woven fabric resists hook punctures.'
    },
    longDistancePackaging: {
      id: 'PKG_BULK_HDPE_WOVEN',
      simpleName: '50 kg Moisture-Resistant Woven Bag',
      simpleHindiName: '50 kg Dal Transport Bori',
      capacityKg: 50,
      estimatedCostInr: '₹22 – ₹30 / bori',
      estimatedCostMin: 22,
      estimatedCostMax: 30,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, door transit ke liye moisture resistant dal bori chahiye.',
      description: 'Prevents dampness clumping.'
    },
    storagePackaging: {
      id: 'PKG_BULK_HERMETIC',
      simpleName: 'Hermetic Grain Pouch (Zero Ghun)',
      simpleHindiName: 'Dal Keede Se Bachav Hermetic Bag',
      capacityKg: 50,
      estimatedCostInr: '₹65 – ₹95 / bag',
      estimatedCostMin: 65,
      estimatedCostMax: 95,
      photoUrl: '/packaging/bulk_leno_sack.jpg',
      marketPhrase: 'Bhaiya, dal me ghun na lage aisi hermetic bori chahiye.',
      description: '100% airtight to stop pulse beetles and bruchids naturally.'
    }
  }
];
