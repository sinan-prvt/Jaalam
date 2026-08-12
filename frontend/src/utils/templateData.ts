export const categoryThemes: Record<string, string[]> = {
    'Restaurant': ['Fine Dining', 'Casual Eats', 'Bistro', 'Custom'],
    'Cafe / Bakery': ['Cozy Cafe', 'Modern Bakery', 'Artisan', 'Custom'],
    'Salon / Spa': ['Classic Barbershop', 'Modern Saloon', 'Vintage Barber', 'Royal Saloon', 'Glamour Beauty'],
    'Gym / Fitness': ['Hardcore Iron', 'Zen Yoga Studio', 'CrossFit Box', 'Luxury Health Club', 'Combat & MMA Gym'],
    'Retail Store': ['Boutique', 'Minimalist', 'Streetwear', 'Custom'],
    'Stationery / Books': ['Modern', 'Classic', 'Playful', 'Minimal', 'Ethereal'],
    'Fancy Store': ['Modern', 'Boutique', 'Minimal', 'Luxury', 'Playful', 'Classic'],
    'Chicken / Meat Stall': ['Modern', 'Classic', 'Premium', 'Minimal'],
    'Scrap Dealer': ['Modern', 'Classic', 'Minimal', 'Corporate', 'Eco', 'Playful'],
    'Supermarket / Grocery': ['Modern', 'Classic', 'Premium', 'Minimal', 'Organic', 'Playful'],
    'Real Estate': ['Luxury Villas', 'Urban Apartments', 'Commercial', 'Modern', 'Minimal', 'Classic'],
    'Consulting': ['Corporate', 'Creative Agency', 'Tech Startup', 'Management', 'Minimal', 'Legal Firm'],
    'Wedding Invitation': ['Classic', 'Modern', 'Floral', 'Minimal', 'Islamic', 'South Indian', 'Kerala Traditional', 'Punjabi', 'Bengali', 'Christian', 'Engagement'],
    'Other': ['Modern', 'Classic', 'Minimal', 'Noir', 'Pop', 'Corporate']
  };

export const getThemeThumbnail = (theme: string, businessType?: string) => {
  // Generic mapping by business type to provide fallback defaults
  const defaults: Record<string, string> = {
    'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'Cafe / Bakery': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'Salon': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    'Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    'Retail Store': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    'Stationery / Books': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'Fancy Store': 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80',
    'Chicken / Meat Stall': 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    'Scrap Dealer': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'Supermarket / Grocery': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    'Textiles / Garments': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    'Consulting': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    'Wedding Invitation': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'Other': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
  };

  // Unique theme mappings
  if (businessType === 'Real Estate') {
    if (theme === 'Luxury Villas') return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Urban Apartments') return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Commercial') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Supermarket / Grocery') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Premium') return 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Organic') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1560159813-f66d40510006?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Noir') return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80&grayscale';
    if (theme === 'Pop') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sat=200';
  }

  if (businessType === 'Retail Store') {
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimalist') return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Streetwear') return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Tech Gadget') return 'https://images.unsplash.com/photo-1531297172864-45d1b11e2fb9?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Organic Store') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Stationery / Books') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Ethereal') return 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Fancy Store') {
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Luxury') return 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Noir') return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Pop') return 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Chicken / Meat Stall') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Premium') return 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Rustic') return 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Scrap Dealer') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Corporate') return 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Eco') return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80&sat=-100';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Textiles / Garments') {
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Luxury') return 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Vintage') return 'https://images.unsplash.com/photo-1528255915607-9012fda0f838?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Consulting') {
    if (theme === 'Corporate') return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Creative Agency') return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Tech Startup') return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Management') return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Legal Firm') return 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Wedding Invitation') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Floral') return 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Islamic') return 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80';
    if (theme === 'South Indian') return 'https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Kerala Traditional') return 'https://images.unsplash.com/photo-1629813589433-2ba920ee9b5e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Punjabi') return 'https://images.unsplash.com/photo-1579227114347-15d08fc37cae?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Bengali') return 'https://images.unsplash.com/photo-1601296200639-89349ce767cb?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Christian') return 'https://images.unsplash.com/photo-1532712938730-4e36c457b9c7?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Engagement') return 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Other') {
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Noir') return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Pop') return 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Corporate') return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
  }

  // Fallback to legacy switch if not covered by specific category logic
  switch (theme) {
    case 'Fine Dining': return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80';
    case 'Casual Eats': return 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80';
    case 'Bistro': return 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80';
    case 'Cozy Cafe': return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
    case 'Modern Bakery': return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
    case 'Artisan': return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80';
    case 'Classic Barbershop': return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
    case 'Modern Saloon': return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80';
    case 'Vintage Barber': return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
    case 'Royal Saloon': return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
    case 'Glamour Beauty': return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80';
    case 'Hardcore Iron': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
    case 'Zen Yoga Studio': return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
    case 'CrossFit Box': return 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80';
    case 'Luxury Health Club': return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80';
    case 'Combat & MMA Gym': return 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80';
  }

  // Fallback to category default
  if (businessType && defaults[businessType]) {
    return defaults[businessType];
  }

  // Final fallback
  if (businessType?.includes('Salon') || businessType?.includes('Saloon')) return defaults['Salon'];
  if (businessType?.includes('Gym')) return defaults['Gym'];
  return 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80';
};
