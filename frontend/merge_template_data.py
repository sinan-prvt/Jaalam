import re

template_data_path = 'c:/Users/ADMIN/Desktop/WebBuilder/frontend/src/utils/templateData.ts'
dashboard_path = 'c:/Users/ADMIN/Desktop/WebBuilder/frontend/src/pages/dashboard/Dashboard.tsx'

with open(template_data_path, 'r', encoding='utf-8') as f:
    td_content = f.read()

with open(dashboard_path, 'r', encoding='utf-8') as f:
    db_content = f.read()

cat_themes_match = re.search(r'const categoryThemes: Record<string, string\[\]> = (\{.*?\});', db_content, re.DOTALL)
cat_themes = cat_themes_match.group(1)

get_thumb_match = re.search(r'const getThemeThumbnail = \(theme: string, businessType\?: string\) => \{.*?\n\};\n', db_content, re.DOTALL)
get_thumb = get_thumb_match.group(0)

new_td_content = f"export const categoryThemes: Record<string, string[]> = {cat_themes};\n\nexport {get_thumb}"

# Apply fixes
fixes = {
    '1532710093739-9470acff878b': '1503951914875-452162b0f3f1',
    '1516975080661-46bd8e1b34f2': '1522337660859-02fbefca4702',
    '1558611997-60af99839eb9': '1579389083078-4e7018379f7e',
    '1563514757303-a1286c757c91': '1558030006-450675393462',
    '1525610553991-56e111143003': '1514933651103-005eec06c04b',
    '1607623814075-e51df1bd682f': '1558030006-450675393462',
    '1521590832167-7bfcbaa6362d': '1522337660859-02fbefca4702',
    '1600164318933-2ebf454c502f': '1511556820780-d912e42b4980'
}

for broken, working in fixes.items():
    new_td_content = new_td_content.replace(broken, working)

with open(template_data_path, 'w', encoding='utf-8') as f:
    f.write(new_td_content)

print("Updated templateData.ts")

# Now update Dashboard.tsx to remove the locals and import them
db_content = re.sub(r'const getThemeThumbnail = \(theme: string, businessType\?: string\) => \{.*?\n\};\n', '', db_content, flags=re.DOTALL)
db_content = re.sub(r'const categoryThemes: Record<string, string\[\]> = \{.*?\};\n', '', db_content, flags=re.DOTALL)

# Add import at the top
db_content = db_content.replace("import Pricing from './Pricing';", "import Pricing from './Pricing';\nimport { categoryThemes, getThemeThumbnail } from '../../utils/templateData';")

with open(dashboard_path, 'w', encoding='utf-8') as f:
    f.write(db_content)

print("Updated Dashboard.tsx")
