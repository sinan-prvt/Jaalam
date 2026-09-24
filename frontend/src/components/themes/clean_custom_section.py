import os
import glob
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to match exactly from:
    # {/\\* Dynamic Custom Section \\*/}
    # up to the closing `)}` of that block.
    # Note that the block ends with:
    #         </section>
    #       )}
    
    pattern = re.compile(r'\s*\{\/\* Dynamic Custom Section \*\/\}.*?<\/section>\s*\)\}', re.DOTALL)
    
    new_content = pattern.sub('', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned {filepath}")

def main():
    base_dir = r"d:\WebBuilder\frontend\src\components\themes"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                clean_file(filepath)

if __name__ == '__main__':
    main()
