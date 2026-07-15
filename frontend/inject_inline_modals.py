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

    # We want to inject right before the Close button of the inline modal.
    # The close button usually looks like:
    # <button ... onClick={() => setSelectedProduct(null)} ...>Close</button>
    # There could also be a top right close button (like an 'X' icon). We want the one that has text 'Close' or the last one.
    
    # Let's find all occurrences of `<button[^>]*onClick=\{\(\) => setSelectedProduct\(null\)\}[^>]*>.*?</button>`
    # and if its inner text matches 'Close' or it's a big button, inject before it.
    # Wait, an easier way: inject right after `{selectedProduct.description...}`
    
    # Or just inject it inside the `selectedProduct` rendering block.
    # Find `{selectedProduct.description` and the closing tag.
    
    pattern = re.compile(r'(\{selectedProduct\.description[^}]*\})([\s\S]*?</p>|[\s\S]*?</div>)')
    # Actually, replacing the Close button is safer:
    
    # Let's look for:
    # <button ... onClick={() => setSelectedProduct(null)} ... >
    #   Close
    # </button>
    # We can inject `<div className="mt-4"><ProductBuyButton product={selectedProduct} content={content} /></div>` before it.
    
    close_btn_pattern = re.compile(r'(<button[^>]*onClick=\{\(\)\s*=>\s*setSelectedProduct\(null\)\}[^>]*>\s*Close\s*</button>)', re.IGNORECASE)
    
    content, count = close_btn_pattern.subn(r'<div className="mb-3"><ProductBuyButton product={selectedProduct} content={content} /></div>\n              \1', content)
    
    if count > 0 and content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath} ({count} replacements)")

for root, _, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
