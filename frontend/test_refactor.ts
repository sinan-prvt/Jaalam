import * as fs from 'fs';

const file = 'src/components/themes/grocery/ClassicGroceryTheme.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('theme-root')) {
    // 1. Add definitions
    content = content.replace('export default function ClassicGroceryTheme({ website, content }: any) {',
        `export default function ClassicGroceryTheme({ website, content }: any) {
  const sectionOrder = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections = content?.settings_json?.hidden_sections || [];`);

    // 2. Add theme-root and flex flex-col
    content = content.replace(/className="min-h-screen([^"]*)"/, 'className="min-h-screen theme-root flex flex-col$1"');

    // 3. Inject dynamic CSS and generic sections
    const styleInjection = `
        /* Dynamic Layout Ordering */
        .theme-root > header { order: 0; }
        .theme-root > section:nth-of-type(1) { order: \${sectionOrder.indexOf('hero') + 1}; display: \${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: \${sectionOrder.indexOf('menu') + 1}; display: \${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    `;
    content = content.replace('`}</style>', styleInjection + '\n      `}</style>');
    
    fs.writeFileSync(file, content);
    console.log('Modified', file);
} else {
    console.log('Already modified');
}
