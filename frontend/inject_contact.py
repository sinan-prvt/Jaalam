import os

def walk_dir(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('Theme.tsx'):
                yield os.path.join(root, file)

for filepath in walk_dir('src/components/themes'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Check if the file already has a contact section
    if "id=\"contact\"" in content or "id='contact'" in content or "sectionId === 'contact'" in content:
        continue

    # We need to inject the Contact section right before the Footer
    # Look for `{/* Footer */}` or `<footer`
    
    contact_code = """
      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">Have questions or want to reach out? Contact our support team.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="font-bold text-gray-800">{content.contact_info?.phone || '1800 123 4567'}</span>
              </div>
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="font-bold text-gray-800 break-all">{content.contact_info?.email || 'hello@example.com'}</span>
              </div>
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="font-bold text-gray-800 text-sm max-w-[200px] truncate">{content.contact_info?.address || '123 Main Street'}</span>
              </div>
            </div>
          </div>
        </section>
      )}
"""

    if "{/* Footer */}" in content:
        content = content.replace("{/* Footer */}", contact_code + "\n      {/* Footer */}")
    elif "<footer" in content:
        content = content.replace("<footer", contact_code + "\n      <footer")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected Contact section into {filepath}")
