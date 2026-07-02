import os
import re

def walk_dir(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('Theme.tsx'):
                yield os.path.join(root, file)

for filepath in walk_dir('src/components/themes'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Fix 1: Missing AllProductsModal import
    if "import AllProductsModal" not in content and "<AllProductsModal" in content:
        if "import ProductModal" in content:
            content = content.replace("import ProductModal", "import AllProductsModal from '../../shared/AllProductsModal';\nimport ProductModal", 1)
        else:
            content = content.replace("import React", "import AllProductsModal from '../../shared/AllProductsModal';\nimport React", 1)

    # Fix 2: Missing showAllProducts state
    if "<AllProductsModal" in content and "const [showAllProducts" not in content:
        # Insert near selectedProduct or isMobileMenuOpen or just after sectionOrder
        if "const [selectedProduct" in content:
            content = content.replace("const [selectedProduct", "const [showAllProducts, setShowAllProducts] = useState(false);\n  const [selectedProduct", 1)
        elif "const [isMobileMenuOpen" in content:
            content = content.replace("const [isMobileMenuOpen", "const [showAllProducts, setShowAllProducts] = useState(false);\n  const [isMobileMenuOpen", 1)
        else:
            content = content.replace("const sectionOrder", "const [showAllProducts, setShowAllProducts] = useState(false);\n  const sectionOrder", 1)

    # Fix 3: Missing products variable definition
    # If the file uses `products={products || []}` but doesn't have `const products =`, we need to change it to `content.products_json` or add the definition
    if "<AllProductsModal" in content and "products={products || []}" in content and "const products =" not in content and "const products:" not in content and "const products " not in content:
        # We can just change `products={products || []}` to `products={content?.products_json || []}`
        content = content.replace("products={products || []}", "products={content?.products_json || []}")

    # Fix 4: Missing setSelectedProduct state
    if "<AllProductsModal" in content and "setSelectedProduct" in content and "const [selectedProduct" not in content:
        # Wait, if they don't have selectedProduct, maybe they don't have ProductModal either!
        # Let's add selectedProduct if it doesn't exist
        content = content.replace("const [showAllProducts", "const [selectedProduct, setSelectedProduct] = useState<any>(null);\n  const [showAllProducts", 1)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
