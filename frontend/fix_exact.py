path = 'src/components/themes/restaurant/CafeTheme.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    (
        '''<li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer">
                    <MapPin size={20} className="shrink-0 mt-1 text-[#C19A6B]" />
                    <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                  </li>''',
        '''{content.contact_info?.address && (
                  <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer">
                    <MapPin size={20} className="shrink-0 mt-1 text-[#C19A6B]" />
                    <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                  </li>
                  )}'''
    ),
    (
        '''<li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                    <Phone size={20} className="shrink-0 text-[#C19A6B]" />
                    <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                  </li>''',
        '''{content.contact_info?.phone && (
                  <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                    <Phone size={20} className="shrink-0 text-[#C19A6B]" />
                    <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                  </li>
                  )}'''
    ),
    (
        '''<li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={20} className="shrink-0 mt-1 text-[#C19A6B]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>''',
        '''{content.contact_info?.address && (
                    <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={20} className="shrink-0 mt-1 text-[#C19A6B]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={18} className="shrink-0 mt-1 text-[#C5A880]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>''',
        '''{content.contact_info?.address && (
                    <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={18} className="shrink-0 mt-1 text-[#C5A880]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={18} className="shrink-0 text-[#C5A880]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>''',
        '''{content.contact_info?.phone && (
                    <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={18} className="shrink-0 text-[#C5A880]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={18} className="shrink-0 mt-1 text-[#C27D56]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>''',
        '''{content.contact_info?.address && (
                    <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={18} className="shrink-0 mt-1 text-[#C27D56]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={18} className="shrink-0 text-[#C27D56]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>''',
        '''{content.contact_info?.phone && (
                    <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={18} className="shrink-0 text-[#C27D56]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={18} className="shrink-0 mt-1 text-[#D4A373]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>''',
        '''{content.contact_info?.address && (
                    <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={18} className="shrink-0 mt-1 text-[#D4A373]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={18} className="shrink-0 text-[#D4A373]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>''',
        '''{content.contact_info?.phone && (
                    <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={18} className="shrink-0 text-[#D4A373]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>
                    )}'''
    ),
    (
        '''<div className="flex items-start gap-4">
                                  <MapPin className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Address</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                                  </div>
                                </div>''',
        '''{content.contact_info?.address && (
                                <div className="flex items-start gap-4">
                                  <MapPin className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Address</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                                  </div>
                                </div>
                                )}'''
    ),
    (
        '''<div className="flex items-start gap-4">
                                  <Phone className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Phone</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                                  </div>
                                </div>''',
        '''{content.contact_info?.phone && (
                                <div className="flex items-start gap-4">
                                  <Phone className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Phone</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                                  </div>
                                </div>
                                )}'''
    ),
    (
        '''<div className="flex items-start gap-4">
                                  <Mail className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Email</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                                  </div>
                                </div>''',
        '''{content.contact_info?.email && (
                                <div className="flex items-start gap-4">
                                  <Mail className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Email</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                                  </div>
                                </div>
                                )}'''
    ),
    (
        '''<div className="flex items-start gap-4">
                            <MapPin className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Location</h4>
                              <p className={colors.textMuted}>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                            </div>
                          </div>''',
        '''{content.contact_info?.address && (
                          <div className="flex items-start gap-4">
                            <MapPin className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Location</h4>
                              <p className={colors.textMuted}>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                            </div>
                          </div>
                          )}'''
    ),
    (
        '''<div className="flex items-start gap-4">
                            <Phone className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Phone</h4>
                              <p className={colors.textMuted}>{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                            </div>
                          </div>''',
        '''{content.contact_info?.phone && (
                          <div className="flex items-start gap-4">
                            <Phone className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Phone</h4>
                              <p className={colors.textMuted}>{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                            </div>
                          </div>
                          )}'''
    ),
    (
        '''<div className="flex items-start gap-4">
                            <Mail className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Email</h4>
                              <p className={colors.textMuted}>{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                            </div>
                          </div>''',
        '''{content.contact_info?.email && (
                          <div className="flex items-start gap-4">
                            <Mail className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Email</h4>
                              <p className={colors.textMuted}>{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                            </div>
                          </div>
                          )}'''
    )
]

count = 0
for old, new in replacements:
    if old in code:
        code = code.replace(old, new)
        count += 1
    else:
        print(f"Could not find: {old[:100]}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print(f'Replaced {count} chunks successfully')
