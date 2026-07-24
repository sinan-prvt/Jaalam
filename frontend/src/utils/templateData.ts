export const categoryThemes: Record<string, string[]> = {
  'Restaurant': ['Fine Dining', 'Casual Eats', 'Bistro', 'Modern', 'Classic', 'Minimal', 'Rustic'],
  'Cafe / Bakery': ['Cozy Cafe', 'Modern Bakery', 'Artisan', 'Minimal', 'Playful', 'Boutique', 'Vintage'],
  'Salon / Spa': ['Glamour Beauty', 'Modern Saloon', 'Vintage Barber', 'Royal Saloon', 'Minimal', 'Luxury', 'Classic'],
  'Gym / Fitness': ['Hardcore Iron', 'Zen Yoga Studio', 'CrossFit Box', 'Luxury Health Club', 'Combat & MMA Gym', 'Modern', 'Minimal'],
  'Retail Store': ['Boutique', 'Minimal', 'Luxury', 'Playful', 'Classic', 'Noir', 'Pop', 'Modern'],
  'Chicken / Meat Stall': ['Classic', 'Premium', 'Minimal', 'Rustic', 'Playful', 'Modern'],
  'Scrap Dealer': ['Classic', 'Minimal', 'Corporate', 'Eco', 'Playful', 'Modern'],
  'Textiles / Garments': ['Boutique', 'Minimal', 'Luxury', 'Vintage', 'Playful', 'Modern'],
  'Consulting': ['Corporate', 'Creative Agency', 'Tech Startup', 'Management', 'Minimal', 'Legal Firm'],
  'Other': ['Modern', 'Classic', 'Minimal', 'Noir', 'Playful', 'Luxury', 'Pop', 'Eco']
};

export const defaults: Record<string, string> = {
  'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  'Cafe / Bakery': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  'Salon': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
  'Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'Retail Store': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  'Chicken / Meat Stall': 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
  'Scrap Dealer': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  'Textiles / Garments': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
  'Consulting': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'Other': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
};

export const getThemeThumbnail = (theme: string, businessType?: string) => {
  if (businessType === 'Restaurant') {
    if (theme === 'Fine Dining') return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Casual Eats') return 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Bistro') return 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Rustic') return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Cafe / Bakery') {
    if (theme === 'Cozy Cafe') return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern Bakery') return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Artisan') return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Vintage') return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Salon / Spa' || businessType === 'Salon' || businessType === 'Saloon') {
    if (theme === 'Glamour Beauty') return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern Saloon') return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Vintage Barber') return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Royal Saloon') return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Luxury') return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Gym / Fitness' || businessType === 'Gym') {
    if (theme === 'Hardcore Iron') return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Zen Yoga Studio') return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'CrossFit Box') return 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Luxury Health Club') return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Combat & MMA Gym') return 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Retail Store') {
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
