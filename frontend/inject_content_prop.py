import os

THEMES_DIR = 'src/components/themes'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for `<ProductModal` and replace it
    if '<ProductModal' in content and 'content={content}' not in content:
        content = content.replace('contactInfo={content.contact_info}', 'contactInfo={content.contact_info} content={content}')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
