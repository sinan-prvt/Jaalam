import os

filepath = r'c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes\restaurant\CafeTheme.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to remove the block starting from {/* Injected About Section */}
# all the way up to just before {/* Footer */} which is around line 1367.
start_marker = '{/* Injected About Section */}'
end_marker = '{/* Footer */}'

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker, start_idx)
    
    if start_idx != -1 and end_idx != -1:
        # We want to remove everything from start_idx to end_idx
        # Let's remove any leading whitespace before start_marker on its line
        while start_idx > 0 and content[start_idx - 1] in (' ', '\t'):
            start_idx -= 1
            
        content = content[:start_idx] + content[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Removed injected generic sections from Modern Bakery block')
