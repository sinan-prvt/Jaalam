import os
import glob
import re

themes_dir = 'src/components/themes'
files = glob.glob(f"{themes_dir}/**/*.tsx", recursive=True)
files.extend(glob.glob(f"{themes_dir}/*.tsx", recursive=True))

target_line = "const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];"

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if target_line in content:
        # Check if 'content' is part of the props
        # Search for something like: function ThemeName({ content, ...
        # Or checking if " content" or "{content" is in the file before the target line
        if not re.search(r'\bcontent\b', content[:content.find(target_line)]):
            print(f"Potential issue in: {file}")
            
            # Remove the line if it is not a theme component that takes content
            # e.g., if it's in a shared component
            if 'shared' in file or 'ContactForm' in file:
                 lines = content.split('\n')
                 new_lines = [l for l in lines if target_line not in l]
                 with open(file, 'w', encoding='utf-8') as fw:
                     fw.write('\n'.join(new_lines))
                 print(f"Fixed {file}")
