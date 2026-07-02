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
    let original = content;

    // Fix multiple onClick attributes
    // Find onClick={...} ... onClick={...} and keep only the first one if they are on the same tag
    // Actually, it's easier to just do a global replace for:
    // onClick={() => setSelectedProduct(p)} className="cursor-pointer onClick={() => setSelectedProduct(p)}
    content = content.replace(/onClick=\{\(\) => setSelectedProduct\(p\)\}\s+className="cursor-pointer\s+onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setSelectedProduct\(p\);\s*\}\}/g, 'className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}');
    
    // Also fix simple duplicates
    content = content.replace(/onClick=\{\(\) => setSelectedProduct\(p\)\}\s+className="cursor-pointer\s+onClick=\{\(\) => setSelectedProduct\(p\)\}/g, 'className="cursor-pointer" onClick={() => setSelectedProduct(p)}');

    // Sometimes it's added to a tag that already had it further down the line
    // Just find any tag with two onClicks and remove the first one we added
    let tagRegex = /<([a-zA-Z0-9]+)([^>]+)>/g;
    content = content.replace(tagRegex, (match, tag, attrs) => {
        let onClicks = attrs.match(/onClick=\{[^}]+\}/g);
        if (onClicks && onClicks.length > 1) {
             // Remove our injected one
             let newAttrs = attrs.replace('onClick={() => setSelectedProduct(p)} className="cursor-pointer ', 'className="');
             if (newAttrs === attrs) {
                 newAttrs = attrs.replace('onClick={() => setSelectedProduct(p)} className="cursor-pointer"', '');
             }
             return `<${tag}${newAttrs}>`;
        }
        return match;
    });

    // Fix missing setSelectedProduct state
    if (content.includes('setSelectedProduct') && !content.includes('const [selectedProduct, setSelectedProduct]')) {
        // Find the start of the component function
        let exportRegex = /export default function [A-Za-z0-9_]+\([^)]*\)\s*\{/;
        let match = content.match(exportRegex);
        if (match) {
            content = content.replace(exportRegex, `${match[0]}\n  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);`);
        }
    }
    
    // Also ensure React is imported correctly if we just used React.useState
    if (content.includes('React.useState') && !content.includes('import React')) {
        content = `import React from 'react';\n` + content;
    }

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed errors in', filepath);
    }
});
