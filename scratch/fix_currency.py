import os
import glob
import re

base_dir = r"c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes"
files = glob.glob(os.path.join(base_dir, "**", "*.tsx"), recursive=True)

# Regex to match '?' followed by numbers and optional decimals, capturing the number part
# We use re.sub with r'\?(\d+(?:\.\d+)?)' and replace with r'₹\1'
pattern = re.compile(r'\?(\d+(?:\.\d+)?)')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(r'₹\1', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Replaced symbols in: {os.path.basename(filepath)}")

print("Done replacing currency symbols.")
