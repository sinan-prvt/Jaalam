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
code = re.sub(r'<li[^>]*>[\s\S]*?<MapPin[^>]*>[\s\S]*?</li>', lambda m: replacer(m, 'address'), code)
code = re.sub(r'<li[^>]*>[\s\S]*?<Phone[^>]*>[\s\S]*?</li>', lambda m: replacer(m, 'phone'), code)
code = re.sub(r'<li[^>]*>[\s\S]*?<Mail[^>]*>[\s\S]*?</li>', lambda m: replacer(m, 'email'), code)

# Match <div> elements for contact blocks (e.g. <div className="flex items-start ...">)
# It contains MapPin/Phone/Mail, then another <div> containing <h4> and <p>, then closes the outer <div>
code = re.sub(r'<div[^>]*className=\"flex items-(?:start|center)[^>]*>[\s\S]*?<MapPin[^>]*>[\s\S]*?</div>\s*</div>', lambda m: replacer(m, 'address'), code)
code = re.sub(r'<div[^>]*className=\"flex items-(?:start|center)[^>]*>[\s\S]*?<Phone[^>]*>[\s\S]*?</div>\s*</div>', lambda m: replacer(m, 'phone'), code)
code = re.sub(r'<div[^>]*className=\"flex items-(?:start|center)[^>]*>[\s\S]*?<Mail[^>]*>[\s\S]*?</div>\s*</div>', lambda m: replacer(m, 'email'), code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Replaced successfully')
