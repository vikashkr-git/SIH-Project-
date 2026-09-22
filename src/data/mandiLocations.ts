export interface MandiLocation {
  id: string;
  name: string;
  state: string;
  specialty: string;
  lat: number;
  lon: number;
}

export interface FarmerSourceRegion {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export const MAJOR_APMC_MANDIS: MandiLocation[] = [
  { id: 'mandi_azadpur', name: 'Azadpur Mandi (Delhi)', state: 'Delhi NCR', specialty: 'Asia\'s Largest Fruits & Vegetables Market', lat: 28.7165, lon: 77.1770 },
  { id: 'mandi_vashi', name: 'Vashi APMC (Navi Mumbai)', state: 'Maharashtra', specialty: 'Western India Wholesale Hub', lat: 19.0760, lon: 72.9986 },
  { id: 'mandi_lasalgaon', name: 'Lasalgaon Mandi (Nashik)', state: 'Maharashtra', specialty: 'Asia\'s Largest Onion Market', lat: 20.1472, lon: 74.2255 },
  { id: 'mandi_kolar', name: 'Kolar APMC Mandi', state: 'Karnataka', specialty: 'Major South India Tomato Hub', lat: 13.1367, lon: 78.1291 },
  { id: 'mandi_guntur', name: 'Guntur Mirchi Yard', state: 'Andhra Pradesh', specialty: 'Asia\'s Largest Chilli Market', lat: 16.3067, lon: 80.4365 },
  { id: 'mandi_jaipur', name: 'Jaipur Mohana Mandi', state: 'Rajasthan', specialty: 'Northern Fruits & Vegetables Terminal', lat: 26.8188, lon: 75.7621 },
  { id: 'mandi_khanna', name: 'Khanna Mandi (Ludhiana)', state: 'Punjab', specialty: 'Asia\'s Largest Grain Terminal', lat: 30.7071, lon: 76.2163 },
  { id: 'mandi_indore', name: 'Indore Devi Ahilya Bai APMC', state: 'Madhya Pradesh', specialty: 'Central India Potato & Onion Mandi', lat: 22.7196, lon: 75.8577 },
  { id: 'mandi_unjha', name: 'Unjha APMC Mandi', state: 'Gujarat', specialty: 'Global Cumin (Jeera) & Spice Capital', lat: 23.8037, lon: 72.3927 },
  { id: 'mandi_lucknow', name: 'Lucknow Dubagga Mandi', state: 'Uttar Pradesh', specialty: 'Awadh Mango & Vegetable Hub', lat: 26.8724, lon: 80.8653 },
  { id: 'mandi_bareilly', name: 'Bareilly Delapeer Mandi', state: 'Uttar Pradesh', specialty: 'Rohilkhand Regional Wholesale Market', lat: 28.3670, lon: 79.4304 },
  { id: 'mandi_patna', name: 'Patna Bazaar Samiti (Meenapur)', state: 'Bihar', specialty: 'Eastern Vegetables & Grain Hub', lat: 25.5941, lon: 85.1376 },
  { id: 'mandi_kolkata', name: 'Kolkata Mechua / Koley Market', state: 'West Bengal', specialty: 'East India Mega Fruits Terminal', lat: 22.5726, lon: 88.3639 },
  { id: 'mandi_hyderabad', name: 'Bowenpally / Gaddiannaram Mandi', state: 'Telangana', specialty: 'Deccan Vegetables & Fruit Terminal', lat: 17.4729, lon: 78.4862 },
  { id: 'mandi_shimla', name: 'Shimla Dhalli Fruit Market', state: 'Himachal Pradesh', specialty: 'Himalayan Apple Auction Terminal', lat: 31.1189, lon: 77.2081 },
];

export const FARMER_SOURCE_REGIONS: FarmerSourceRegion[] = [
  { id: 'src_nasik', name: 'Nashik / Niphad (Maharashtra)', state: 'Maharashtra', lat: 19.9975, lon: 73.7898 },
  { id: 'src_pune', name: 'Pune / Narayangaon (Maharashtra)', state: 'Maharashtra', lat: 19.1176, lon: 73.9782 },
  { id: 'src_kolar', name: 'Kolar / Chintamani (Karnataka)', state: 'Karnataka', lat: 13.1367, lon: 78.1291 },
  { id: 'src_agra', name: 'Agra / Khandauli Potato Belt (UP)', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081 },
  { id: 'src_meerut', name: 'Meerut / Hapur Agri Zone (UP)', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064 },
  { id: 'src_karnal', name: 'Karnal / Kurukshetra (Haryana)', state: 'Haryana', lat: 29.6857, lon: 76.9905 },
  { id: 'src_amritsar', name: 'Amritsar / Jalandhar (Punjab)', state: 'Punjab', lat: 31.6340, lon: 74.8723 },
  { id: 'src_indore', name: 'Indore / Malwa Belt (MP)', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
  { id: 'src_jaipur', name: 'Jaipur / Chomu Vegetable Belt (Rajasthan)', state: 'Rajasthan', lat: 27.1724, lon: 75.7222 },
  { id: 'src_guntur', name: 'Guntur / Tenali Chilli Belt (AP)', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365 },
  { id: 'src_samastipur', name: 'Samastipur / Vaishali (Bihar)', state: 'Bihar', lat: 25.8629, lon: 85.7811 },
  { id: 'src_hooghly', name: 'Hooghly / Burdwan (West Bengal)', state: 'West Bengal', lat: 22.9038, lon: 88.3897 },
  { id: 'src_anand', name: 'Anand / Kheda (Gujarat)', state: 'Gujarat', lat: 22.5645, lon: 72.9289 },
  { id: 'src_shimla', name: 'Kotkhai / Theog Apple Valley (HP)', state: 'Himachal Pradesh', lat: 31.1189, lon: 77.5312 },
  { id: 'src_anantapur', name: 'Anantapur Fruit Belt (AP)', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006 },
];

/**
 * Calculates road distance between coordinates with Indian highway curvature factor (1.28x)
 */
export function calculateMandiDistance(
  sourceLat: number,
  sourceLon: number,
  destLat: number,
  destLon: number
): {
  distanceKm: number;
  travelHours: number;
  transitSeverity: 'Local' | 'Medium' | 'Long_Distance';
  transitDescription: string;
} {
  const R = 6371; // Earth radius in km
  const dLat = (destLat - sourceLat) * (Math.PI / 180);
  const dLon = (destLon - sourceLon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(sourceLat * (Math.PI / 180)) *
      Math.cos(destLat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  // Real Indian road route factor is approx 1.25 - 1.35x of aerial distance
  const roadDistanceKm = Math.round(straightLineKm * 1.28);
  
  // Average truck speed in India: 40-45 km/h including tolls and rural roads
  const travelHours = Math.max(1, Math.round((roadDistanceKm / 42) * 10) / 10);

  let transitSeverity: 'Local' | 'Medium' | 'Long_Distance' = 'Local';
  let transitDescription = 'Local Mandi Haul (< 60 km / under 2 hours). Low vibration stress.';

  if (roadDistanceKm > 250) {
    transitSeverity = 'Long_Distance';
    transitDescription = `Inter-State Long Haul (~${roadDistanceKm} km / ${travelHours} hrs). Severe road bumps & high 7-8 tier vertical stacking compression risk.`;
  } else if (roadDistanceKm > 60) {
    transitSeverity = 'Medium';
    transitDescription = `State Regional Transit (~${roadDistanceKm} km / ${travelHours} hrs). Moderate road vibration.`;
  }

  return {
    distanceKm: roadDistanceKm,
    travelHours,
    transitSeverity,
    transitDescription,
  };
}
