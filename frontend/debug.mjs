import { Project, SyntaxKind } from 'ts-morph';

const project = new Project();
const sourceFile = project.addSourceFileAtPath("src/components/themes/restaurant/RestaurantTheme.tsx");

const fieldMappings = {
  'content.contact_info?.address': 'contact_address',
};

const jsxExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.JsxExpression);
for (const expr of jsxExpressions) {
  const text = expr.getText();
  if (text.includes('content.contact_info?.address')) {
    console.log('Found JsxExpression:', text);
    const parentElement = expr.getFirstAncestor(
      node => node.isKind(SyntaxKind.JsxElement) || node.isKind(SyntaxKind.JsxSelfClosingElement)
    );
    if (parentElement) {
      console.log('Found Parent Element:', parentElement.getKindName(), 'Text:', parentElement.getText().substring(0, 50));
      const isWrapped = parentElement.getAncestors().some(node => {
        if (node.isKind(SyntaxKind.JsxExpression)) {
            console.log("Checking ancestor JsxExpression text:", node.getText().substring(0, 100));
            if (node.getText().includes('hiddenFields.includes')) {
                console.log("-> MATCHES hiddenFields.includes!");
                return true;
            }
        }
        return false;
      });
      console.log('isWrapped:', isWrapped);
    }
  }
}
