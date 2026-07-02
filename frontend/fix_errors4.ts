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

    let tagRegex = /<([a-zA-Z0-9]+)([^>]+)>/g;
    content = content.replace(tagRegex, (match, tag, attrs) => {
        let onClicks = attrs.match(/onClick=\{[^}]+\}/g);
        if (onClicks && onClicks.length > 1) {
             let newAttrs = attrs.replace('onClick={() => setSelectedProduct(p)}', '');
             newAttrs = newAttrs.replace('onClick={() => setSelectedProduct(product)}', '');
             // also remove dangling cursor-pointer if it's the exact string we injected
             newAttrs = newAttrs.replace('className="cursor-pointer "', '');
             // or if it was injected into an existing class, we might have left ` className="cursor-pointer `
             newAttrs = newAttrs.replace('className="cursor-pointer ', 'className="');
             return `<${tag}${newAttrs}>`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed duplicate onClick in', filepath);
    }
});
