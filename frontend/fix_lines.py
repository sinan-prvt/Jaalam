import os

path = 'src/components/themes/restaurant/CafeTheme.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_until = -1

for i in range(len(lines)):
    if i < skip_until:
        continue

    line = lines[i]
    if 'content.contact_info?.address ||' in line or 'content.contact_info?.phone ||' in line or 'content.contact_info?.email ||' in line:
        # Determine which one it is
        if 'content.contact_info?.address' in line:
            key = 'address'
        elif 'content.contact_info?.phone' in line:
            key = 'phone'
        else:
            key = 'email'

        # Walk backward to find the opening tag
        start_idx = i
        while start_idx >= 0:
            if '<li ' in lines[start_idx] or '<div className="flex items-start' in lines[start_idx]:
                break
            start_idx -= 1
        
        # Walk forward to find the closing tag
        end_idx = i
        while end_idx < len(lines):
            if '</li>' in lines[end_idx]:
                break
            # For div, the structure is usually:
            # <div className="flex items-start ...">
            #   <Icon ... />
            #   <div> ... </div>
            # </div>
            if '</div>' in lines[end_idx] and end_idx + 1 < len(lines) and '</div>' in lines[end_idx+1]:
                end_idx += 1
                break
            end_idx += 1
        
        # Output the block wrapped
        # We need to output lines from start_idx to end_idx wrapped
        # First, output anything that was before start_idx but after the last processed line
        # But wait, our main loop is at i! 
        # So new_lines already has lines up to i-1. 
        # We need to remove the lines from start_idx to i-1 from new_lines
        num_to_remove = i - start_idx
        for _ in range(num_to_remove):
            new_lines.pop()
        
        indent = lines[start_idx][:len(lines[start_idx]) - len(lines[start_idx].lstrip())]
        new_lines.append(f"{indent}{{content.contact_info?.{key} && (\n")
        for j in range(start_idx, end_idx + 1):
            new_lines.append(lines[j])
        new_lines.append(f"{indent})}}\n")
        
        skip_until = end_idx + 1
    else:
        new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Replaced line by line successfully")
