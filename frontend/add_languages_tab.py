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

languages_content = """
          {activeTab === 'languages' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800">Website Translation</h3>
                <p className="text-xs text-slate-500 mb-4">Select the languages you want to offer your visitors.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {['en', 'ml', 'hi', 'ta', 'ar', 'te', 'kn'].map(lang => (
                    <label key={lang} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        checked={(content.settings_json?.languages || ['en', 'ml']).includes(lang)}
                        onChange={(e) => {
                          let currentLangs = [...(content.settings_json?.languages || ['en', 'ml'])];
                          if (e.target.checked) {
                            if (!currentLangs.includes(lang)) currentLangs.push(lang);
                          } else {
                            currentLangs = currentLangs.filter(l => l !== lang);
                            if (currentLangs.length === 0) currentLangs = ['en'];
                          }
                          setContent({ ...content, settings_json: { ...(content.settings_json || {}), languages: currentLangs } });
                        }}
                      />
                      <span className="font-bold text-sm text-slate-700">
                        {lang === 'en' ? 'English' : lang === 'ml' ? 'Malayalam' : lang === 'hi' ? 'Hindi' : lang === 'ta' ? 'Tamil' : lang === 'ar' ? 'Arabic' : lang === 'te' ? 'Telugu' : 'Kannada'}
                      </span>
                    </label>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-slate-100 mt-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Widget Style & Position</label>
                  <select
                    value={content.settings_json?.language_widget_style || 'modern'}
                    onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), language_widget_style: e.target.value } })}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="modern">Modern Floating (Top Left)</option>
                    <option value="top-right">Minimal (Top Right)</option>
                    <option value="bottom-left">Pill (Bottom Left)</option>
                    <option value="bottom-center">Glassmorphism (Bottom Center)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
"""

for editor in editors:
    filepath = os.path.join(editors_dir, editor)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if we already added it
    if "activeTab === 'languages'" in content:
        print(f"Skipping {editor}, already added.")
        continue

    # Add Globe to lucide-react imports if not there
    # It might be there because 'contact' tab uses Globe
    
    # Add tab to tabs array
    tab_injection = "    { id: 'languages', icon: <Globe size={16} />, label: 'Languages' },\n"
    cta_match = re.search(r"\{\s*id:\s*'cta',", content)
    
    if cta_match:
        content = content[:cta_match.start()] + tab_injection + content[cta_match.start():]
    else:
        # Fallback
        pass

    # Add form block
    # Insert after CTA block or at the end of form container
    # Best way: find `{activeTab === 'cta' && (` and insert before it
    form_start_match = re.search(r"\{activeTab === 'cta' && \(", content)
    if form_start_match:
        insert_pos = form_start_match.start()
        content = content[:insert_pos] + languages_content + "\n" + content[insert_pos:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {editor}")
