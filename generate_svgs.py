import os

os.makedirs('public/packaging', exist_ok=True)

templates = {
    'micro_perforated_pe': ('Micro-Perforated LDPE Produce Film', '#0D9488', 'Perforated Laser Pores (90-120 um)', 'Translucent Breathable Polyethylene'),
    'breathable_pe': ('Breathable Microporous PE Film', '#0F766E', 'Sub-Micron CaCO3 Micropores', 'High O2/CO2 Gas Permeability'),
    'breathable_pp': ('Perforated Breathable Polypropylene', '#14B8A6', 'Oriented Polypropylene (OPP) + Vents', 'Anti-Fog Clarity + Respiration Exchange'),
    'metallized_pet_pe': ('Metallized PET / PE Laminate', '#64748B', 'Met-PET (12um) / LDPE (60um)', 'High Oxygen & Moisture Light Barrier'),
    'aluminum_laminate': ('High-Barrier Aluminum Laminate Pouch', '#475569', 'PET / Al-Foil (9um) / PE (70um)', 'Total Hermetic Light & Gas Seal'),
    'aluminum_foil_laminate': ('Aluminum Foil High-Barrier Laminate', '#334155', 'Al-Foil (7-12um) / Nylon / PE', 'Zero OTR / Zero WVTR Absolute Barrier'),
    'pa_pe_vacuum': ('PA / PE Coextruded Vacuum Pouch', '#2563EB', 'Polyamide (Nylon) / PE Hermetic', 'Puncture Resistant Vacuum Gas Flush'),
    'bopp_pe': ('BOPP / Polyethylene Laminated Film', '#F59E0B', 'Biaxially Oriented PP / Sealant PE', 'High Tensile Crisp Snack Protection'),
    'pe_film': ('Heavy-Duty Coextruded PE Film', '#0284C7', 'Metallocene LLDPE / LDPE Matrix', 'Cold-Resilient Sub-Zero Ductility'),
    'hdpe': ('High-Density PE Woven Liner', '#475569', 'High-Density Polyethylene Woven', 'Rigid Moisture & Insect Barrier'),
    'high_barrier_laminate': ('PET / EVOH / PE High-Barrier Laminate', '#7C3AED', 'PET (12um) / EVOH (5um) / PE (50um)', 'Recyclable Gas Barrier (Non-Foil)'),
    'bio_pla_pbat': ('Certified Compostable PLA / PBAT Bio-Film', '#16A34A', 'Polylactic Acid / PBAT Polymer', '100% Biodegradable & Compostable'),
    'rpet_pe_circular': ('Post-Consumer Recycled rPET / PE Circular Film', '#059669', '70% PCR rPET / Virgin PE Sealant', 'Circular Economy Mono-Stream Compatible'),
    'pp_cup_foil_lid': ('Thermoformed PP Cup with Die-Cut Foil Lid', '#D97706', 'Rigid PP Cup / Peelable Lacquer Lid', 'Hermetic Cup with Easy-Peel Hermetic Seal'),
    'ldpe_bag': ('Standard Low-Density Polyethylene Bag', '#64748B', 'Standard Extruded LDPE Film', 'General Purpose Flexible Pouch')
}

for key, (title, color, sub, desc) in templates.items():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" fill="none">
  <rect width="400" height="280" rx="16" fill="#0F172A"/>
  <rect x="8" y="8" width="384" height="264" rx="12" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <!-- Packaging Mockup -->
  <path d="M120 45 L280 45 L270 205 L130 205 Z" fill="{color}" fill-opacity="0.15" stroke="{color}" stroke-width="2" stroke-linejoin="round"/>
  <!-- Pouch Sealing Lines -->
  <line x1="120" y1="55" x2="280" y2="55" stroke="{color}" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="130" y1="195" x2="270" y2="195" stroke="{color}" stroke-width="2" stroke-dasharray="3 3"/>
  <!-- Notches and Core Detail -->
  <path d="M117 75 L125 78 L117 81" stroke="{color}" stroke-width="1.5" fill="none"/>
  <rect x="150" y="90" width="100" height="75" rx="8" fill="#0F172A" stroke="{color}" stroke-width="1" stroke-opacity="0.6"/>
  <!-- Layer Lines inside inspection window -->
  <line x1="160" y1="110" x2="240" y2="110" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
  <line x1="160" y1="125" x2="240" y2="125" stroke="{color}" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="140" x2="240" y2="140" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/>
  <!-- Title & Text -->
  <text x="200" y="230" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">{title}</text>
  <text x="200" y="250" text-anchor="middle" fill="{color}" font-family="system-ui, sans-serif" font-size="11" font-weight="600">{sub}</text>
</svg>'''
    with open(f'public/packaging/{key}.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

print('Generated 15 packaging SVGs')
