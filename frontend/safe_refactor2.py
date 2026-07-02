import os

files_to_fix = [
    'src/components/themes/fancy/ClassicFancyTheme.tsx',
    'src/components/themes/fancy/ModernFancyTheme.tsx',
    'src/components/themes/fancy/NoirFancyTheme.tsx',
    'src/components/themes/fancy/PopFancyTheme.tsx',
    'src/components/themes/retail/OrganicStoreTheme.tsx',
    'src/components/themes/stationery/ClassicStationeryTheme.tsx',
    'src/components/themes/stationery/EtherealStationeryTheme.tsx',
    'src/components/themes/stationery/MinimalStationeryTheme.tsx',
    'src/components/themes/stationery/ModernStationeryTheme.tsx',
    'src/components/themes/stationery/PlayfulStationeryTheme.tsx'
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    in_modal = False
    brace_count = 0
    
    for line in lines:
        # Check if we are starting the modal
        if not in_modal and '{selectedProduct && (' in line:
            in_modal = True
            brace_count = line.count('{') - line.count('}')
            continue
            
        if in_modal:
            brace_count += line.count('{') - line.count('}')
            # The block ends when brace count drops to 0 (or less, depending on how they are nested)
            # Actually, standard indentation usually has the closing )} on a line by itself.
            if ')}' in line and brace_count <= 0:
                in_modal = False
            continue
            
        out_lines.append(line)
        
    content = "".join(out_lines)

    # 1. Add import
    if "import ProductModal" not in content:
        content = content.replace("import {", "import ProductModal from '../../shared/ProductModal';\nimport {", 1)
        if "import ProductModal" not in content:
            content = content.replace("import React", "import ProductModal from '../../shared/ProductModal';\nimport React", 1)

    # 2. Append ProductModal at the very end
    if "<ProductModal" not in content:
        content = content.replace("    </div>\n  );\n}", "      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />\n    </div>\n  );\n}")
        if "<ProductModal" not in content:
            # Maybe the end is different?
            content = content.replace("</div>\n  );\n}", "      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />\n    </div>\n  );\n}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")
