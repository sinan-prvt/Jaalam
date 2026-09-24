import { Project, SyntaxKind } from 'ts-morph';
import fs from 'fs';
import path from 'path';

const project = new Project();
project.addSourceFilesAtPaths("src/components/themes/**/*.tsx");

const fieldMappings = {
  'content.contact_info?.phone': 'contact_phone',
  'content.contact_info?.email': 'contact_email',
  'content.contact_info?.address': 'contact_address',
  'content.contact_info?.hours': 'contact_hours',
  'content.contact_info?.facebook': 'contact_facebook',
  'content.contact_info?.whatsapp': 'contact_whatsapp',
  'content.contact_info?.instagram': 'contact_instagram'
};

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;

  // 1. Inject hiddenFields declaration if not exists
  const func = sourceFile.getDefaultExportSymbol()?.getValueDeclaration();
  if (func && func.isKind(SyntaxKind.FunctionDeclaration)) {
    const body = func.getBody();
    if (body && body.isKind(SyntaxKind.Block)) {
      const text = body.getText();
      if (!text.includes("hiddenFields = ")) {
        body.insertStatements(0, "const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];");
        changed = true;
      }
    }
  }

  // 2. Find elements containing these fields and wrap them
  // 2. Find elements containing these fields and wrap them
  let keepLooking = true;
  while (keepLooking) {
    keepLooking = false;
    const jsxExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.JsxExpression);
    
    for (const expr of jsxExpressions) {
      if (expr.wasForgotten()) continue;
      
      const text = expr.getText();
      let matchedField = null;
      for (const [codeMatch, fieldKey] of Object.entries(fieldMappings)) {
        if (text.includes(codeMatch)) {
          matchedField = fieldKey;
          break;
        }
      }

      if (matchedField) {
        const parentElement = expr.getFirstAncestor(
          node => node.isKind(SyntaxKind.JsxElement) || node.isKind(SyntaxKind.JsxSelfClosingElement)
        );

        if (parentElement && !parentElement.wasForgotten()) {
          const parentText = parentElement.getText();
          if (parentText.includes('hiddenFields.includes')) continue;
          
          const isWrapped = parentElement.getAncestors().some(node => {
            if (node.isKind(SyntaxKind.JsxExpression)) {
              const text = node.getText();
              if (text.startsWith(`{!hiddenFields.includes('${matchedField}')`)) {
                return true;
              }
            }
            return false;
          });
          if (isWrapped) continue;

          try {
            parentElement.replaceWithText(`{!hiddenFields.includes('${matchedField}') && (\n${parentText}\n)}`);
            changed = true;
            keepLooking = true; 
            break; 
          } catch (e) {
            console.error(`Failed to replace in ${sourceFile.getBaseName()}:`, e);
          }
        }
      }
    }
  }

  if (changed) {
    sourceFile.saveSync();
    console.log(`Updated ${sourceFile.getBaseName()}`);
  }
}
