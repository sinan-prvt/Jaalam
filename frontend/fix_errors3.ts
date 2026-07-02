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

    // The injected string was exactly:
    // onClick={() => setSelectedProduct(p)} className="cursor-pointer 
    // And sometimes with product:
    // onClick={() => setSelectedProduct(product)} className="cursor-pointer 
    
    // We will just find any tag that has TWO onClick attributes
    // And remove the first one that matches our injected string
    
    let tagRegex = /<([a-zA-Z0-9]+)([^>]+)>/g;
    content = content.replace(tagRegex, (match, tag, attrs) => {
        let onClicks = attrs.match(/onClick=\{[^}]+\}/g);
        if (onClicks && onClicks.length > 1) {
             let newAttrs = attrs.replace(/onClick=\{\(\) => setSelectedProduct\((p|product)\)\}\s+className="cursor-pointer\s*/, '');
             if (newAttrs !== attrs) {
                  return `<${tag}${newAttrs}>`;
             }
             // What if it injected at the end?
             newAttrs = attrs.replace(/onClick=\{\(\) => setSelectedProduct\((p|product)\)\}/, '');
             return `<${tag}${newAttrs}>`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed duplicate onClick in', filepath);
    }
});
