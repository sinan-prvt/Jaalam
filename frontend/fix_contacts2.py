import re

path = 'src/components/themes/restaurant/CafeTheme.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Fix MapPin inside <li>
code = re.sub(r'(<li[^>]*>[\s]*<MapPin[^>]*>[\s\S]*?</li>)',
              lambda m: m.group(0) if '{content.contact_info?.address && (' in m.group(0) else 
                        '{content.contact_info?.address && (\n' + m.group(0) + '\n)}' if 'content.contact_info?.address' in m.group(0) else m.group(0),
              code)

# Fix Mail inside <li> (just in case)
code = re.sub(r'(<li[^>]*>[\s]*<Mail[^>]*>[\s\S]*?</li>)',
              lambda m: m.group(0) if '{content.contact_info?.email && (' in m.group(0) else 
                        '{content.contact_info?.email && (\n' + m.group(0) + '\n)}' if 'content.contact_info?.email' in m.group(0) else m.group(0),
              code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Replaced successfully')
