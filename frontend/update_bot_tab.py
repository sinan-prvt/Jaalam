import glob
import re

files = glob.glob('d:/WebBuilder/frontend/src/pages/website/*Editor.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'Bot,' not in content and ' Bot ' not in content and ', Bot' not in content:
        content = re.sub(r'(\}\s*from\s*\'lucide-react\';)', r', Bot \1', content)
        
    if "id: 'bot'" not in content:
        content = re.sub(
            r"(\{\s*id:\s*'languages')",
            r"{ id: 'bot', icon: <Bot size={16} />, label: 'Bot' },\n            \1",
            content
        )
        
    bot_section = """
          {activeTab === 'bot' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">AI Chatbot</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={content.settings_json?.show_chatbot ?? true}
                      onChange={(e) => setContent({ ...content, settings_json: { ...(content.settings_json || {}), show_chatbot: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500 mb-4">Enable an AI support assistant for your visitors.</p>
                
                <div className="pt-6 border-t border-slate-100 mt-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Bot Icon Style</label>
                    <select
                      value={content.settings_json?.chatbot_icon_style || 'modern'}
                      onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), chatbot_icon_style: e.target.value } })}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="modern">Modern Dark</option>
                      <option value="gradient">Gradient Glow</option>
                      <option value="light">Clean Light</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Modal Style</label>
                    <select
                      value={content.settings_json?.chatbot_modal_style || 'professional'}
                      onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), chatbot_modal_style: e.target.value } })}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="professional">Professional Clean</option>
                      <option value="glassmorphic">Glassmorphic Modern</option>
                      <option value="playful">Playful Rounded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
"""
    if "activeTab === 'bot'" not in content:
        content = re.sub(r'(\s*\{activeTab === \'languages\' && \()', bot_section + r'\1', content)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Updated all editors safely.")
