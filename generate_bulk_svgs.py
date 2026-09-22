import os

bulk_templates = {
    'bulk_micro_perf_liner': ('Bulk Micro-Perforated Crate Liner (25-50 kg)', '#0D9488', 'Heavy-Duty 55µm Laser Vents', 'Badi Wali Packing for 20-50 kg Mandi Crates'),
    'ventilated_leno_bulk_sack': ('Ventilated Leno Mesh Bulk Sack (25-50 kg)', '#F59E0B', 'High-Tensile Breathable Woven Sacks', 'Badi Bori for Potato, Onion & Fruits'),
    'heavy_duty_corrugated_master': ('5-Ply Ventilated Master Box (20-30 kg)', '#8B5CF6', 'Anti-Crush 5-Ply + Produce Liner', 'Bulk Inter-State Transit Master Shipper')
}

for key, (title, color, sub, desc) in bulk_templates.items():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" fill="none">
  <rect width="400" height="280" rx="16" fill="#0F172A"/>
  <rect x="8" y="8" width="384" height="264" rx="12" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <!-- Big Bulk Crate / Sack Outline (Badi Packing) -->
  <rect x="100" y="45" width="200" height="150" rx="12" fill="{color}" fill-opacity="0.15" stroke="{color}" stroke-width="2.5"/>
  <!-- Bulk Top Opening & Handles -->
  <path d="M120 45 C120 35 280 35 280 45" stroke="{color}" stroke-width="3" stroke-linecap="round"/>
  <line x1="100" y1="85" x2="300" y2="85" stroke="{color}" stroke-width="1.5" stroke-dasharray="4 4"/>
  <!-- Mesh / Perforation pattern -->
  <circle cx="150" cy="115" r="3" fill="{color}"/>
  <circle cx="175" cy="115" r="3" fill="{color}"/>
  <circle cx="200" cy="115" r="3" fill="{color}"/>
  <circle cx="225" cy="115" r="3" fill="{color}"/>
  <circle cx="250" cy="115" r="3" fill="{color}"/>
  <circle cx="162" cy="135" r="3" fill="{color}"/>
  <circle cx="187" cy="135" r="3" fill="{color}"/>
  <circle cx="212" cy="135" r="3" fill="{color}"/>
  <circle cx="237" cy="135" r="3" fill="{color}"/>
  <!-- 25-50 kg Capacity Badge -->
  <rect x="145" y="155" width="110" height="26" rx="6" fill="#0F172A" stroke="{color}" stroke-width="1.5"/>
  <text x="200" y="172" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">25 – 50 KG BULK PACK</text>
  <!-- Labels -->
  <text x="200" y="225" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">{title}</text>
  <text x="200" y="248" text-anchor="middle" fill="{color}" font-family="system-ui, sans-serif" font-size="11" font-weight="600">{sub}</text>
</svg>'''
    with open(f'public/packaging/{key}.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

print('Generated bulk SVGs successfully')
