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
    
    // Check if there are multiple declarations
    const matchesOrder = content.match(/const sectionOrder\b/g);
    const matchesHidden = content.match(/const hiddenSections\b/g);
    
    let modified = false;

    if (matchesOrder && matchesOrder.length > 1) {
        // Remove the SECOND declaration of sectionOrder.
        // It's usually like `const sectionOrder: string[] = ...` or `const sectionOrder = ...`
        content = content.replace(/(const sectionOrder(?:[: \w\[\]]*)\s*=[^;]+;\s*)/g, (match, p1, offset, string) => {
            // If this is not the first occurrence, return empty string
            if (offset > string.indexOf('const sectionOrder')) return '';
            return match;
        });
        modified = true;
    }
    
    if (matchesHidden && matchesHidden.length > 1) {
        content = content.replace(/(const hiddenSections(?:[: \w\[\]]*)\s*=[^;]+;\s*)/g, (match, p1, offset, string) => {
            if (offset > string.indexOf('const hiddenSections')) return '';
            return match;
        });
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed', filepath);
    }
});
