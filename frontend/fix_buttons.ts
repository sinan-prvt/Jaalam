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

    // Find the Hero section
    // Typically it's between {/* Hero */} and the next section, or just the first <button> after <header>
    
    // We will look for a button that contains common hero CTA text
    const buttonRegex = /<button([^>]*)>\s*(View Weekly Flyer|Shop Now|Explore|Get Started|Book Appointment|Book Now|View Collection|Explore Collection|View Properties|See Menu|View Menu|Discover|Start Shopping|Find Out More|Get in Touch|View Our Services|Browse Catalog|View Gallery|Contact Us|Learn More)\s*<\/button>/ig;
    
    content = content.replace(buttonRegex, (match, attrs, text) => {
        if (!attrs.includes('onClick')) {
            // Determine target based on text
            let target = 'menu';
            if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('touch') || text.toLowerCase().includes('book')) {
                target = 'contact';
            } else if (text.toLowerCase().includes('gallery')) {
                target = 'gallery';
            } else if (text.toLowerCase().includes('service')) {
                target = 'services';
            }
            
            return `<button${attrs} onClick={() => document.getElementById('${target}')?.scrollIntoView({ behavior: 'smooth' })}>\n              ${text}\n            </button>`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Fixed button in', filepath);
        modified++;
    }
});
console.log('Total fixed:', modified);
