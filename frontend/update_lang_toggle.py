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
    
    old_heading = r'<h3 className="font-bold text-slate-800">Website Translation<\/h3>'
    
    new_heading = """<div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Website Translation</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={content.settings_json?.show_language_widget ?? true}
                      onChange={(e) => setContent({ ...content, settings_json: { ...(content.settings_json || {}), show_language_widget: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>"""
                  
    content = re.sub(old_heading, new_heading, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {editor}")
