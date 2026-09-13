import os
import re

dir_path = r'd:\WebBuilder\frontend\src\components\themes\housewarming\layouts'

for root, _, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            nav_count = content.count('<nav')
            pt_main = re.findall(r'<main className=\"[^\"]*pt-\d+[^\"]*\">', content)
            print(f'{file}: <nav> count: {nav_count}, main tag: {pt_main}')
