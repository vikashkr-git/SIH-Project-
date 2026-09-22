import json

with open('foods_catalog.json', encoding='utf-8') as f:
    foods = json.load(f)

with open('src/data/foodsCatalog.ts', 'w', encoding='utf-8') as out:
    out.write('import { FoodCommodity } from "../types";\n\n')
    out.write('export const FOODS_CATALOG: FoodCommodity[] = ' + json.dumps(foods, indent=2) + ';\n')

with open('sources_catalog.json', encoding='utf-8') as f:
    sources = json.load(f)

with open('src/data/sourcesCatalog.ts', 'w', encoding='utf-8') as out:
    out.write('import { ScientificSource } from "../types";\n\n')
    out.write('export const SCIENTIFIC_SOURCES: ScientificSource[] = ' + json.dumps(sources, indent=2) + ';\n')

print("Regenerated foodsCatalog.ts and sourcesCatalog.ts successfully")
