import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
        else if (f.endsWith('Theme.tsx')) callback(dirPath);
    });
}

let modified = 0;
walkDir('src/components/themes', (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    content = content.replace(/\{selectedProduct\s*&&\s*\(\s*\)\}/g, '');

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        modified++;
    }
});
console.log('Cleaned up empty JSX blocks in', modified, 'files');
