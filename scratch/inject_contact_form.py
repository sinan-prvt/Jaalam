import os
import re

THEMES_DIR = r"c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes"

def inject_contact_form(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if ContactForm is already imported
    if "import ContactForm" in content or "ContactForm" in content and "import" not in content[:500]:
        print(f"Skipping {os.path.basename(filepath)} - ContactForm already present.")
        return False

    # 1. Add import statement
    last_import_match = list(re.finditer(r'^import .*;?$', content, re.MULTILINE))
    if last_import_match:
        last_import_end = last_import_match[-1].end()
        content = content[:last_import_end] + "\nimport ContactForm from '../../shared/ContactForm';" + content[last_import_end:]
    else:
        content = "import ContactForm from '../../shared/ContactForm';\n" + content

    rel_path = os.path.relpath(filepath, THEMES_DIR)
    depth = len(rel_path.split(os.sep)) - 1
    import_path = "'../shared/ContactForm'" if depth == 0 else "'../../shared/ContactForm'"
    content = content.replace("'../../shared/ContactForm'", import_path)


    # 2. Inject ContactForm into the contact section
    # Match any element with id="contact"
    section_start_match = re.search(r'<([a-zA-Z]+)[^>]*?id=[\'"]contact[\'"][^>]*>', content)
    if not section_start_match:
        print(f"Warning: Contact section not found in {os.path.basename(filepath)}")
        return False
        
    start_idx = section_start_match.start()
    
    # Find matching closing tag for the tag that was opened
    end_idx = -1
    open_tags = 0
    
    tag_pattern = re.compile(r'<(/?)([a-zA-Z]+)(?:\s+[^>]*?)?>')
    for match in tag_pattern.finditer(content, start_idx):
        # We don't want to count self closing tags like <img />, <br /> etc.
        # But this is a simple parser. We can try to handle it.
        # It's safer to just look for the last closing tag of the main block.
        if match.group(0).endswith('/>'):
            continue
            
        if match.group(1) == '/':
            open_tags -= 1
            if open_tags == 0:
                end_idx = match.start()
                break
        else:
            open_tags += 1
            
    if end_idx == -1:
        print(f"Warning: Could not find closing tag in {os.path.basename(filepath)}")
        return False
        
    # We found the section bounds. Now inject `<ContactForm />` before the closing tag
    injection = '\n            <div className="mt-12 w-full z-20 relative"><ContactForm websiteId={website.id} /></div>\n          '
    
    new_content = content[:end_idx] + injection + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Injected ContactForm into {os.path.basename(filepath)}")
    return True

success_count = 0
for root, dirs, files in os.walk(THEMES_DIR):
    # Exclude shared and restaurant
    if 'shared' in root.split(os.sep) or 'restaurant' in root.split(os.sep):
        continue
        
    for file in files:
        if file.endswith('.tsx') and file != 'SectionLayout.tsx':
            filepath = os.path.join(root, file)
            if inject_contact_form(filepath):
                success_count += 1

print(f"\nSuccessfully injected ContactForm into {success_count} templates.")
