import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the fields and their corresponding JSX elements that need to be conditionally rendered.
    # It's tricky to do this with regex for React, so we'll do simple targeted replacements.
    
    # 1. hiddenFields declaration
    if "const hiddenFields = content?.settings_json?.hidden_elements || [];" not in content:
        # insert it after `const heroImage = ...;`
        content = re.sub(
            r'(const heroImage = [^\n]+;)',
            r'\1\n  const hiddenFields = content?.settings_json?.hidden_elements || [];',
            content
        )

    # 2. hero_title
    # From: <h1 className={`text-4xl ...`}>
    #       {content.hero_title || '...'}
    #       </h1>
    # To: {!hiddenFields.includes('hero_title') && <h1 ...>...</h1>}
    # We will use regex to find the h1 tag containing hero_title
    content = re.sub(
        r'(<h1[^>]*>[\s\n]*\{content\.hero_title[^<]*</h1>)',
        r'{!hiddenFields.includes("hero_title") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 3. hero_description
    content = re.sub(
        r'(<p[^>]*>[\s\n]*\{content\.hero_description[^<]*</p>)',
        r'{!hiddenFields.includes("hero_description") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 4. about_title
    content = re.sub(
        r'(<h2[^>]*>[\s\n]*\{content\.settings_json\?\.about_title[^<]*</h2>)',
        r'{!hiddenFields.includes("about_title") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 5. about_description
    content = re.sub(
        r'(<p[^>]*>[\s\n]*\{content\.settings_json\?\.about_description[^<]*</p>)',
        r'{!hiddenFields.includes("about_description") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )

    # 6. contact fields
    # Phone, Email, Location inside Contact section
    
    # Address:
    content = re.sub(
        r'(<div[^>]*>[\s\n]*<div[^>]*>[\s\n]*<MapPin[^<]*</div>[\s\n]*<h3[^>]*>Location</h3>[\s\n]*<p[^>]*>\{contact\.address\}</p>[\s\n]*</div>)',
        r'{!hiddenFields.includes("contact_address") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )
    
    # Address in footer:
    content = re.sub(
        r'(<li className="flex items-start gap-3">[\s\n]*<MapPin[^<]*/>[\s\n]*<span>\{content\.contact_info\?\.address[^\}]*\}</span>[\s\n]*</li>)',
        r'{!hiddenFields.includes("contact_address") && (\n              \1\n              )}',
        content,
        flags=re.DOTALL
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
process_file(r'd:\WebBuilder\frontend\src\components\themes\restaurant\RestaurantTheme.tsx')
print('Updated RestaurantTheme.tsx')
