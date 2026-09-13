import os
import re

dir_path = r'd:\WebBuilder\frontend\src\components\themes\housewarming\layouts'
files_to_modify = ['ModernClassicLayout.tsx', 'ModernElegantLayout.tsx', 'ModernFloralLayout.tsx', 'TraditionalLayout.tsx']

for root, _, files in os.walk(dir_path):
    for file in files:
        if file in files_to_modify:
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove <nav> block
            content = re.sub(r'\s*<!-- Navigation -->\s*<nav.*?</nav>', '', content, flags=re.DOTALL)
            content = re.sub(r'\s*<nav.*?</nav>', '', content, flags=re.DOTALL)
            
            # Remove pt- from main
            content = re.sub(r'<main className="pt-\d+(.*?)"', r'<main className="\1"', content)
            content = re.sub(r'<main className="\s+"', r'<main className=""', content)

            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Modified {file}')
