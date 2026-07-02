import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    modified = False
    for i, line in enumerate(lines):
        if line.count('onClick={') > 1 and 'setSelectedProduct' in line:
            # We found a line with multiple onClicks
            # Let's just remove the first 'onClick={() => setSelectedProduct(p)} className="cursor-pointer '
            if 'onClick={() => setSelectedProduct(p)} className="cursor-pointer ' in line:
                lines[i] = line.replace('onClick={() => setSelectedProduct(p)} className="cursor-pointer ', '')
                modified = True
            elif 'onClick={() => setSelectedProduct(product)} className="cursor-pointer ' in line:
                lines[i] = line.replace('onClick={() => setSelectedProduct(product)} className="cursor-pointer ', '')
                modified = True
                
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src/components/themes'):
    for f in files:
        if f.endswith('Theme.tsx'):
            process_file(os.path.join(root, f))
