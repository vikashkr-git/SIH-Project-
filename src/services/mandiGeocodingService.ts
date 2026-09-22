import { calculateMandiDistance } from '../data/mandiLocations';

export interface GeoLocationItem {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  specialty?: string;
  sourceType: 'preset' | 'osm' | 'gps' | 'custom';
}

// Built-in Comprehensive Catalog of Indian Agricultural Belts & Mandis
export const EXTENDED_SOURCE_REGIONS: GeoLocationItem[] = [
  { id: 'src_nasik', name: 'Nashik / Niphad (Maharashtra)', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, specialty: 'Onion & Grape Belt', sourceType: 'preset' },
  { id: 'src_pune', name: 'Pune / Narayangaon (Maharashtra)', state: 'Maharashtra', lat: 19.1176, lon: 73.9782, specialty: 'Tomato & Exotic Veggie Belt', sourceType: 'preset' },
  { id: 'src_baramati', name: 'Baramati / Indapur (Maharashtra)', state: 'Maharashtra', lat: 18.1517, lon: 74.5770, specialty: 'Sugarcane, Pomegranate & Milk Belt', sourceType: 'preset' },
  { id: 'src_solapur', name: 'Solapur / Sangola (Maharashtra)', state: 'Maharashtra', lat: 17.6599, lon: 75.9064, specialty: 'Pomegranate & Chilli Belt', sourceType: 'preset' },
  { id: 'src_nagpur', name: 'Nagpur / Katol (Maharashtra)', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, specialty: 'Nagpur Mandarin Orange Belt', sourceType: 'preset' },
  { id: 'src_jalgaon', name: 'Jalgaon / Raver (Maharashtra)', state: 'Maharashtra', lat: 21.0077, lon: 75.5626, specialty: 'Banana Capital of India', sourceType: 'preset' },
  { id: 'src_ratnagiri', name: 'Ratnagiri / Sindhudurg (Maharashtra)', state: 'Maharashtra', lat: 16.9902, lon: 73.3120, specialty: 'Alphonso Mango Belt', sourceType: 'preset' },
  
  { id: 'src_kolar', name: 'Kolar / Chintamani (Karnataka)', state: 'Karnataka', lat: 13.1367, lon: 78.1291, specialty: 'Mega South India Tomato Hub', sourceType: 'preset' },
  { id: 'src_belgaum', name: 'Belagavi / Gokak (Karnataka)', state: 'Karnataka', lat: 15.8497, lon: 74.4977, specialty: 'Vegetables & Sugar Belt', sourceType: 'preset' },
  { id: 'src_shimoga', name: 'Shivamogga / Bhadravati (Karnataka)', state: 'Karnataka', lat: 13.9299, lon: 75.5681, specialty: 'Arecanut & Spices Belt', sourceType: 'preset' },

  { id: 'src_agra', name: 'Agra / Khandauli Potato Belt (UP)', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081, specialty: 'Largest North India Potato Belt', sourceType: 'preset' },
  { id: 'src_meerut', name: 'Meerut / Hapur Agri Zone (UP)', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064, specialty: 'Sugarcane & Green Vegetables', sourceType: 'preset' },
  { id: 'src_varanasi', name: 'Varanasi / Mirzapur (UP)', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, specialty: 'Green Chili & Perishable Vegetables', sourceType: 'preset' },
  { id: 'src_gorakhpur', name: 'Gorakhpur / Deoria (UP)', state: 'Uttar Pradesh', lat: 26.7606, lon: 83.3732, specialty: 'Paddy & Winter Greens', sourceType: 'preset' },
  { id: 'src_lucknow', name: 'Malihabad / Lucknow (UP)', state: 'Uttar Pradesh', lat: 26.9200, lon: 80.7100, specialty: 'Dasheri Mango Geographical Indication', sourceType: 'preset' },

  { id: 'src_karnal', name: 'Karnal / Kurukshetra (Haryana)', state: 'Haryana', lat: 29.6857, lon: 76.9905, specialty: 'Basmati Rice & Wheat Belt', sourceType: 'preset' },
  { id: 'src_sonipat', name: 'Sonipat / Murthal (Haryana)', state: 'Haryana', lat: 28.9931, lon: 77.0151, specialty: 'Mushroom & Polyhouse Vegetables', sourceType: 'preset' },

  { id: 'src_amritsar', name: 'Amritsar / Jalandhar (Punjab)', state: 'Punjab', lat: 31.6340, lon: 74.8723, specialty: 'Seed Potato & Wheat Bowl', sourceType: 'preset' },
  { id: 'src_abohar', name: 'Abohar / Fazilka (Punjab)', state: 'Punjab', lat: 30.1453, lon: 74.1994, specialty: 'Kinnow Mandarin Citrus Belt', sourceType: 'preset' },

  { id: 'src_indore', name: 'Indore / Malwa Belt (MP)', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, specialty: 'Potato, Onion & Garlic Belt', sourceType: 'preset' },
  { id: 'src_mandsaur', name: 'Mandsaur / Neemuch (MP)', state: 'Madhya Pradesh', lat: 24.0722, lon: 75.0689, specialty: 'Garlic & Medicinal Crop Hub', sourceType: 'preset' },

  { id: 'src_jaipur', name: 'Jaipur / Chomu Vegetable Belt (Rajasthan)', state: 'Rajasthan', lat: 27.1724, lon: 75.7222, specialty: 'Polyhouse Tomato & Cucumber', sourceType: 'preset' },
  { id: 'src_alwar', name: 'Alwar / Tijara (Rajasthan)', state: 'Rajasthan', lat: 27.5530, lon: 76.6346, specialty: 'Onion & Mustard Belt', sourceType: 'preset' },
  { id: 'src_sriganganagar', name: 'Sri Ganganagar (Rajasthan)', state: 'Rajasthan', lat: 29.9038, lon: 73.8772, specialty: 'Kinnow & Cotton Belt', sourceType: 'preset' },

  { id: 'src_guntur', name: 'Guntur / Tenali Chilli Belt (AP)', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, specialty: 'Guntur Red Chilli Capital', sourceType: 'preset' },
  { id: 'src_anantapur', name: 'Anantapur / Kadapa (AP)', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006, specialty: 'Banana, Sweet Orange & Papaya', sourceType: 'preset' },

  { id: 'src_samastipur', name: 'Samastipur / Vaishali (Bihar)', state: 'Bihar', lat: 25.8629, lon: 85.7811, specialty: 'Vegetables & Maize Hub', sourceType: 'preset' },
  { id: 'src_muzaffarpur', name: 'Muzaffarpur (Bihar)', state: 'Bihar', lat: 26.1209, lon: 85.3647, specialty: 'Shahi Litchi Geographical Indication', sourceType: 'preset' },

  { id: 'src_hooghly', name: 'Hooghly / Burdwan (West Bengal)', state: 'West Bengal', lat: 22.9038, lon: 88.3897, specialty: 'High-Yield Potato & Paddy', sourceType: 'preset' },
  { id: 'src_anand', name: 'Anand / Kheda (Gujarat)', state: 'Gujarat', lat: 22.5645, lon: 72.9289, specialty: 'Tobacco, Tomato & Banana', sourceType: 'preset' },
  { id: 'src_shimla', name: 'Kotkhai / Theog Apple Valley (HP)', state: 'Himachal Pradesh', lat: 31.1189, lon: 77.5312, specialty: 'Delicious Apple Orchards', sourceType: 'preset' },
  { id: 'src_kullu', name: 'Kullu / Manali Valley (HP)', state: 'Himachal Pradesh', lat: 31.9579, lon: 77.1095, specialty: 'Plums, Pears & Apples', sourceType: 'preset' },
];

