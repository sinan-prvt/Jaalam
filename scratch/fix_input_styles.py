import os

filepath = r'c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes\restaurant\CafeTheme.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace all instances of <ContactForm websiteId={website.id} />
# With <ContactForm websiteId={website.id} inputStyles="bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400" />
# Or something that looks good on light backgrounds.
# Since it is a cafe, maybe border-slate-300, focus:border-[#C19A6B]

new_props = 'inputStyles="bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-sm shadow-sm"'

# We might also want to set primaryColor if needed, but ContactForm default is bg-amber-600 which looks great for Cafe.

content = content.replace('<ContactForm websiteId={website.id} />', f'<ContactForm websiteId={{website.id}} {new_props} />')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed ContactForm input styles in CafeTheme.tsx')
