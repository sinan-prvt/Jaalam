import { Project, SyntaxKind, JsxElement, Node } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const project = new Project();
project.addSourceFilesAtPaths("src/components/themes/**/*.tsx");

const files = project.getSourceFiles();

for (const sourceFile of files) {
    if (sourceFile.getBaseName() === 'SectionLayout.tsx') continue;
    
    const func = sourceFile.getDefaultExportSymbol()?.getDeclarations()[0];
    if (!func) continue;
    
    // Check if it's already using sectionOrder heavily
    const text = sourceFile.getFullText();
    if (text.includes('sectionOrder.map')) {
        console.log(`Skipping ${sourceFile.getBaseName()} (already dynamic)`);
        continue;
    }

    console.log(`Processing ${sourceFile.getBaseName()}...`);
    
    // We will just do a simpler string replacement for the missing sections, 
    // because full AST transformation for 61 wildly different files is highly error prone.
    // However, if we just want to ensure 'Custom' section and others are available:
    
    // Actually, let's just use string replacement on the file content directly.
    let newText = text;
    
    // 1. Add definitions
    if (!newText.includes('const sectionOrder')) {
        const insertPos = newText.indexOf('return (');
        if (insertPos !== -1) {
            const definitions = `
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  
`;
            newText = newText.slice(0, insertPos) + definitions + newText.slice(insertPos);
        }
    }
    
    // 2. Add flex flex-col to root to enable order
    newText = newText.replace(/className="min-h-screen([^"]*)"/, 'className="min-h-screen flex flex-col$1"');
    
    // 3. We can't easily add style={{order}} to every section via regex reliably.
    
    // Let's save it
    // fs.writeFileSync(sourceFile.getFilePath(), newText);
}
