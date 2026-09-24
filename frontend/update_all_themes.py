import re
import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    if "const hiddenFields" not in content:
        content = re.sub(
            r'(const (?:siteName|heroImage|categories) = [^\n]+;)',
            r'\1\n  const hiddenFields = content?.settings_json?.hidden_elements || [];',
            content,
            count=1
        )

    # 1. hero_title
    content = re.sub(
        r'(<h1[^>]*>[\s\n]*\{content\.(?:settings_json\?\.)?hero_title.*?</h1>)',
        r'{!hiddenFields.includes("hero_title") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 2. hero_description
    content = re.sub(
        r'(<p[^>]*>[\s\n]*\{content\.(?:settings_json\?\.)?hero_description.*?</p>)',
        r'{!hiddenFields.includes("hero_description") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )
    
    # 2b. hero_description with hero_text fallback
    content = re.sub(
        r'(<p[^>]*>[\s\n]*\{content\.hero_text.*?</p>)',
        r'{!hiddenFields.includes("hero_description") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 3. about_title
    content = re.sub(
        r'(<h[23][^>]*>[\s\n]*\{content\.(?:settings_json\?\.)?about_title.*?</h[23]>)',
        r'{!hiddenFields.includes("about_title") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 4. about_description with const text =
    content = re.sub(
        r'(<p[^>]*>[\s\n]*\{(?:\(\(\) => \{)?[\s\n]*const text = content\.(?:settings_json\?\.)?about_description.*?</p>)',
        r'{!hiddenFields.includes("about_description") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )
    
    # 4b. about_description without const text =
    content = re.sub(
        r'(<p[^>]*>[\s\n]*\{content\.(?:settings_json\?\.)?about_description.*?</p>)',
        r'{!hiddenFields.includes("about_description") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

theme_dir = r'd:\WebBuilder\frontend\src\components\themes'
for root, dirs, files in os.walk(theme_dir):
    for file in files:
        if file.endswith('Theme.tsx') or file.endswith('Theme2.tsx'):
            process_file(os.path.join(root, file))

print('Done')
