import os
import re

THEMES_DIR = 'src/components/themes'
OUTPUT_FILE = 'src/utils/themeColors.ts'

# Tailwind 500/600 hex approximations
TAILWIND_COLORS = {
    'slate': '#475569', 'gray': '#4b5563', 'zinc': '#52525b', 'neutral': '#525252', 'stone': '#57534e',
    'red': '#dc2626', 'orange': '#ea580c', 'amber': '#d97706', 'yellow': '#ca8a04', 'lime': '#65a30d',
    'green': '#16a34a', 'emerald': '#059669', 'teal': '#0d9488', 'cyan': '#0891b2', 'sky': '#0284c7',
    'blue': '#2563eb', 'indigo': '#4f46e5', 'violet': '#7c3aed', 'purple': '#9333ea', 'fuchsia': '#c026d3',
    'pink': '#db2777', 'rose': '#e11d48'
}

theme_colors = {}

for root, _, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            theme_name = file.replace('.tsx', '')
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Try to find a hex color first: bg-[#HEX] or text-[#HEX]
            hex_match = re.search(r'(?:bg|text|border)-\[#([0-9a-fA-F]{6})\]', content)
            if hex_match:
                theme_colors[theme_name] = f"#{hex_match.group(1)}"
                continue
                
            # Fallback to Tailwind color: bg-{color}-500 or 600
            tw_match = re.search(r'(?:bg|text|border)-(' + '|'.join(TAILWIND_COLORS.keys()) + r')-[56]00', content)
            if tw_match:
                color_name = tw_match.group(1)
                theme_colors[theme_name] = TAILWIND_COLORS[color_name]
                continue
                
            # Default fallback
            theme_colors[theme_name] = '#6366f1' # indigo-500

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write('export const themeColors: Record<string, string> = {\n')
    for theme, color in theme_colors.items():
        f.write(f"  '{theme}': '{color}',\n")
    f.write('};\n')

print(f"Generated {OUTPUT_FILE} with {len(theme_colors)} colors.")
