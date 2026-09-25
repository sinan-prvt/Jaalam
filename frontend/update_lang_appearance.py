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
    
    old_section = r'<div className="pt-6 border-t border-slate-100 mt-4">\s*<label className="block text-\[10px\] font-black uppercase tracking-widest text-slate-500 mb-2">Widget Style & Position<\/label>.*?<\/select>\s*<\/div>'
    
    new_section = """<div className="pt-6 border-t border-slate-100 mt-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Widget Appearance</label>
                    <select
                      value={content.settings_json?.language_widget_appearance || 'full'}
                      onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), language_widget_appearance: e.target.value } })}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="full">Full Style (Icon + Text)</option>
                      <option value="icon">Icon Only</option>
                      <option value="short">Short Text (e.g. EN)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Widget Position</label>
                    <select
                      value={content.settings_json?.language_widget_style || 'bottom-center'}
                      onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), language_widget_style: e.target.value } })}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="center-right">Center Right</option>
                      <option value="center-left">Center Left</option>
                    </select>
                  </div>
                </div>"""
                  
    content = re.sub(old_section, new_section, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {editor}")
