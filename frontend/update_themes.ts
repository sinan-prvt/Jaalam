import { Project, SyntaxKind, ts } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const project = new Project();
project.addSourceFilesAtPaths("src/components/themes/**/*.tsx");

const fieldMappings = {
  'content.hero_title': 'hero_title',
  'content.settings_json?.hero_title': 'hero_title',
  'content.hero_description': 'hero_description',
  'content.hero_text': 'hero_description',
  'content.settings_json?.hero_description': 'hero_description',
  'content.settings_json?.about_title': 'about_title',
  'content.about_title': 'about_title',
  'content.settings_json?.about_description': 'about_description',
  'content.about_text': 'about_description',
  'content.contact_info?.phone': 'contact_phone',
  'content.contact_info?.email': 'contact_email',
  'content.contact_info?.address': 'contact_address',
  'content.contact_info?.hours': 'contact_hours',
  'content.contact_info?.facebook': 'contact_facebook',
  'content.contact_info?.whatsapp': 'contact_whatsapp',
  'content.contact_info?.instagram': 'contact_instagram',
};

// We want to find JsxExpressions that evaluate these fields.
// For example: {content.hero_title || 'Fallback'}
// And wrap the parent JsxElement (e.g. <h1>...</h1>) with our condition.

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
  const jsxExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.JsxExpression);
  
  for (const expr of jsxExpressions) {
    const text = expr.getText();
    // Check if it's already wrapped or handled
    if (expr.getParentIfKind(SyntaxKind.JsxElement)?.getParentIfKind(SyntaxKind.JsxExpression)?.getText().includes('hiddenFields.includes')) {
      continue; // already wrapped
    }
    
    let matchedField = null;
    for (const [codeMatch, fieldKey] of Object.entries(fieldMappings)) {
      if (text.includes(codeMatch)) {
        matchedField = fieldKey;
        break;
      }
    }

    if (matchedField) {
      // Find the closest HTML tag (JsxElement or JsxSelfClosingElement) that contains this expression
      const parentElement = expr.getFirstAncestor(
        node => node.isKind(SyntaxKind.JsxElement) || node.isKind(SyntaxKind.JsxSelfClosingElement)
      );

      // Only wrap if it's a structural tag, not a fragment, and it's not already wrapped conditionally
      if (parentElement && !parentElement.getParentIfKind(SyntaxKind.JsxExpression)?.getText().includes(matchedField)) {
        
        // Ensure we don't double wrap or wrap the main container
        const parentText = parentElement.getText();
        if (parentText.includes('hiddenFields.includes')) continue;

        try {
          parentElement.replaceWithText(`{!hiddenFields.includes('${matchedField}') && (\n${parentText}\n)}`);
          changed = true;
        } catch (e) {
          console.error(`Failed to replace in ${sourceFile.getBaseName()}:`, e);
        }
      }
    }
  }

  if (changed) {
    sourceFile.saveSync();
    console.log(`Updated ${sourceFile.getBaseName()}`);
  }
}
