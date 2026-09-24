import os
import glob

themes_dir = 'src/components/themes'
files = glob.glob(f"{themes_dir}/**/*.tsx", recursive=True)
files.extend(glob.glob(f"{themes_dir}/*.tsx", recursive=True))

target_line = "const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];"

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if target line occurs more than once
    if content.count(target_line) > 1:
        # Split lines, keep only the first occurrence of the target line
        lines = content.split('\n')
        new_lines = []
        found = False
        changed = False
        
        for line in lines:
            if target_line in line:
                if not found:
                    found = True
                    new_lines.append(line)
                else:
                    changed = True
                    # Skip duplicate line
            else:
                new_lines.append(line)
        
        if changed:
            with open(file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(new_lines))
            print(f"Fixed duplicates in {file}")

print("Done removing duplicate hiddenFields.")
