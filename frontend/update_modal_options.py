import glob
import re

files = glob.glob('d:/WebBuilder/frontend/src/pages/website/*Editor.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace Modal Style options
    new_modal_options = """<option value="professional">Professional Clean</option>
                      <option value="glassmorphic">Glassmorphic Modern</option>
                      <option value="playful">Playful Rounded</option>
                      <option value="cyberpunk">Dark Cyberpunk</option>
                      <option value="minimalist">Minimalist Monochrome</option>
                      <option value="pastel">Soft Pastel</option>
                      <option value="neumorphic">Neumorphic 3D</option>
                      <option value="elegant">Elegant Luxury</option>"""
    
    # We find the select block for modal style and replace the options
    # The block starts with <select value={content.settings_json?.chatbot_modal_style... and ends with </select>
    
    content = re.sub(
        r'(<select\s+value=\{content\.settings_json\?\.chatbot_modal_style.*?)(<option value="professional">.*?</select>)',
        r'\1' + new_modal_options + '\n                    </select>',
        content,
        flags=re.DOTALL
    )
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Updated modal options safely.")
