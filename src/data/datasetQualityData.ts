export const DATASET_QUALITY_REPORT = {
  "total_records": 5000,
  "total_columns": 18,
  "columns": [
    "Food_ID",
    "Commodity",
    "Category",
    "Moisture_pct",
    "Fat_pct",
    "Protein_pct",
    "pH",
    "Respiration_Rate",
    "Shelf_Life_Days",
    "Storage_Temperature_C",
    "Relative_Humidity_pct",
    "Storage_Type",
    "Transportation",
    "Recommended_Packaging",
    "Film_Thickness_um",
    "OTR_Class",
    "WVTR_Class",
    "MAP_Suitable"
  ],
  "dataset_name": "Food_Packaging_Dataset_5000.csv",
  "status": "Audited / Prototype Development Set",
  "audit_timestamp": "2026-09-22T00:20:00Z",
  "missing_values": {
    "Food_ID": 0,
    "Commodity": 0,
    "Category": 0,
    "Moisture_pct": 0,
    "Fat_pct": 0,
    "Protein_pct": 0,
    "pH": 0,
    "Respiration_Rate": 0,
    "Shelf_Life_Days": 0,
    "Storage_Temperature_C": 0,
    "Relative_Humidity_pct": 0,
    "Storage_Type": 0,
    "Transportation": 0,
    "Recommended_Packaging": 0,
    "Film_Thickness_um": 0,
    "OTR_Class": 0,
    "WVTR_Class": 0,
    "MAP_Suitable": 0
  },
  "duplicates_count": 0,
  "unique_commodities_count": 20,
  "unique_packaging_count": 13,
  "flagged_anomalies": [
    {
      "food_id": "F00003",
      "commodity": "Tomato",
      "column": "Moisture_pct",
      "value": 101.08,
      "expected_range": "0.0% \u2013 100.0%",
      "severity": "High (Physical impossibility)",
      "recommendation": "Retain in prototype set as documented anomaly; flag for scientific review."
    }
  ],
  "packaging_distribution": {
    "Micro_Perforated_PE": 785,
    "Metallized_PET_PE": 778,
    "PA_PE_Vacuum": 723,
    "HDPE": 490,
    "High_Barrier_Laminate": 263,
    "Breathable_PP": 261,
    "Aluminum_Laminate": 258,
    "BOPP_PE": 258,
    "PE_Film": 246,
    "Aluminum_Foil_Laminate": 240,
    "LDPE_Bag": 238,
    "Breathable_PE": 230,
    "PP_Cup_Foil_Lid": 230
  },
  "category_distribution": {
    "Fresh Produce": 1015,
    "Dairy": 974,
    "Beverage": 505,
    "Bakery": 496,
    "Grain": 490,
    "Snacks": 285,
    "Vegetable": 261,
    "Nuts": 251,
    "Frozen Vegetable": 246,
    "Seafood": 243,
    "Meat": 234
  },
  "otr_distribution": {
    "Low": 1756,
    "High": 1276,
    "Very_Low": 1254,
    "Medium": 714
  },
  "wvtr_distribution": {
    "Very_Low": 2262,
    "Low": 1224,
    "High": 1015,
    "Medium": 499
  },
  "map_distribution": {
    "Yes": 2760,
    "No": 2240
  },
  "storage_type_distribution": {
    "Ambient": 2546,
    "Chilled": 2208,
    "Frozen": 246
  },
  "numerical_stats": {
    "Moisture_pct": {
      "min": 0.0,
      "max": 101.08,
      "mean": 44.22,
      "median": 37.21,
      "std": 37.3
    },
    "Fat_pct": {
      "min": 0.0,
      "max": 86.95,
      "mean": 14.7,
      "median": 4.73,
      "std": 20.23
    },
    "Protein_pct": {
      "min": 0.0,
      "max": 28.11,
      "mean": 10.11,
      "median": 6.99,
      "std": 8.97
    },
    "pH": {
      "min": 3.25,
      "max": 7.32,
      "mean": 5.59,
      "median": 5.9,
      "std": 0.94
    },
    "Shelf_Life_Days": {
      "min": 1.0,
      "max": 423.0,
      "mean": 152.51,
      "median": 122.0,
      "std": 137.83
    },
    "Storage_Temperature_C": {
      "min": -21.1,
      "max": 28.6,
      "mean": 13.68,
      "median": 19.35,
      "std": 12.16
    },
    "Relative_Humidity_pct": {
      "min": 35.18,
      "max": 96.67,
      "mean": 71.58,
      "median": 72.06,
      "std": 14.62
    },
    "Film_Thickness_um": {
      "min": 24.0,
      "max": 112.0,
      "mean": 69.53,
      "median": 76.0,
      "std": 21.06
    }
  }
};
