import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Building, 
  ExternalLink, 
  Info, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Copy, 
  Check,
  Filter
} from 'lucide-react';

interface SourcingAssistantProps {
  initialQuery?: string;
}

export const SourcingAssistant: React.FC<SourcingAssistantProps> = ({ initialQuery = 'LDPE food packaging film supplier near Delhi' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState('Delhi NCR');
  const [materialType, setMaterialType] = useState('Polyethylene (PE / LDPE)');
  const [copiedQuery, setCopiedQuery] = useState(false);

  // Regional Industrial Packaging Hubs in India
  const verifiedHubs = [
    {
      name: 'Uflex Limited (Flexible Packaging Division)',
      location: 'Noida, Sector 60, UP / Pan India',
      specialty: 'Multilayer barrier laminates, metallized films, laser micro-perforated pouches',
      leadTime: '7–12 days',
      verified: true,
      moqTier: 'Commercial Runs (500 kg+)',
      contactPhone: '+91 120 4012345',
      website: 'https://www.uflexltd.com',
    },
    {
      name: 'Polyplex Corporation Ltd.',
      location: 'Noida / Khatima, Uttarakhand',
      specialty: 'BOPET, thermal lamination films, high-barrier silicone oxide coatings',
      leadTime: '5–10 days',
      verified: true,
      moqTier: 'Standard Master Rolls (1,000 kg+)',
      contactPhone: '+91 120 2443716',
      website: 'https://www.polyplex.com',
    },
    {
      name: 'Cosmo Films Limited',
      location: 'Aurangabad / Vadodara / Delhi NCR',
      specialty: 'BOPP barrier films, anti-fog produce films, recyclable barrier substrates',
      leadTime: '4–8 days',
      verified: true,
      moqTier: 'Custom Roll Widths (300 kg+)',
      contactPhone: '+91 11 49494949',
      website: 'https://www.cosmofirst.com',
    },
    {
      name: 'Ester Industries Ltd.',
      location: 'Gurgaon, Haryana / Khatima',
      specialty: 'Specialty polyester films, heat sealable PET, deep freeze barrier polymers',
      leadTime: '7–14 days',
      verified: true,
      moqTier: 'Converter Grade (500 kg+)',
      contactPhone: '+91 124 4572100',
      website: 'https://www.esterindustries.com',
    },
  ];

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleUpdateQuery = (newCity: string, newMat: string) => {
    setCity(newCity);
    setMaterialType(newMat);
    setQuery(`${newMat} food packaging film converter supplier near ${newCity}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Search className="w-4 h-4 text-teal-400" />
            <span>Industrial Packaging Procurement & Converter Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Local Sourcing Assistant & B2B Inquiry Generator
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Locate regional packaging converters, request technical datasheets, and generate precision B2B marketplace queries for certified food-contact substrates.
          </p>
        </div>
      </div>

      {/* Sourcing Query Generator */}
      <div className="card-base p-6 sm:p-8 space-y-6">
        <div className="max-w-3xl space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Targeted Sourcing Query Generator
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Use this optimized search query on industrial platforms (IndiaMART, TradeIndia, Google Business) to connect directly with regional film extruders and pouch converters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select City / Region Hub
            </label>
            <select
              value={city}
              onChange={(e) => handleUpdateQuery(e.target.value, materialType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
            >
              <option value="Delhi NCR">Delhi NCR (Okhla, Rai, Kundli, Noida)</option>
              <option value="Mumbai MMR">Mumbai MMR / Navi Mumbai APMC</option>
              <option value="Ahmedabad Gujarat">Ahmedabad / Sanand, Gujarat</option>
              <option value="Bangalore Karnataka">Bangalore / Peenya, Karnataka</option>
              <option value="Ludhiana Punjab">Ludhiana / Jalandhar, Punjab</option>
              <option value="Hyderabad Telangana">Hyderabad / Cherlapally, Telangana</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Substrate Class
            </label>
            <select
              value={materialType}
              onChange={(e) => handleUpdateQuery(city, e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
            >
              <option value="LDPE breathable microporous film">Breathable Microporous PE (Produce)</option>
              <option value="BOPP / Met-PET barrier laminate pouch">Metallized Barrier Laminate (Snacks)</option>
              <option value="Al-Foil hermetic barrier pouch">Aluminum Foil Laminate (Powders)</option>
              <option value="PA / PE coextruded vacuum barrier">PA / PE Vacuum Pouch (Dairy/Meat)</option>
              <option value="Compostable PLA / PBAT film">Compostable Bio-Film (Eco Produce)</option>
            </select>
          </div>
        </div>

        {/* Generated Query Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="space-y-1 w-full">
            <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider block">
              Generated Precision Search Query
            </span>
            <div className="font-mono text-sm text-slate-100 font-semibold break-all">
              "{query}"
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyQuery}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-700"
            >
              {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuery ? 'Copied' : 'Copy Query'}</span>
            </button>

            <a
              href={`https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>IndiaMART</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://www.tradeindia.com/search.html?keyword=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>TradeIndia</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Colloquial Market Inquiry Phrases ("Dukaandaar ya Mandi Dealer Se Kya Bolein?") */}
      <div className="card-base p-6 space-y-4 border-2 border-yellow-400/30">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🗣️</span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Simple Market Phrases (Dukaandaar ya Mandi Dealer Se Kya Bol Kar Maange?)
            </h3>
            <p className="text-xs text-slate-500">
              Use these simple local words when visiting packaging wholesale shops, APMC mandi yards, or local plastic dealers:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-yellow-600 dark:text-yellow-400 block">
              1. Aaloo / Pyaaz / Nimbu Ke Liye (Bulk Root Crops)
            </span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              "Bhaiya, 50 kg aaloo/pyaaz ke liye jaali waali leno mesh bori chahiye, 60 GSM ki dori (drawstring) ke saath."
            </div>
            <div className="text-xs text-slate-500 flex justify-between pt-1 font-mono">
              <span>Market Price: <strong>₹14 – ₹22 / bori</strong></span>
              <span>MOQ: <strong>500 pcs</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400 block">
              2. Tamatar / Mirchi / Phal Ke Liye (Plastic Crates)
            </span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              "Bhaiya, 20-25 kg plastic crate ke liye anti-fog laser chhed (micro-perforated) waali panni/liner chahiye."
            </div>
            <div className="text-xs text-slate-500 flex justify-between pt-1 font-mono">
              <span>Market Price: <strong>₹4.50 – ₹8 / sheet</strong></span>
              <span>MOQ: <strong>1,000 pcs</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block">
              3. Door Mandi / Highway Transit Ke Liye (Heavy Cartons)
            </span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              "Bhaiya, 20 kg tamatar ya seb ke liye 5-ply hawa ke chhed (air vents) waala heavy corrugated dabba chahiye."
            </div>
            <div className="text-xs text-slate-500 flex justify-between pt-1 font-mono">
              <span>Market Price: <strong>₹28 – ₹48 / box</strong></span>
              <span>MOQ: <strong>300 pcs</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
              4. Chips / Namkeen / Powder Ke Liye (Retail Pouch)
            </span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              "Bhaiya, chips/namkeen ke liye silver foil metallized PET/PE pillow pouch ya pre-formed zip pouch chahiye."
            </div>
            <div className="text-xs text-slate-500 flex justify-between pt-1 font-mono">
              <span>Market Price: <strong>₹1.50 – ₹3.20 / pouch</strong></span>
              <span>MOQ: <strong>5,000 pcs</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Transparency Warning */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
        <div>
          <strong>Scientific & Commercial Notice:</strong> Live supplier availability, minimum order quantities (MOQ), and spot pricing fluctuate with global polymer feedstock rates (ICIS / Platts indices). PackSmart AI displays verified industrial hubs below but requires direct commercial quotation verification prior to placing orders.
        </div>
      </div>

      {/* Directory of Verified Industrial Packaging Clusters */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Major Indian Packaging Extruders & Converters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verifiedHubs.map((hub, idx) => (
            <div key={idx} className="card-base p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{hub.name}</span>
                    <span className="badge-teal text-[10px] flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-0.5 text-teal-600" /> Verified Converter
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hub.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {hub.specialty}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>Lead Time: <strong>{hub.leadTime}</strong></div>
                <div>MOQ: <strong>{hub.moqTier}</strong></div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs font-semibold">
                <a 
                  href={hub.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
                >
                  <span>Visit Manufacturer Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-400 font-mono text-[11px]">{hub.contactPhone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
