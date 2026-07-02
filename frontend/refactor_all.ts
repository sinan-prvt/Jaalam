import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
        else if (f.endsWith('Theme.tsx')) callback(dirPath);
    });
}

walkDir('src/components/themes', (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Skip already modified
    if (content.includes('theme-root')) return;

    // 1. Add sectionOrder / hiddenSections definitions
    content = content.replace(/(export default function \w+\(.*\) \{)/,
        `$1
  const sectionOrder = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections = content?.settings_json?.hidden_sections || [];`);

    // 2. Add flex flex-col to root
    content = content.replace(/className="min-h-screen([^"]*)"/, 'className="min-h-screen theme-root flex flex-col$1"');

    // 3. Inject CSS
    // Determine the nths for sections. Typically:
    // Header is first element (header or nav or div) -> we just order it 0
    // Footer is last element -> we just order it 999
    // Other sections -> we order them by their index in sectionOrder + 1
    // Instead of nth-of-type(1) which might be wrong if there are multiple divs, we can target them directly if we inject classes.
    // BUT we didn't inject classes. Let's just use CSS nth-child if they are sections.
    // Or even better, we can inject style objects directly into the JSX using regex, but that's hard.
    // We'll stick to CSS for now.
    
    // A more resilient approach is to use the existing tags
    const styleInjection = `
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: \${sectionOrder.indexOf('hero') + 1}; display: \${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: \${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: \${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    `;
    
    if (content.includes('`}</style>')) {
        content = content.replace('`}</style>', styleInjection + '\n      `}</style>');
    } else {
        // If no style tag exists, inject it right after the root div
        content = content.replace(/<div className="min-h-screen theme-root flex flex-col[^"]*">/, 
            `$&
      <style>{\`${styleInjection}\`}</style>`);
    }

    // 4. Inject Custom Section block right before Footer (or at the end of the return statement)
    const customSectionBlock = `
      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}
`;
    // Insert before {/* Footer */} or </footer>
    if (content.includes('{/* Footer */}')) {
        content = content.replace('{/* Footer */}', customSectionBlock + '\n      {/* Footer */}');
    } else if (content.includes('<footer')) {
        content = content.replace('<footer', customSectionBlock + '\n      <footer');
    }
    
    fs.writeFileSync(filepath, content);
    console.log('Modified', filepath);
});
