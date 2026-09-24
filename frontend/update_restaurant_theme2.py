import os

filepath = 'src/components/themes/restaurant/RestaurantTheme.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '                <div className="space-y-6">'
end_marker = '                </div>\n              </div>\n              \n              <div className={`${bgDark}/80 backdrop-blur-xl'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

replacement = """                <div className="space-y-6">
                  {!hiddenFields.includes('contact_address') && (
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${primaryColor} flex items-center justify-center shrink-0 shadow-lg`}>
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Location</h4>
                      <p className="text-slate-400 font-light">{content.contact_info?.address || '123 Culinary Avenue, Food District, NY 10012'}</p>
                    </div>
                  </div>
                  )}
                  {!hiddenFields.includes('contact_phone') && (
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${primaryColor} flex items-center justify-center shrink-0 shadow-lg`}>
                      <Phone className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone</h4>
                      <p className="text-slate-400 font-light">{content.contact_info?.phone || '+1 (555) 123-4567'}</p>
                    </div>
                  </div>
                  )}
                  {!hiddenFields.includes('contact_hours') && (
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${primaryColor} flex items-center justify-center shrink-0 shadow-lg`}>
                      <Clock className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Hours</h4>
                      <p className="text-slate-400 font-light whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sun: 11:00 AM - 11:00 PM'}</p>
                    </div>
                  </div>
                  )}
"""

content = content[:start_idx] + replacement + content[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated RestaurantTheme.tsx block")
