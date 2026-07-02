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
    let modified = false;

    if (content.includes('const sectionOrder = content?.settings_json')) {
        content = content.replace('const sectionOrder = content?.settings_json', 'const sectionOrder: string[] = content?.settings_json');
        modified = true;
    }
    
    if (content.includes('const hiddenSections = content?.settings_json')) {
        content = content.replace('const hiddenSections = content?.settings_json', 'const hiddenSections: string[] = content?.settings_json');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed types in', filepath);
    }
});
