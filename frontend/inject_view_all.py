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

    # If the file already has a button for view all, skip it
    if "setShowAllProducts(true)" in content:
        # Wait, the previous script injected `setShowAllProducts(true)`? No, it injected `showAllProducts` in `AllProductsModal`
        # Let's check if there is an onClick={() => setShowAllProducts(true)}
        if "onClick={() => setShowAllProducts(true)}" in content or "onClick={() => setShowAllProducts(true)}" in content.replace(" ", ""):
            continue

    # We need to inject the button right after the products grid
    # The grid usually ends with `))} \n </div>` or something similar.
    # Let's find products.map
    if "products.map" in content:
        # We find the start of products.map
        map_idx = content.find("products.map")
        if map_idx != -1:
            # Find the next `))} `
            end_map_idx = content.find("))}", map_idx)
            if end_map_idx != -1:
                # Find the next `</div>` after `))}`
                div_idx = content.find("</div>", end_map_idx)
                if div_idx != -1:
                    button_code = """
          <div className="mt-10 mb-4 text-center w-full flex justify-center col-span-full">
            <button 
              onClick={() => setShowAllProducts(true)} 
              className="px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-bold tracking-wide shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              View All Products
            </button>
          </div>
"""
                    # Inject it after the `</div>`
                    insert_pos = div_idx + 6
                    content = content[:insert_pos] + button_code + content[insert_pos:]

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected View All button into {filepath}")
