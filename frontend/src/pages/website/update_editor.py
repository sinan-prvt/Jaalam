import re

with open(r'd:\WebBuilder\frontend\src\pages\website\WebsiteEditor.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's insert the FieldLabel component
field_label_code = """const FieldLabel = ({ label, fieldKey, content, setContent }: any) => {
  const hiddenElements = content.settings_json?.hidden_elements || [];
  const isHidden = hiddenElements.includes(fieldKey);
  
  return (
    <div className="flex justify-between items-center mb-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <button
        onClick={() => {
          const newHidden = isHidden ? hiddenElements.filter((k: string) => k !== fieldKey) : [...hiddenElements, fieldKey];
          setContent({ ...content, settings_json: { ...(content.settings_json || {}), hidden_elements: newHidden } });
        }}
        className={`p-1 rounded transition-colors ${isHidden ? 'text-slate-400 hover:text-indigo-600 bg-slate-100' : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50'}`}
        title={isHidden ? 'Show Field' : 'Hide Field'}
      >
        {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
};

export default function WebsiteEditor() {"""

code = code.replace('export default function WebsiteEditor() {', field_label_code)

# Replace all labels
labels_to_replace = [
    ('Hero Title', 'hero_title'),
    ('Hero Description', 'hero_description'),
    ('About Title', 'about_title'),
    ('Phone', 'contact_phone'),
    ('Email', 'contact_email'),
    ('Address', 'contact_address'),
    ('Office / Opening Hours', 'contact_hours'),
    ('Facebook Link', 'contact_facebook'),
    ('WhatsApp Link', 'contact_whatsapp'),
    ('Instagram Link', 'contact_instagram')
]

for label_text, field_key in labels_to_replace:
    pattern = rf'<label className="block text-\[10px\] font-black uppercase tracking-widest text-slate-500 mb-2">{label_text}</label>'
    replacement = f'<FieldLabel label="{label_text}" fieldKey="{field_key}" content={{content}} setContent={{setContent}} />'
    code = re.sub(pattern, replacement, code)

with open(r'd:\WebBuilder\frontend\src\pages\website\WebsiteEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated WebsiteEditor.tsx')
