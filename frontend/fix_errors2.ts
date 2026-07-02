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

    // Fix multiple onClick attributes again
    let tagRegex = /<([a-zA-Z0-9]+)([^>]+)>/g;
    content = content.replace(tagRegex, (match, tag, attrs) => {
        let onClicks = attrs.match(/onClick=\{[^}]+\}/g);
        if (onClicks && onClicks.length > 1) {
             let newAttrs = attrs.replace('onClick={() => setSelectedProduct(p)}', '');
             // Clean up leftover className="cursor-pointer " if any
             newAttrs = newAttrs.replace('className="cursor-pointer ', 'className="');
             return `<${tag}${newAttrs}>`;
        }
        return match;
    });

    // Fix 'Cannot find name p'
    // This happens if the map used something else, e.g. products.map((item, i)
    // Actually, we can just look for products.map((varName, and if we used setSelectedProduct(p), change it to varName.
    let mapVarRegex = /products\.slice\([^\)]*\)\.map\(\(([a-zA-Z0-9_]+)/;
    let mapVarMatch = content.match(mapVarRegex);
    if (!mapVarMatch) {
         mapVarMatch = content.match(/products\.map\(\(([a-zA-Z0-9_]+)/);
    }
    
    if (mapVarMatch) {
        let varName = mapVarMatch[1];
        if (varName !== 'p') {
            content = content.replace(/setSelectedProduct\(p\)/g, `setSelectedProduct(${varName})`);
        }
    } else {
        // sometimes it's gallery mapping and we accidentally added it there? No.
        // Let's just fix it manually if there are only 4 files
        if (filepath.includes('CombatGymTheme') || filepath.includes('CrossFitTheme') || filepath.includes('LuxuryClubTheme') || filepath.includes('ZenYogaTheme') || filepath.includes('PopFancyTheme') || filepath.includes('NoirFancyTheme')) {
            content = content.replace(/setSelectedProduct\(p\)/g, `setSelectedProduct(product)`);
            content = content.replace(/setSelectedProduct\(item\)/g, `setSelectedProduct(product)`);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed errors in', filepath);
    }
});
