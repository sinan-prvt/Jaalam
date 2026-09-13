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
            
            # Remove state variables and unused vars
            content = re.sub(r'const\s+\[activeSection,\s*setActiveSection\]\s*=\s*useState[^;]+;\n?', '', content)
            content = re.sub(r'const\s+\[isMenuOpen,\s*setIsMenuOpen\]\s*=\s*useState[^;]+;\n?', '', content)
            content = re.sub(r'const\s+isVisible\s*=\s*[^;]+;\n?', '', content)
            content = re.sub(r'const\s+scrollPosition\s*=\s*[^;]+;\n?', '', content)
            
            # Remove navItems mapping
            content = re.sub(r'const\s+navItems\s*=\s*getOrderedSections\(\)\.map\(\(s:\s*any\)\s*=>\s*\(\{\s*id:\s*s\.id,\s*label:\s*s\.label\s*\}\)\);\n?', '', content)
            
            # Remove scrollTo function
            content = re.sub(r'const\s+scrollTo\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*setIsMenuOpen\(false\);\n?\s*};\n?', '', content)
            content = re.sub(r'const\s+scrollTo\s*=\s*\([^)]*\)\s*=>\s*\{.*?setIsMenuOpen\(false\);\n?\s*};\n?', '', content, flags=re.DOTALL)
            
            # Remove handleScroll and useEffect related to scroll
            content = re.sub(r'useEffect\(\(\)\s*=>\s*\{.*?window\.removeEventListener\(\'scroll\',\s*handleScroll\);\n?\s*\},\s*\[navItems\]\);\n?', '', content, flags=re.DOTALL)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Cleaned {file}')
