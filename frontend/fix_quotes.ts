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

    content = content.replace(/className=\\'h-8/g, 'className="h-8');
    content = content.replace(/className=\\'h-10/g, 'className="h-10');
    content = content.replace(/object-contain\\'/g, 'object-contain"');

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed quotes in', filepath);
        modified++;
    }
});
console.log('Total fixed:', modified);
