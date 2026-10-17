"""Indian GST helpers: state codes, GSTIN validation and the CGST/SGST vs IGST split."""
from decimal import ROUND_HALF_UP, Decimal

# GST state codes (as printed in GSTINs and used for "place of supply").
STATES = {
    '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
    '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
    '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur',
    '15': 'Mizoram', '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
    '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
    '26': 'Dadra and Nagar Haveli and Daman and Diu', '27': 'Maharashtra', '29': 'Karnataka',
    '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu', '34': 'Puducherry',
    '35': 'Andaman and Nicobar Islands', '36': 'Telangana', '37': 'Andhra Pradesh', '38': 'Ladakh',
    '97': 'Other Territory',
}

GST_RATES = (0, 5, 12, 18, 28)
_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'


def gstin_error(gstin):
    """None if the GSTIN is valid, else a message. Checks format, state code and check digit."""
    g = (gstin or '').strip().upper()
    if len(g) != 15 or any(c not in _CHARS for c in g):
        return 'A GSTIN has 15 letters and digits, e.g. 27AAPFU0939F1ZV.'
    if g[:2] not in STATES:
        return 'The GSTIN starts with an unknown state code.'
    if not (g[2:7].isalpha() and g[7:11].isdigit() and g[11].isalpha() and g[13] == 'Z'):
        return 'This does not look like a valid GSTIN (it contains the PAN, e.g. 27AAPFU0939F1ZV).'
    total = 0
    for i, c in enumerate(g[:14]):
        product = _CHARS.index(c) * (2 if i % 2 else 1)
        total += product // 36 + product % 36
    if _CHARS[(36 - total % 36) % 36] != g[14]:
        return 'The GSTIN check digit is wrong; please check for a typo.'
    return None


def money(value):
    return Decimal(value).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def split_tax(tax, seller_state, place_of_supply):
    """Same state (intra-state supply) -> CGST + SGST halves; otherwise IGST.

    Returns (tax_type, cgst, sgst, igst). Without a seller state we can't tell, so the
    whole amount is reported as IGST-style single tax ("GST").
    """
    tax = money(tax)
    if seller_state and place_of_supply and seller_state == place_of_supply:
        cgst = money(tax / 2)
        return 'INTRA', cgst, tax - cgst, Decimal('0.00')
    if seller_state and place_of_supply:
        return 'INTER', Decimal('0.00'), Decimal('0.00'), tax
    return '', Decimal('0.00'), Decimal('0.00'), Decimal('0.00')


def financial_year(day):
    """Indian financial year label for a date, e.g. 2026-27 for 17 Oct 2026."""
    start = day.year if day.month >= 4 else day.year - 1
    return f'{start}-{str(start + 1)[2:]}'
