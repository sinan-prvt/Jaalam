const fs = require('fs');

const glob = require('glob');

const files = glob.sync('src/components/themes/**/*.tsx', { cwd: 'd:/WebBuilder/frontend' });

files.forEach(relPath => {
  const file = 'd:/WebBuilder/frontend/' + relPath;
  let content = fs.readFileSync(file, 'utf-8');
  const orig = content;
  
  const fields = ['contact_address', 'contact_phone', 'contact_email'];
  
  fields.forEach(field => {
    // 1. find `{!hiddenFields.includes('field') && (`
    // 2. move it outside the parent flex container
    
    // Simplest regex for this exact layout:
    // <div className="flex items-center gap-5"> ... {!hiddenFields.includes('contact_phone') && ( <p ...>...</p> )} </div> <div className={`w-full h-px ...`}></div>
    
    // We will match: <div className="flex items-center gap-[0-9]+"> ... {!hiddenFields.includes('field') && ( ... )} </div> <div className={`w-full h-px...`}></div>
    
    const regex = new RegExp(
      '<div className="flex items-center gap-[^"]+">[\\s\\S]*?{!hiddenFields\\.includes\\(\\'' + field + '\\'\\) && \\([\\s\\S]*?\\)}[\\s\\S]*?</div>\\s*<div className={`w-full h-px[^>]+></div>', 
      'g'
    );
    
    content = content.replace(regex, (match) => {
        // extract the inner condition
        const innerRegex = new RegExp(`{!hiddenFields\\.includes\\('${field}'\\) && \\(([\\s\\S]*?)\\)}`);
        const innerMatch = match.match(innerRegex);
        if (innerMatch) {
            const blockWithoutCond = match.replace(innerMatch[0], innerMatch[1]);
            return `{!hiddenFields.includes('${field}') && (\n  <>\n${blockWithoutCond}\n  </>\n)}`;
        }
        return match;
    });
  });

  if (orig !== content) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
