import os
import re

THEMES_DIR = 'src/components/themes'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no inline modal using selectedProduct
    if 'selectedProduct.price' not in content:
        return

    original_content = content

    # Add import if needed
    if 'ProductBuyButton' not in content:
        imports_end = [m.end() for m in re.finditer(r'import .+?;[\r\n]*', content)]
        if imports_end:
            insert_pos = imports_end[-1]
            content = content[:insert_pos] + "import ProductBuyButton from '../../payments/ProductBuyButton';\n" + content[insert_pos:]

    # We want to inject right after the closing tag of the price element.
    # The pattern `{selectedProduct.price}` followed by the closing tag.
    # e.g., `{selectedProduct.price}</span>` or `{selectedProduct.price}</p>`
    pattern = re.compile(r'(\{selectedProduct\.price\})((?:\s*</[a-zA-Z0-9]+>))')
    
    # We will inject the BuyButton in a div with some top margin.
    content, count = pattern.subn(r'\1\2\n<div className="mt-4 w-full"><ProductBuyButton product={selectedProduct} content={content} /></div>', content)
    
    if count > 0 and content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath} ({count} replacements)")

for root, _, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
