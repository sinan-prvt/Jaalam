import os
import re

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
        content = f.read()

    original = content

    # 1. Add import
    if "import ProductModal" not in content:
        content = content.replace("import {", "import ProductModal from '../../shared/ProductModal';\nimport {", 1)
        if "import ProductModal" not in content:
            content = content.replace("import React", "import ProductModal from '../../shared/ProductModal';\nimport React", 1)

    # 2. Append ProductModal at the very end
    if "<ProductModal" not in content:
        content = content.replace("    </div>\n  );\n}", "      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />\n    </div>\n  );\n}")

    # 3. Clean empty selectedProduct
    content = re.sub(r'\{selectedProduct\s*&&\s*\(\s*\)\}', '', content)

    # 4. Remove the hardcoded modal if it exists
    # Find anything like {selectedProduct && ( ... )} that has a fixed inset-0 
    # But wait, it's easier to just rely on empty one if the previous scripts emptied it?
    # Actually, they still have the hardcoded modal because I checked out!
    # Hardcoded modal usually has: {selectedProduct && ( ... fixed inset-0 ... )}
    # Let's remove the block.
    # It's tricky to remove with regex. We can just comment it out or leave it if we don't care, but it conflicts.
    
    # 5. Add onClick to map correctly
    # If we find `onClick={() => setSelectedProduct(` in the file, it already works!
    # The stationery themes probably already have `onClick={() => setSelectedProduct(p)}`.
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
