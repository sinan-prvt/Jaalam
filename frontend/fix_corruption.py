import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    modified = False
    for i, line in enumerate(lines):
        # Look for something like: <div key={i} group cursor-pointer" onClick...
        # Basically: <div key={...} THEN no className=" THEN some words THEN " onClick...
        
        # Regex to find this corruption:
        # Match <\w+ key=\{[^}]+\} ([\w\s-]+)" onClick=
        match = re.search(r'<(\w+) key=\{([^}]+)\}\s+([\w\s-]+)"\s*onClick=', line)
        if match:
            tag = match.group(1)
            key = match.group(2)
            classes = match.group(3).strip()
            
            # Reconstruct the line
            # The part before the match
            start_idx = match.start()
            # The part after the match
            end_idx = match.end() - len(' onClick=')
            
            new_match_str = f'<{tag} key={{{key}}} className="{classes}" onClick='
            
            # replace in line
            lines[i] = line[:start_idx] + new_match_str + line[end_idx + len(' onClick='):]
            modified = True
            
        # Also check for: <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer flex flex-col" onClick={() => setSelectedProduct(p)}>
        # Oh wait, we already fixed the duplicate onClick with fix_errors.py
                
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src/components/themes'):
    for f in files:
        if f.endswith('Theme.tsx'):
            process_file(os.path.join(root, f))
