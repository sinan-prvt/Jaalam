import os

files_to_fix = [
    'src/components/themes/grocery/ClassicGroceryTheme.tsx',
    'src/components/themes/grocery/PremiumGroceryTheme.tsx',
    'src/components/themes/stationery/VintageStationeryTheme.tsx',
    'src/components/themes/textiles/BoutiqueTextilesTheme.tsx'
]

map_code = """
            <div className="mt-12 w-full h-64 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-md relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798902705!2d-74.25986548248684!3d40.697670067823786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1689264426578!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={True} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </section>
"""

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We replace the end of the contact block we injected
    target_search = """              </div>
            </div>
          </div>
        </section>
      )}"""
    
    # Actually wait, the injected code was:
    #             <span className="font-bold text-gray-800 text-sm max-w-[200px] truncate">{content.contact_info?.address || '123 Main Street'}</span>
    #           </div>
    #         </div>
    #       </div>
    #     </section>
    
    # We can just use replace
    replacement = """              </div>
            </div>
            
            {/* Embedded Map */}
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-inner border border-gray-100 relative mt-8">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798902705!2d-74.25986548248684!3d40.697670067823786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1689264426578!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={True} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
            
          </div>
        </section>
      )}"""
      
    # Careful not to duplicate
    if "Embedded Map" not in content:
        content = content.replace("""              </div>
            </div>
          </div>
        </section>
      )}""", replacement)
      
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content.replace("allowFullScreen={True}", "allowFullScreen={true}"))
        print(f"Added map to {filepath}")
