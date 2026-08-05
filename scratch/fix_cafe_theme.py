import os

filepath = r'c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes\restaurant\CafeTheme.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the raw injections
bad_string = '<div className="mt-12 w-full z-20 relative"><ContactForm websiteId={website.id} /></div>'
content = content.replace(bad_string, '')
content = content.replace('\n            \n          ', '\n          ')

# For App Style (around line 550)
app_style_target = '{/* Google Map Card */}'
app_style_form = '''
                            <div className="border-t border-slate-100 pt-6 mt-6">
                              <h4 className="font-bold text-slate-800 text-sm mb-4">Send a Message</h4>
                              <ContactForm websiteId={website.id} />
                            </div>
                          </div>
'''
if app_style_target in content:
    content = content.replace('</div>\n\n                          {/* Google Map Card */}', app_style_form + '\n                          {/* Google Map Card */}')

# For Modern Bakery (around line 1180)
mb_target = '{/* Map Area */}'
mb_form = '''
                            <div className="border-t border-[#EBE6DD] pt-6 mt-6">
                              <h4 className={`font-bold ${bakeryColors.textDark} text-sm mb-4 uppercase tracking-wider`}>Send a Message</h4>
                              <ContactForm websiteId={website.id} />
                            </div>
                          </div>
'''
if mb_target in content:
    content = content.replace('</div>\n\n                      {/* Map Area */}', mb_form + '\n                      {/* Map Area */}')

# For Artisan (around line 1850)
artisan_target = '<div className="md:w-1/2 h-[400px] bg-stone-200">'
artisan_form = '''
                            <div className="border-t border-stone-200 pt-6 mt-6">
                              <h4 className="font-serif font-bold text-stone-900 text-lg mb-4">Send a Message</h4>
                              <ContactForm websiteId={website.id} />
                            </div>
                          </div>
'''
if artisan_target in content:
    content = content.replace('</div>\n                      <div className="md:w-1/2 h-[400px] bg-stone-200">', artisan_form + '\n                      <div className="md:w-1/2 h-[400px] bg-stone-200">')

# For Boutique (around line 2460)
boutique_target = '<div className="md:w-1/2 h-[300px] md:h-auto bg-slate-100 relative overflow-hidden">'
boutique_form = '''
                            <div className="border-t border-slate-100 pt-6 mt-8">
                              <h4 className="font-medium text-slate-900 text-sm tracking-widest uppercase mb-4">Send a Message</h4>
                              <ContactForm websiteId={website.id} />
                            </div>
                          </div>
'''
if boutique_target in content:
    content = content.replace('</div>\n\n                      <div className="md:w-1/2 h-[300px] md:h-auto bg-slate-100 relative overflow-hidden">', boutique_form + '\n\n                      <div className="md:w-1/2 h-[300px] md:h-auto bg-slate-100 relative overflow-hidden">')

# For Cozy Cafe / Default (around line 3010)
cozy_target = '<div className="md:w-1/2 w-full bg-slate-200 aspect-square md:aspect-[4/3] rounded-sm overflow-hidden relative border border-slate-100">'
cozy_form = '''
                            <div className="border-t border-slate-200 pt-6 mt-8">
                              <h4 className={`font-bold ${colors.textDark} text-sm mb-4 uppercase tracking-wider`}>Send a Message</h4>
                              <ContactForm websiteId={website.id} />
                            </div>
                          </div>
'''
if cozy_target in content:
    content = content.replace('</div>\n                      <div className="md:w-1/2 w-full bg-slate-200 aspect-square md:aspect-[4/3] rounded-sm overflow-hidden relative border border-slate-100">', cozy_form + '\n                      <div className="md:w-1/2 w-full bg-slate-200 aspect-square md:aspect-[4/3] rounded-sm overflow-hidden relative border border-slate-100">')


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed CafeTheme.tsx injections')