export const EXTENDED_APMC_MANDIS: GeoLocationItem[] = [
  { id: 'mandi_azadpur', name: 'Azadpur Mandi (Delhi)', state: 'Delhi NCR', specialty: 'Asia\'s Largest Fruits & Vegetables Terminal', lat: 28.7165, lon: 77.1770, sourceType: 'preset' },
  { id: 'mandi_ghazipur', name: 'Ghazipur Sabzi & Fruit Mandi (Delhi)', state: 'Delhi NCR', specialty: 'East Delhi Wholesale Hub', lat: 28.6271, lon: 77.3292, sourceType: 'preset' },
  { id: 'mandi_okhla', name: 'Okhla Sabzi Mandi (Delhi)', state: 'Delhi NCR', specialty: 'South Delhi Wholesale Terminal', lat: 28.5583, lon: 77.2796, sourceType: 'preset' },

  { id: 'mandi_vashi', name: 'Vashi APMC Market (Navi Mumbai)', state: 'Maharashtra', specialty: 'Western India Wholesale Hub', lat: 19.0760, lon: 72.9986, sourceType: 'preset' },
  { id: 'mandi_lasalgaon', name: 'Lasalgaon Mandi (Nashik)', state: 'Maharashtra', specialty: 'Asia\'s Largest Onion Market', lat: 20.1472, lon: 74.2255, sourceType: 'preset' },
  { id: 'mandi_pune_gultekdi', name: 'Gultekdi Market Yard (Pune APMC)', state: 'Maharashtra', specialty: 'Major Western Agri Market', lat: 18.4912, lon: 73.8647, sourceType: 'preset' },
  { id: 'mandi_nagpur', name: 'Nagpur Cotton Market & APMC Yard', state: 'Maharashtra', specialty: 'Central India Citrus & Veggie Terminal', lat: 21.1458, lon: 79.0882, sourceType: 'preset' },
  { id: 'mandi_baramati', name: 'Baramati APMC Yard', state: 'Maharashtra', specialty: 'Sugar, Veg & Grain Market', lat: 18.1517, lon: 74.5770, sourceType: 'preset' },

  { id: 'mandi_kolar', name: 'Kolar APMC Mandi', state: 'Karnataka', specialty: 'Major South India Tomato Hub', lat: 13.1367, lon: 78.1291, sourceType: 'preset' },
  { id: 'mandi_yeshwanthpur', name: 'Yeshwanthpur APMC Yard (Bengaluru)', state: 'Karnataka', specialty: 'South India Mega Distribution Hub', lat: 13.0238, lon: 77.5505, sourceType: 'preset' },

  { id: 'mandi_guntur', name: 'Guntur Mirchi Yard', state: 'Andhra Pradesh', specialty: 'Asia\'s Largest Chilli Terminal', lat: 16.3067, lon: 80.4365, sourceType: 'preset' },
  
  { id: 'mandi_jaipur', name: 'Jaipur Mohana Mandi', state: 'Rajasthan', specialty: 'Northern Fruits & Veggies Terminal', lat: 26.8188, lon: 75.7621, sourceType: 'preset' },
  { id: 'mandi_khanna', name: 'Khanna Mandi (Ludhiana)', state: 'Punjab', specialty: 'Asia\'s Largest Grain Terminal', lat: 30.7071, lon: 76.2163, sourceType: 'preset' },

  { id: 'mandi_indore', name: 'Indore Devi Ahilya Bai APMC (Choithram)', state: 'Madhya Pradesh', specialty: 'Central India Potato & Onion Mandi', lat: 22.7196, lon: 75.8577, sourceType: 'preset' },
  { id: 'mandi_bhopal', name: 'Bhopal Karond Mandi', state: 'Madhya Pradesh', specialty: 'Central Vegetables Terminal', lat: 23.2980, lon: 77.4100, sourceType: 'preset' },

  { id: 'mandi_unjha', name: 'Unjha APMC Mandi', state: 'Gujarat', specialty: 'Global Cumin (Jeera) & Spice Capital', lat: 23.8037, lon: 72.3927, sourceType: 'preset' },
  { id: 'mandi_jamalpur', name: 'Jamalpur APMC Wholesale (Ahmedabad)', state: 'Gujarat', specialty: 'Gujarat Mega Wholesale Market', lat: 23.0130, lon: 72.5850, sourceType: 'preset' },
  { id: 'mandi_surat', name: 'Surat APMC Sardar Market', state: 'Gujarat', specialty: 'South Gujarat Agri Wholesale', lat: 21.1959, lon: 72.8302, sourceType: 'preset' },

  { id: 'mandi_lucknow', name: 'Lucknow Dubagga Mandi', state: 'Uttar Pradesh', specialty: 'Awadh Mango & Vegetable Hub', lat: 26.8724, lon: 80.8653, sourceType: 'preset' },
  { id: 'mandi_bareilly', name: 'Bareilly Delapeer Mandi', state: 'Uttar Pradesh', specialty: 'Rohilkhand Regional Wholesale Market', lat: 28.3670, lon: 79.4304, sourceType: 'preset' },
  { id: 'mandi_varanasi', name: 'Varanasi Chandpur / Pahariya Mandi', state: 'Uttar Pradesh', specialty: 'Purvanchal Mega Wholesale Yard', lat: 25.3340, lon: 82.9870, sourceType: 'preset' },
  { id: 'mandi_agra', name: 'Agra Sikandra APMC Mandi', state: 'Uttar Pradesh', specialty: 'North India Potato Auction Yard', lat: 27.2200, lon: 77.9400, sourceType: 'preset' },

  { id: 'mandi_patna', name: 'Patna Bazaar Samiti (Meenapur)', state: 'Bihar', specialty: 'Eastern Vegetables & Grain Hub', lat: 25.5941, lon: 85.1376, sourceType: 'preset' },
  { id: 'mandi_kolkata', name: 'Kolkata Mechua / Koley Market', state: 'West Bengal', specialty: 'East India Mega Fruits Terminal', lat: 22.5726, lon: 88.3639, sourceType: 'preset' },
  { id: 'mandi_hyderabad', name: 'Bowenpally / Gaddiannaram Mandi', state: 'Telangana', specialty: 'Deccan Vegetables & Fruit Terminal', lat: 17.4729, lon: 78.4862, sourceType: 'preset' },
  { id: 'mandi_koyambedu', name: 'Koyambedu Wholesale Market Complex (Chennai)', state: 'Tamil Nadu', specialty: 'South India Largest Perishable Market', lat: 13.0694, lon: 80.1948, sourceType: 'preset' },
  { id: 'mandi_shimla', name: 'Shimla Dhalli Fruit Market', state: 'Himachal Pradesh', specialty: 'Himalayan Apple Auction Terminal', lat: 31.1189, lon: 77.2081, sourceType: 'preset' },
];

