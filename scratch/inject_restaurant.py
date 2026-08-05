import os
import re

THEMES_DIR = r"c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes\restaurant"

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
        content = content[:last_import_end] + "\nimport ContactForm from '../shared/ContactForm';" + content[last_import_end:]
    else:
        content = "import ContactForm from '../shared/ContactForm';\n" + content

    # 2. Inject ContactForm into the contact section
    # CafeTheme uses <footer id="contact" ... or <div id="contact" ... or <section id="contact"
    # But wait, we saw App Style has:
    # <footer id="contact" ...
    
    # We will find every block that has id="contact"
    
    injected_count = 0
    # Match any element with id="contact" (but not contact-info as an id value unless we also target it)
    # App Style had id="contact" on footer, and id="contact-info" on a div inside the contact section.
    # Actually, looking at App Style: <footer id="contact"
    # Or in the first layout: <div key="contact" id="contact-info"
    
    # Let's find `<div key="contact"` or `<footer id="contact"`
    matches = list(re.finditer(r'<([a-zA-Z]+)[^>]*?(?:id=[\'"]contact[\'"]|key=[\'"]contact[\'"])[^>]*>', content))
    
    if not matches:
        print(f"Warning: Contact section not found in {os.path.basename(filepath)}")
        return False
        
    # Process from the bottom up to not mess up indices
    for section_start_match in reversed(matches):
        start_idx = section_start_match.start()
        tag_name = section_start_match.group(1)
        
        # Find matching closing tag
        end_idx = -1
        open_tags = 0
        
        tag_pattern = re.compile(r'<(/?)([a-zA-Z]+)(?:\s+[^>]*?)?>')
        for match in tag_pattern.finditer(content, start_idx):
            if match.group(0).endswith('/>'):
                continue
                
            if match.group(1) == '/':
                open_tags -= 1
                if open_tags == 0:
                    end_idx = match.start()
                    break
            else:
                open_tags += 1
                
        if end_idx != -1:
            injection = '\n            <div className="mt-12 w-full z-20 relative"><ContactForm websiteId={website.id} /></div>\n          '
            content = content[:end_idx] + injection + content[end_idx:]
            injected_count += 1

    if injected_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected ContactForm into {os.path.basename(filepath)}")
        return True
        
    return False

success_count = 0
for file in os.listdir(THEMES_DIR):
    if file.endswith('.tsx') and file != 'SectionLayout.tsx':
        filepath = os.path.join(THEMES_DIR, file)
        if inject_contact_form(filepath):
            success_count += 1

print(f"\nSuccessfully injected ContactForm into {success_count} templates.")
