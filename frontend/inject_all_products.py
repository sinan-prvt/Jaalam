import os
import re

def walk_dir(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('Theme.tsx'):
                yield os.path.join(root, file)

for filepath in walk_dir('src/components/themes'):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    in_modal = False
    brace_count = 0
    
    for line in lines:
        if not in_modal and '{showAllProducts && (' in line:
            in_modal = True
            brace_count = line.count('{') - line.count('}')
            continue
            
        if in_modal:
            brace_count += line.count('{') - line.count('}')
            if ')}' in line and brace_count <= 0:
                in_modal = False
            continue
            
        out_lines.append(line)
        
    content = "".join(out_lines)

    original = content

    if "import AllProductsModal" in content:
        continue

    content = content.replace("import ProductModal", "import AllProductsModal from '../../shared/AllProductsModal';\nimport ProductModal")

    # If the file doesn't have showAllProducts state but has a button that calls it (some files might have a missing state due to earlier refactoring)
    if "const [showAllProducts" not in content and "setShowAllProducts(" in content:
        # We need to add the state
        content = content.replace("const [selectedProduct", "const [showAllProducts, setShowAllProducts] = useState(false);\n  const [selectedProduct")
        if "const [showAllProducts" not in content:
            content = content.replace("const [isMobileMenuOpen", "const [showAllProducts, setShowAllProducts] = useState(false);\n  const [isMobileMenuOpen")

    modal_code = "\n      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />"
    
    if "<ProductModal" in content:
        content = content.replace("<ProductModal", modal_code + "\n      <ProductModal")
    else:
        content = content.replace("    </div>\n  );\n}", modal_code + "\n    </div>\n  );\n}")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected AllProductsModal into {filepath}")
