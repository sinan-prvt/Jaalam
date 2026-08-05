import os

THEMES_DIR = r"c:\Users\ADMIN\Desktop\WebBuilder\frontend\src\components\themes"

for root, dirs, files in os.walk(THEMES_DIR):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if "import ContactForm from '../../shared/ContactForm';" in content:
                content = content.replace("import ContactForm from '../../shared/ContactForm';", "import ContactForm from '../shared/ContactForm';")
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed {file}")
