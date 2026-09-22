import re

with open('existing_app_bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

import sys
sys.stdout.reconfigure(encoding='utf-8')

# Let's search for presets or food commodity list in bundle:
imgs = re.findall(r'[\'"`]([^\'"`]+\.(?:jpg|png|svg|webp))[\'"`]', text)
print("Referenced images:", set(imgs))


















