import re

path = 'src/components/themes/restaurant/CafeTheme.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

def replacer(m, key):
    block = m.group(0)
    # Check if already wrapped
    if f'{{content.contact_info?.{key} && (' in block:
        return block
    # Check if it contains the fallback
    if f'content.contact_info?.{key}' not in block:
        return block
    
    # Wrap it
    return f"{{content.contact_info?.{key} && (\n{block}\n)}}"

# Match <li> elements containing contact info fallbacks
# regex: <li [anything except <li] contact_info?.address [anything except </li>] </li>
# We use re.DOTALL to let '.' match newlines
code = re.sub(r'<li(?:(?!<li).)*?content\.contact_info\?\.address(?:(?!</li>).)*?</li>', lambda m: replacer(m, 'address'), code, flags=re.DOTALL)
code = re.sub(r'<li(?:(?!<li).)*?content\.contact_info\?\.phone(?:(?!</li>).)*?</li>', lambda m: replacer(m, 'phone'), code, flags=re.DOTALL)
code = re.sub(r'<li(?:(?!<li).)*?content\.contact_info\?\.email(?:(?!</li>).)*?</li>', lambda m: replacer(m, 'email'), code, flags=re.DOTALL)

# Match <div> elements for contact blocks (e.g. <div className="flex items-start ...">)
# regex: <div className=\"flex items-start [anything except <div] content.contact_info?.address [anything except </div>] </div>\s*</div>
code = re.sub(r'<div[^>]*className=\"flex items-start(?:(?!<div).)*?content\.contact_info\?\.address(?:(?!</div>).)*?</div>\s*</div>', lambda m: replacer(m, 'address'), code, flags=re.DOTALL)
code = re.sub(r'<div[^>]*className=\"flex items-start(?:(?!<div).)*?content\.contact_info\?\.phone(?:(?!</div>).)*?</div>\s*</div>', lambda m: replacer(m, 'phone'), code, flags=re.DOTALL)
code = re.sub(r'<div[^>]*className=\"flex items-start(?:(?!<div).)*?content\.contact_info\?\.email(?:(?!</div>).)*?</div>\s*</div>', lambda m: replacer(m, 'email'), code, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Replaced successfully')