/**
 * Live search that queries local catalog first, and then OpenStreetMap Nominatim
 */
export async function searchLocationsOnline(
  query: string, 
  type: 'source' | 'mandi'
): Promise<GeoLocationItem[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // 1. Instant local matching
  const localList = type === 'source' ? EXTENDED_SOURCE_REGIONS : EXTENDED_APMC_MANDIS;
  const localMatches = localList.filter(item => 
    item.name.toLowerCase().includes(clean) || 
    item.state.toLowerCase().includes(clean) ||
    (item.specialty && item.specialty.toLowerCase().includes(clean))
  );

  // If we already have strong local matches, return them immediately
  if (localMatches.length >= 3 || clean.length < 3) {
    return localMatches;
  }

  // 2. Fetch live from OpenStreetMap Nominatim for arbitrary typed town/village/mandi in India
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2600); // 2.6s max timeout
    
    const searchQuery = type === 'mandi' 
      ? (clean.includes('mandi') || clean.includes('market') ? `${clean}, India` : `${clean} mandi, India`)
      : `${clean}, India`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&addressdetails=1&limit=5`;
    
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en,hi',
      }
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        const osmResults: GeoLocationItem[] = data.map((item: any, idx: number) => {
          const state = item.address?.state || item.address?.region || 'India';
          const primaryName = item.name || item.display_name.split(',')[0];
          return {
            id: `osm_${Date.now()}_${idx}`,
            name: `${primaryName} (${state})`,
            state: state,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            specialty: item.display_name.split(',').slice(1, 3).join(', ').trim() || 'Map Location',
            sourceType: 'osm'
          };
        });

        // Combine deduplicated
        const combined = [...localMatches];
        for (const osmItem of osmResults) {
          const exists = combined.some(c => 
            Math.abs(c.lat - osmItem.lat) < 0.05 && Math.abs(c.lon - osmItem.lon) < 0.05
          );
          if (!exists) {
            combined.push(osmItem);
          }
        }
        return combined;
      }
    }
  } catch (err) {
    // Network timeout or offline - return local matches safely
  }

  return localMatches;
}

/**
 * Fetch current GPS location and reverse geocode via Nominatim
 */
export async function getDeviceCurrentLocation(): Promise<GeoLocationItem | null> {
  if (!navigator.geolocation) {
    throw new Error('Aapke device mein GPS location support nahi hai.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12`;
          const resp = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (resp.ok) {
            const data = await resp.json();
            const town = data.address?.village || data.address?.town || data.address?.city || data.address?.county || 'Farm Location';
            const state = data.address?.state || 'India';

            resolve({
              id: `gps_${Date.now()}`,
              name: `📍 ${town} (${state}) - Mera Khet`,
              state: state,
              lat: Math.round(lat * 10000) / 10000,
              lon: Math.round(lon * 10000) / 10000,
              specialty: 'Device GPS Live Position',
              sourceType: 'gps'
            });
            return;
          }
        } catch {
          // Reverse geocode failed, return raw coordinates
        }

        resolve({
          id: `gps_${Date.now()}`,
          name: `📍 Khet Coords: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`,
          state: 'GPS Detected',
          lat: Math.round(lat * 10000) / 10000,
          lon: Math.round(lon * 10000) / 10000,
          specialty: 'Device GPS Live Position',
          sourceType: 'gps'
        });
      },
      (error) => {
        reject(new Error(error.message || 'GPS location access denied. Please allow location access.'));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}
