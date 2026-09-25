const fs = require('fs');
const glob = require('glob');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'components', 'themes');

glob('**/*.tsx', { cwd: srcDir, absolute: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  let totalReplaced = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    // We want to replace blocks for contact_address, contact_phone, contact_email
    // that look roughly like:
    // <div className="flex items-center gap-something...">
    //   ...
    //   {!hiddenFields.includes('contact_xyz') && ( ... )}
    //   ...
    // </div>
    // \n
    // <div className={`w-full h-px...`}></div>

    // Since regex for nested divs is hard, we can be more specific:
    // Look for <div className="flex items-center gap-5"> (or similar) followed by some icon, then contact_phone check, up to the end of the div.
    
    // Instead of regex, let's write a simple state machine or simpler replace:
    // We can replace the specific pattern in the file by looking for `{!hiddenFields.includes('contact_address') && (` etc.
    // and moving it up to wrap the parent div and the following divider.

    const contactFields = ['contact_address', 'contact_phone', 'contact_email'];

    contactFields.forEach(field => {
      // Find the index of {!hiddenFields.includes('contact_something') && (
      const regex = new RegExp(`{!hiddenFields\\.includes\\('${field}'\\) && \\([\\s\\S]*?\\)}`, 'g');
      
      let match;
      while ((match = regex.exec(content)) !== null) {
        const fieldStr = match[0];
        const fieldIndex = match.index;
        
        // Find the start of the surrounding div. It usually starts with `<div className="flex items-center `
        const beforeContent = content.substring(0, fieldIndex);
        const divStartMatch = beforeContent.match(/<div className="flex items-center[^>]*>[\s\S]*?$/);
        
        if (divStartMatch) {
          const divStartIndex = beforeContent.length - divStartMatch[0].length;
          
          // Find the end of this div block. It ends with a closing div.
          // Since the inner block has an icon and a text div, we need to balance divs.
          let balance = 0;
          let i = divStartIndex;
          let inCondition = false;
          let endOfDivIndex = -1;
          
          while (i < content.length) {
            if (content.substring(i, i+4) === '<div') {
              balance++;
            } else if (content.substring(i, i+5) === '</div') {
              balance--;
              if (balance === 0) {
                endOfDivIndex = i + 6; // length of </div>
                break;
              }
            }
            i++;
          }
          
          if (endOfDivIndex !== -1) {
            // Check if there is a divider right after
            const afterDiv = content.substring(endOfDivIndex);
            const dividerMatch = afterDiv.match(/^\s*<div className={`w-full h-px[^>]*><\/div>/);
            
            let endOfBlock = endOfDivIndex;
            if (dividerMatch) {
              endOfBlock += dividerMatch[0].length;
            }
            
            // Extract the whole block
            const blockContent = content.substring(divStartIndex, endOfBlock);
            
            // Reconstruct block without the inner conditional
            // We just remove `{!hiddenFields.includes('contact_xxx') && (` and the closing `)}`
            const innerStrStart = `{!hiddenFields.includes('${field}') && (`
            const innerRegex = new RegExp(`{!hiddenFields\\.includes\\('${field}'\\) && \\(\\s*([\\s\\S]*?)\\s*\\)}`);
            const innerMatch = blockContent.match(innerRegex);
            
            if (innerMatch) {
                const innerContent = innerMatch[1];
                const blockWithoutCondition = blockContent.replace(innerRegex, innerContent);
                
                const newBlock = `{!hiddenFields.includes('${field}') && (\n  <>\n${blockWithoutCondition}\n  </>\n)}`;
                
                content = content.substring(0, divStartIndex) + newBlock + content.substring(endOfBlock);
                
                // Adjust regex index to continue properly
                regex.lastIndex = divStartIndex + newBlock.length;
            }
          }
        }
      }
    });

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`Updated ${file}`);
      totalReplaced++;
    }
  });

  console.log(`Finished fixing contact blocks in ${totalReplaced} files.`);
});
