import os
import re

THEMES_DIR = 'src/components/themes'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no inline modal using selectedProduct
    if 'selectedProduct' not in content:
        return

    original_content = content

    # Add import if needed
    if 'ProductBuyButton' not in content:
        imports_end = [m.end() for m in re.finditer(r'import .+?;[\r\n]*', content)]
        if imports_end:
            insert_pos = imports_end[-1]
            content = content[:insert_pos] + "import ProductBuyButton from '../../payments/ProductBuyButton';\n" + content[insert_pos:]

    # Replace the Close button
    close_btn_pattern = re.compile(r'<button[^>]*onClick=\{\(\)\s*=>\s*setSelectedProduct\(null\)\}[^>]*>\s*(?:Close|Back)\s*</button>', re.IGNORECASE)
    
    content, count = close_btn_pattern.subn(r'<div className="w-full mt-4"><ProductBuyButton product={selectedProduct} content={content} /></div>', content)
    
    if count > 0 and content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath} ({count} replacements)")

for root, _, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
