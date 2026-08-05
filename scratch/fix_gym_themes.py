import os
import glob

gym_dir = r"c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes\gym"
files = glob.glob(os.path.join(gym_dir, "*.tsx"))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Injected Services Section and Dynamic Custom Section at the bottom
    # They usually start with {/* Injected Services Section */} and end before <footer
    if '{/* Injected Services Section */}' in content:
        start_idx = content.find('{/* Injected Services Section */}')
        end_idx = content.find('<footer', start_idx)
        if start_idx != -1 and end_idx != -1:
            while start_idx > 0 and content[start_idx-1] in (' ', '\t'):
                start_idx -= 1
            content = content[:start_idx] + content[end_idx:]

    # Also check if there's any other Injected sections
    if '{/* Injected About Section */}' in content:
        start_idx = content.find('{/* Injected About Section */}')
        end_idx = content.find('<footer', start_idx)
        if start_idx != -1 and end_idx != -1:
            while start_idx > 0 and content[start_idx-1] in (' ', '\t'):
                start_idx -= 1
            content = content[:start_idx] + content[end_idx:]

    # 2. Remove the duplicate ContactForm at the end of the contact section
    duplicate_form = '<div className="mt-12 w-full z-20 relative"><ContactForm websiteId={website.id} /></div>'
    if duplicate_form in content:
        content = content.replace(duplicate_form, '')
    duplicate_form_2 = '<div className="mt-12"><ContactForm websiteId={website.id} /></div>'
    if duplicate_form_2 in content:
        content = content.replace(duplicate_form_2, '')

    # 3. Inject correctly styled ContactForm above the map in each specific theme
    filename = os.path.basename(filepath)
    
    if filename == 'HardcoreIronTheme.tsx':
        map_marker = '<div className="w-full h-64 md:h-80 mt-8 bg-[#1A1A1A] relative overflow-hidden border-2 border-white/10">'
        form_code = '''<div className="mt-8 mb-8">
                            <h4 className="hi-subheading text-white text-lg tracking-widest mb-4">SEND A MESSAGE</h4>
                            <ContactForm 
                                websiteId={website.id} 
                                primaryColor="bg-[#FF2A2A]"
                                primaryColorHover="hover:bg-transparent hover:text-[#FF2A2A] border-2 border-[#FF2A2A] hover:border-[#FF2A2A]"
                                inputStyles="w-full bg-[#0D0D0D] border-[#FF2A2A]/30 text-white focus:border-[#FF2A2A] focus:ring-1 focus:ring-[#FF2A2A] rounded-none"
                            />
                          </div>
                          '''
        if map_marker in content and form_code not in content:
            content = content.replace(map_marker, form_code + map_marker)

    elif filename == 'CombatGymTheme.tsx':
        map_marker = '<div className="w-full h-64 md:h-80 bg-zinc-900 border border-zinc-800">'
        form_code = '''<div className="mt-8 mb-8">
                            <h4 className="combat-heading text-white text-xl tracking-wider mb-4 uppercase">Direct Message</h4>
                            <ContactForm 
                                websiteId={website.id} 
                                primaryColor="bg-[#E84A5F]"
                                primaryColorHover="hover:bg-[#C93B4E]"
                                inputStyles="w-full bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-[#E84A5F] focus:ring-1 focus:ring-[#E84A5F] rounded-none"
                            />
                          </div>
                          '''
        if map_marker in content and form_code not in content:
            content = content.replace(map_marker, form_code + map_marker)

    elif filename == 'CrossFitTheme.tsx':
        map_marker = '<div className="w-full h-64 md:h-80 bg-zinc-900 overflow-hidden border-2 border-[#F9F871]/10">'
        form_code = '''<div className="mt-8 mb-8">
                            <h4 className="cf-heading text-white text-2xl mb-4">Send a Message</h4>
                            <ContactForm 
                                websiteId={website.id} 
                                primaryColor="bg-[#F9F871]"
                                primaryColorHover="hover:bg-[#E0DF65]"
                                inputStyles="w-full bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-[#F9F871] focus:ring-1 focus:ring-[#F9F871] rounded-none"
                            />
                          </div>
                          '''
        if map_marker in content and form_code not in content:
            content = content.replace(map_marker, form_code + map_marker)
            
    elif filename == 'LuxuryClubTheme.tsx':
        map_marker = '<div className="w-full h-64 md:h-80 bg-[#1A1A1A] overflow-hidden border border-[#D4AF37]/30">'
        form_code = '''<div className="mt-8 mb-8">
                            <h4 className="lx-subheading text-[#D4AF37] text-sm tracking-widest uppercase mb-4">Enquire Now</h4>
                            <ContactForm 
                                websiteId={website.id} 
                                primaryColor="bg-[#D4AF37]"
                                primaryColorHover="hover:bg-[#B5952F]"
                                inputStyles="w-full bg-[#1A1A1A] border-[#D4AF37]/30 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-none"
                            />
                          </div>
                          '''
        if map_marker in content and form_code not in content:
            content = content.replace(map_marker, form_code + map_marker)

    elif filename == 'ZenYogaTheme.tsx':
        map_marker = '<div className="w-full h-64 md:h-80 bg-stone-200 overflow-hidden rounded-3xl">'
        form_code = '''<div className="mt-8 mb-8">
                            <h4 className="zen-subheading text-[#6B8E23] text-sm tracking-widest uppercase mb-4">Reach Out</h4>
                            <ContactForm 
                                websiteId={website.id} 
                                primaryColor="bg-[#6B8E23]"
                                primaryColorHover="hover:bg-[#55731A]"
                                inputStyles="w-full bg-stone-50 border-stone-200 text-stone-700 focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] rounded-3xl"
                            />
                          </div>
                          '''
        if map_marker in content and form_code not in content:
            content = content.replace(map_marker, form_code + map_marker)

    # 4. Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Finished processing all gym themes!')
