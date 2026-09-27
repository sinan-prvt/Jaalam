import sys
import re

def strip_strings(text):
    text = re.sub(r'"([^"\\]*(\\.[^"\\]*)*)"', '""', text)
    text = re.sub(r"'([^'\\]*(\\.[^'\\]*)*)'", "''", text)
    text = re.sub(r'`([^`\\]*(\\.[^`\\]*)*)`', '``', text)
    return text

def check_balance(text):
    stack = []
    lines = text.split('\n')
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in '{[(': 
                stack.append((char, i+1, j+1))
            elif char in ')]}':
                if not stack:
                    print(f'Unmatched closing {char} at line {i+1}:{j+1}')
                    return
                top, r, c = stack.pop()
                pairs = {'}':'{', ']':'[', ')':'('}
                if pairs[char] != top:
                    print(f'Mismatched closing {char} at line {i+1}:{j+1} (matches {top} from {r}:{c})')
                    return
    if stack:
        for char, r, c in stack:
            print(f'Unclosed {char} from line {r}:{c}')
        return
    print('All braces matched!')

with open('d:/WebBuilder/frontend/src/components/shared/Chatbot.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# removing string literals for checking
text = strip_strings(text)
check_balance(text)
