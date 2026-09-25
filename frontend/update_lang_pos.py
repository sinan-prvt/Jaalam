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
    
    old_select_re = r'<select[^>]*value=\{content\.settings_json\?\.language_widget_style.*?<\/select>'
    
    new_select = """<select
                    value={content.settings_json?.language_widget_style || 'top-right'}
                    onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), language_widget_style: e.target.value } })}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="top-right">Navbar (Top Right)</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Footer (Bottom Right)</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>"""
                  
    content = re.sub(old_select_re, new_select, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {editor}")
