const fs = require('fs');

const file = 'd:/WebBuilder/frontend/src/components/themes/salon/SalonTheme.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace address
content = content.replace(
  `                              <div className="flex items-center gap-5">
                                <div className={\`w-12 h-12 \${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0\`} style={{ color: primaryGold }}>
                                  <MapPin size={20} />
                                </div>
                                <div>
                                  <p className={\`text-xs \${textMuted} font-bold tracking-wider uppercase mb-1\`}>Location</p>
                                  {!hiddenFields.includes('contact_address') && (
                                                  <p className={\`text-sm font-bold \${textColor}\`}>{content.contact_info?.address || 'Lagos, Nigeria'}</p>
                                                  )}
                                </div>
                              </div>

                              <div className={\`w-full h-px \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}\`}></div>`,
  
  `                              {!hiddenFields.includes('contact_address') && (
                                <>
                                  <div className="flex items-center gap-5">
                                    <div className={\`w-12 h-12 \${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0\`} style={{ color: primaryGold }}>
                                      <MapPin size={20} />
                                    </div>
                                    <div>
                                      <p className={\`text-xs \${textMuted} font-bold tracking-wider uppercase mb-1\`}>Location</p>
                                      <p className={\`text-sm font-bold \${textColor}\`}>{content.contact_info?.address || 'Lagos, Nigeria'}</p>
                                    </div>
                                  </div>
                                  <div className={\`w-full h-px \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}\`}></div>
                                </>
                              )}`
);

// Replace phone
content = content.replace(
  `                              <div className="flex items-center gap-5">
                                <div className={\`w-12 h-12 \${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0\`} style={{ color: primaryGold }}>
                                  <Phone size={20} />
                                </div>
                                <div>
                                  <p className={\`text-xs \${textMuted} font-bold tracking-wider uppercase mb-1\`}>Phone Number</p>
                                  {!hiddenFields.includes('contact_phone') && (
                                                  <p className={\`text-sm font-bold \${textColor}\`}>{content.contact_info?.phone || '+1 234 567 8900'}</p>
                                                  )}
                                </div>
                              </div>

                              <div className={\`w-full h-px \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}\`}></div>`,
                              
  `                              {!hiddenFields.includes('contact_phone') && (
                                <>
                                  <div className="flex items-center gap-5">
                                    <div className={\`w-12 h-12 \${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0\`} style={{ color: primaryGold }}>
                                      <Phone size={20} />
                                    </div>
                                    <div>
                                      <p className={\`text-xs \${textMuted} font-bold tracking-wider uppercase mb-1\`}>Phone Number</p>
                                      <p className={\`text-sm font-bold \${textColor}\`}>{content.contact_info?.phone || '+1 234 567 8900'}</p>
                                    </div>
                                  </div>
                                  <div className={\`w-full h-px \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}\`}></div>
                                </>
                              )}`
);

// Replace email
content = content.replace(
  `                              <div className="flex items-center gap-5">
                                <div className={\`w-12 h-12 \${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0\`} style={{ color: primaryGold }}>
                                  <Mail size={20} />
                                </div>
                                <div>
                                  <p className={\`text-xs \${textMuted} font-bold tracking-wider uppercase mb-1\`}>Email Address</p>
                                  {!hiddenFields.includes('contact_email') && (
                                                  <p className={\`text-sm font-bold \${textColor}\`}>{content.contact_info?.email || 'hello@saloo.com'}</p>
                                                  )}
                                </div>
                              </div>

                              <div className={\`w-full h-px \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}\`}></div>`,
                              
  `                              {!hiddenFields.includes('contact_email') && (
                                <>
                                  <div className="flex items-center gap-5">
                                    <div className={\`w-12 h-12 \${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0\`} style={{ color: primaryGold }}>
                                      <Mail size={20} />
                                    </div>
                                    <div>
                                      <p className={\`text-xs \${textMuted} font-bold tracking-wider uppercase mb-1\`}>Email Address</p>
                                      <p className={\`text-sm font-bold \${textColor}\`}>{content.contact_info?.email || 'hello@saloo.com'}</p>
                                    </div>
                                  </div>
                                  <div className={\`w-full h-px \${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}\`}></div>
                                </>
                              )}`
);

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed SalonTheme.tsx');
