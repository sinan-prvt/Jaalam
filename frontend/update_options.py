import glob
import re

files = glob.glob('d:/WebBuilder/frontend/src/pages/website/*Editor.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_options = """<option value="light">Clean Light</option>
                      <option value="custom1">Purple Square Bot</option>
                      <option value="custom2">Cyan Eyes Robot</option>
                      <option value="custom3">Simple Outline Bot</option>
                      <option value="custom4">3D Floating Robot</option>
                      <option value="custom5">Headset Robot</option>"""
    
    content = content.replace('<option value="light">Clean Light</option>', new_options)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Updated options safely.")
