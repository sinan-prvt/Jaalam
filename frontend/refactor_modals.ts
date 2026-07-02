import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
        else if (f.endsWith('Theme.tsx')) callback(dirPath);
    });
}

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // 1. Add ProductModal import
    if (!content.includes('ProductModal')) {
        content = content.replace(/import React[^;]*;/, (match) => {
            return `${match}\nimport ProductModal from '../../shared/ProductModal';`;
        });
    }

    // 2. Add useState if needed
    if (!content.includes('useState')) {
        content = content.replace(/import React from 'react';/, "import React, { useState } from 'react';");
    }

    // 3. Add state hook
    if (!content.includes('setSelectedProduct')) {
        content = content.replace(/export default function[^{]+\{\n/, (match) => {
            return `${match}  const [selectedProduct, setSelectedProduct] = useState<any>(null);\n`;
        });
    }

    // 4. Modify products.map
    // We want to find the first tag inside products.map and add onClick & cursor-pointer
    let mapRegex = /products\.map\(\(p.*?\).*?=>\s*\(\s*(<[a-zA-Z]+[^>]*)/;
    let match = content.match(mapRegex);
    if (match) {
        let tag = match[1];
        if (!tag.includes('onClick={() => setSelectedProduct(p)}')) {
            let newTag = tag;
            if (newTag.includes('className="')) {
                newTag = newTag.replace('className="', 'onClick={() => setSelectedProduct(p)} className="cursor-pointer ');
            } else {
                newTag = newTag.replace('>', ' onClick={() => setSelectedProduct(p)} className="cursor-pointer">');
            }
            content = content.replace(tag, newTag);
        }
    }

    // 5. Remove Add buttons inside products section
    // We will find the products section and remove <button>Add</button> or similar.
    let productsSectionRegex = /(<section[^>]*id="offers"[^>]*>[\s\S]*?<\/section>)/;
    let prodMatch = content.match(productsSectionRegex);
    if (!prodMatch) {
        productsSectionRegex = /(<section[^>]*id="menu"[^>]*>[\s\S]*?<\/section>)/;
        prodMatch = content.match(productsSectionRegex);
    }
    
    if (prodMatch) {
        let prodContent = prodMatch[1];
        // Remove buttons that say Add, Order, Buy
        let newProdContent = prodContent.replace(/<button[^>]*>\s*(Add|Order|Buy|Add to Cart|Add to cart|Buy Now)\s*<\/button>/g, '');
        
        // Also remove wrapping divs if they only contain the button and price (some themes group price and button)
        // This is tricky, let's just remove the button for now.
        content = content.replace(prodContent, newProdContent);
    }

    // 6. Remove existing hardcoded modals
    // A hardcoded modal is typically a div with "fixed inset-0"
    // Since regex matching nested divs is hard, we can look for the start of the hardcoded modal 
    // and try to strip it, but it's risky. 
    // Wait, let's just use string replacement for the most common modal start.
    // If we can't remove it perfectly, we just append the new one and hide the old one.
    // Actually, if we just find `<div className="fixed inset-0 z-[100] flex` or similar, we can remove everything from there to the end before the final `</div>`.
    
    // Let's replace any existing hardcoded modal that uses setSelectedProduct(null) with empty string if we can.
    // We can use a simple brace matching function.
    let fixedIdx = content.indexOf('className="fixed inset-0');
    if (fixedIdx !== -1 && content.indexOf('setSelectedProduct(null)', fixedIdx) !== -1) {
        // Find the <div that starts this
        let startIdx = content.lastIndexOf('<div', fixedIdx);
        // Find matching closing div
        let open = 0;
        let endIdx = -1;
        for (let i = startIdx; i < content.length; i++) {
            if (content.substring(i, i + 4) === '<div') open++;
            if (content.substring(i, i + 5) === '</div') {
                open--;
                if (open === 0) {
                    endIdx = i + 6; // include closing >
                    break;
                }
            }
        }
        if (endIdx !== -1) {
            content = content.substring(0, startIdx) + content.substring(endIdx);
        }
    }

    // 7. Append ProductModal
    if (!content.includes('<ProductModal')) {
        // Append before the last </div>
        let lastDiv = content.lastIndexOf('</div>');
        if (lastDiv !== -1) {
            content = content.substring(0, lastDiv) + 
                `\n      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />\n    ` + 
                content.substring(lastDiv);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filepath, content);
        console.log('Processed', filepath);
    }
}

let modified = 0;
walkDir('src/components/themes', (filepath) => {
    processFile(filepath);
    modified++;
});
console.log('Done processing themes.');
