import os
import re

editors_dir = r"d:\WebBuilder\frontend\src\pages\website"
editors = [
    "BirthdayEditor.tsx",
    "CollegeFestEditor.tsx",
    "HousewarmingEditor.tsx",
    "ReligiousEventEditor.tsx",
    "WebsiteEditor.tsx",
    "WeddingEditor.tsx"
]

for editor in editors:
    filepath = os.path.join(editors_dir, editor)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We replace the map array
    content = content.replace("['en', 'ml', 'hi', 'ta', 'ar', 'te', 'kn']", "['en', 'ml', 'ar', 'hi']")
    
    # We replace the label logic
    old_label = "{lang === 'en' ? 'English' : lang === 'ml' ? 'Malayalam' : lang === 'hi' ? 'Hindi' : lang === 'ta' ? 'Tamil' : lang === 'ar' ? 'Arabic' : lang === 'te' ? 'Telugu' : 'Kannada'}"
    new_label = "{lang === 'en' ? 'English' : lang === 'ml' ? 'Malayalam' : lang === 'hi' ? 'Hindi' : lang === 'ar' ? 'Arabic' : lang}"
    content = content.replace(old_label, new_label)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {editor}")
