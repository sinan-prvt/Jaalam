import re
import os

filepath = 'src/components/themes/restaurant/RestaurantTheme.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Address
content = re.sub(
    r'(<div className="flex items-center gap-4">\s*<div className={`w-12 h-12 rounded-full \$\{primaryColor\} flex items-center justify-center shrink-0 shadow-lg`}>\s*<MapPin.*?</div>\s*</div>)',
    r'{!hiddenFields.includes("contact_address") && (\n                  \1\n                  )}',
    content,
    flags=re.DOTALL
)

# Replace Phone
content = re.sub(
    r'(<div className="flex items-center gap-4">\s*<div className={`w-12 h-12 rounded-full \$\{primaryColor\} flex items-center justify-center shrink-0 shadow-lg`}>\s*<Phone.*?</div>\s*</div>)',
    r'{!hiddenFields.includes("contact_phone") && (\n                  \1\n                  )}',
    content,
    flags=re.DOTALL
)

# Replace Hours
content = re.sub(
    r'(<div className="flex items-center gap-4">\s*<div className={`w-12 h-12 rounded-full \$\{primaryColor\} flex items-center justify-center shrink-0 shadow-lg`}>\s*<Clock.*?</div>\s*</div>)',
    r'{!hiddenFields.includes("contact_hours") && (\n                  \1\n                  )}',
    content,
    flags=re.DOTALL
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated RestaurantTheme.tsx")
