import os
import re

THEMES_DIR = 'src/components/themes'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no price reference
    if '.price' not in content:
        return

    # Add import if needed
    if 'ProductBuyButton' not in content:
        imports_end = [m.end() for m in re.finditer(r'import .+?;[\r\n]*', content)]
        if imports_end:
            insert_pos = imports_end[-1]
            content = content[:insert_pos] + "import ProductBuyButton from '../../payments/ProductBuyButton';\n" + content[insert_pos:]

    # Let's find patterns like: >{item.price}</span> or >{prod.price}</p>
    # We can match `\{([a-zA-Z0-9_]+)\.price\}` followed by `</[a-zA-Z0-9]+>`
    # Note: Sometimes there is whitespace or className between {prod.price} and the closing tag, but React usually has `{prod.price}</span>`.
    
    pattern = re.compile(r'(\{([a-zA-Z0-9_]+)\.price\})((?:\s*</[a-zA-Z0-9]+>))')
    
    content, count = pattern.subn(r'\1\3\n<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={\2} content={content} /></div>', content)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath} ({count} replacements)")

for root, _, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

# Also update AllProductsModal.tsx
modal_path = 'src/components/shared/AllProductsModal.tsx'
if os.path.exists(modal_path):
    with open(modal_path, 'r', encoding='utf-8') as f:
        modal_content = f.read()
    
    # AllProductsModal doesn't have `content` prop! We need to pass it or skip it there.
    # The user can just buy from the main screen. So we can skip it, or let's not touch AllProductsModal right now to avoid passing `content` down all the tree.
