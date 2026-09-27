import os

filepath = 'd:/WebBuilder/frontend/src/components/shared/Chatbot.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('USR>', 'USR&gt;')
content = content.replace('SYS>', 'SYS&gt;')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed JSX parse errors in Chatbot.tsx")
