/**
 * Per-category content for the motion theme family (Cinematic, Aurora, Editorial,
 * Neon Pulse, Luxe Motion). Each layout reads its copy, imagery and accent colours
 * from here, so one layout looks native to every business type. Owner content
 * (hero title, products, gallery...) always takes precedence over these defaults.
 */
export interface MotionItem { name: string; price?: string; description?: string; image?: string }
export interface MotionService { title: string; description: string }

export interface MotionPreset {
  /** Short noun for the business, used in eyebrows ("Restaurant", "Studio"...). */
  label: string;
  heroTitle: string;
  heroText: string;
  aboutTitle: string;
  aboutText: string;
  /** Heading for the products/menu/listings section. */
  itemsTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  services: MotionService[];
  items: MotionItem[];
  /** Hero slideshow images (also the video poster). */
  hero: string[];
  gallery: string[];
  stats: { value: string; label: string }[];
  /** Words for the scrolling marquee strip. */
  marquee: string[];
  /** Main and secondary accent colours (hex). */
  accent: string;
  accent2: string;
}

export const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const MOTION_PRESETS: Record<string, MotionPreset> = {
  'Restaurant': {
    label: 'Restaurant',
    heroTitle: 'Flavours worth slowing down for',
    heroText: 'Seasonal ingredients, open-flame cooking and a table that always feels like home.',
    aboutTitle: 'Cooked with heart, served with care',
    aboutText: 'Our kitchen brings together local produce and time-honoured recipes. Every plate is made to order, every guest is welcomed like family, and every evening is an occasion.',
    itemsTitle: 'Signature Menu',
    ctaPrimary: 'Reserve a Table',
    ctaSecondary: 'View Menu',
    services: [
      { title: 'Dine-In', description: 'Warm interiors, attentive service and a menu that changes with the seasons.' },
      { title: 'Private Dining', description: 'Birthdays, anniversaries and team dinners in our private room.' },
      { title: 'Catering', description: 'Our signature dishes, delivered and plated at your event.' },
    ],
    items: [
      { name: 'Truffle Mushroom Risotto', price: '₹680', description: 'Arborio rice, wild mushrooms, parmesan and truffle oil.', image: u('photo-1546069901-ba9599a7e63c', 800) },
      { name: 'Wood-Fired Chicken', price: '₹540', description: 'Herb-marinated, charred and served with garlic mash.', image: u('photo-1555939594-58d7cb561ad1', 800) },
      { name: 'Garden Bowl', price: '₹420', description: 'Roasted vegetables, grains, greens and tahini dressing.', image: u('photo-1512621776951-a57141f2eefd', 800) },
      { name: 'Chef’s Tasting Platter', price: '₹1,200', description: 'A rotating selection of the kitchen’s favourites.', image: u('photo-1414235077428-338989a2e8c0', 800) },
    ],
    hero: [u('photo-1514933651103-005eec06c04b', 1920), u('photo-1414235077428-338989a2e8c0', 1920), u('photo-1550966871-3ed3cdb5ed0c', 1920)],
    gallery: [u('photo-1544148103-0773bf10d330', 900), u('photo-1546069901-ba9599a7e63c', 900), u('photo-1550966871-3ed3cdb5ed0c', 900), u('photo-1555939594-58d7cb561ad1', 900), u('photo-1512621776951-a57141f2eefd', 900), u('photo-1414235077428-338989a2e8c0', 900)],
    stats: [{ value: '12+', label: 'Years serving' }, { value: '4.8★', label: 'Guest rating' }, { value: '60+', label: 'Dishes' }],
    marquee: ['Fresh daily', 'Open flame', 'Local produce', 'Family recipes', 'Book ahead'],
    accent: '#F59E0B', accent2: '#EF4444',
  },
  'Cafe / Bakery': {
    label: 'Café & Bakery',
    heroTitle: 'Freshly baked. Slowly brewed.',
    heroText: 'Morning pastries out of the oven, single-origin coffee and a corner seat that’s always waiting for you.',
    aboutTitle: 'Our little bakery story',
    aboutText: 'We bake everything in-house from scratch every morning, using real butter, slow-fermented dough and beans roasted by people we know by name.',
    itemsTitle: 'From the Counter',
    ctaPrimary: 'Order Now',
    ctaSecondary: 'See the Menu',
    services: [
      { title: 'Daily Bakes', description: 'Croissants, breads and cakes baked fresh every single morning.' },
      { title: 'Custom Cakes', description: 'Birthday and celebration cakes designed around your story.' },
      { title: 'Coffee Bar', description: 'Espresso, pour-overs and seasonal specials by our baristas.' },
    ],
    items: [
      { name: 'Butter Croissant', price: '₹140', description: 'Flaky, golden and laminated over three days.', image: u('photo-1555507036-ab1f4038808a', 800) },
      { name: 'Cappuccino', price: '₹180', description: 'Double shot, silky milk, perfect foam.', image: u('photo-1509042239860-f550ce710b93', 800) },
      { name: 'Sourdough Loaf', price: '₹260', description: '36-hour fermented country loaf.', image: u('photo-1509440159596-0249088772ff', 800) },
      { name: 'Chocolate Truffle Cake', price: '₹650', description: 'Dark chocolate ganache, half kilo.', image: u('photo-1578985545062-69928b1d9587', 800) },
    ],
    hero: [u('photo-1554118811-1e0d58224f24', 1920), u('photo-1509042239860-f550ce710b93', 1920), u('photo-1509440159596-0249088772ff', 1920)],
    gallery: [u('photo-1554118811-1e0d58224f24', 900), u('photo-1555507036-ab1f4038808a', 900), u('photo-1509042239860-f550ce710b93', 900), u('photo-1509440159596-0249088772ff', 900), u('photo-1578985545062-69928b1d9587', 900), u('photo-1495474472287-4d71bcdd2085', 900)],
    stats: [{ value: '5am', label: 'Ovens on' }, { value: '30+', label: 'Daily bakes' }, { value: '4.9★', label: 'Loved locally' }],
    marquee: ['Baked fresh', 'Single origin', 'Real butter', 'Custom cakes', 'Since sunrise'],
    accent: '#D97706', accent2: '#B45309',
  },
  'Salon / Spa': {
    label: 'Salon & Spa',
    heroTitle: 'Look good. Feel even better.',
    heroText: 'Precision cuts, colour, skin and spa rituals from stylists who listen first.',
    aboutTitle: 'A calm space for your best self',
    aboutText: 'Our team of senior stylists and therapists blends technique with care. We use premium, skin-friendly products and take the time to get it right for you.',
    itemsTitle: 'Treatments & Prices',
    ctaPrimary: 'Book Appointment',
    ctaSecondary: 'Our Services',
    services: [
      { title: 'Hair Studio', description: 'Cuts, styling, colour, keratin and bridal hair.' },
      { title: 'Skin & Facials', description: 'Clean-up, hydra facials and glow treatments.' },
      { title: 'Spa Rituals', description: 'Massages and body treatments to fully unwind.' },
    ],
    items: [
      { name: 'Signature Haircut', price: '₹600', description: 'Consultation, wash, cut and blow-dry.', image: u('photo-1560066984-138dadb4c035', 800) },
      { name: 'Global Colour', price: '₹2,800', description: 'Ammonia-free colour with gloss finish.', image: u('photo-1522337360788-8b13dee7a37e', 800) },
      { name: 'Hydra Facial', price: '₹2,200', description: 'Deep cleanse, exfoliate and hydrate.', image: u('photo-1570172619644-dfd03ed5d881', 800) },
      { name: 'Classic Beard Trim', price: '₹300', description: 'Hot towel, shape and finish.', image: u('photo-1503951914875-452162b0f3f1', 800) },
    ],
    hero: [u('photo-1560066984-138dadb4c035', 1920), u('photo-1522337360788-8b13dee7a37e', 1920), u('photo-1585747860715-2ba37e788b70', 1920)],
    gallery: [u('photo-1560066984-138dadb4c035', 900), u('photo-1522337360788-8b13dee7a37e', 900), u('photo-1570172619644-dfd03ed5d881', 900), u('photo-1503951914875-452162b0f3f1', 900), u('photo-1585747860715-2ba37e788b70', 900), u('photo-1599351431202-1e0f0137899a', 900)],
    stats: [{ value: '10k+', label: 'Happy clients' }, { value: '15', label: 'Expert stylists' }, { value: '4.9★', label: 'Rating' }],
    marquee: ['Hair', 'Colour', 'Skin', 'Spa', 'Bridal', 'Grooming'],
    accent: '#EC4899', accent2: '#A855F7',
  },
  'Gym / Fitness': {
    label: 'Fitness Club',
    heroTitle: 'Stronger every single day',
    heroText: 'World-class equipment, expert coaches and a community that pushes you further.',
    aboutTitle: 'Built for real results',
    aboutText: 'From your first session to your next personal best, our certified trainers build programmes around your goals and keep you accountable all the way.',
    itemsTitle: 'Memberships',
    ctaPrimary: 'Start Free Trial',
    ctaSecondary: 'View Plans',
    services: [
      { title: 'Strength Zone', description: 'Racks, platforms and free weights for serious lifting.' },
      { title: 'Group Classes', description: 'HIIT, spin, yoga and functional training every day.' },
      { title: 'Personal Training', description: 'One-on-one coaching with nutrition guidance.' },
    ],
    items: [
      { name: 'Monthly', price: '₹1,999', description: 'Full gym access and two classes a week.', image: u('photo-1534438327276-14e5300c3a48', 800) },
      { name: 'Quarterly', price: '₹4,999', description: 'Unlimited classes plus a body assessment.', image: u('photo-1571019614242-c5c5dee9f50b', 800) },
      { name: 'Annual', price: '₹15,999', description: 'Best value, includes four PT sessions.', image: u('photo-1517838277536-f5f99be501cd', 800) },
      { name: 'Personal Training', price: '₹6,000', description: '12 one-on-one sessions with a coach.', image: u('photo-1583454110551-21f2fa2afe61', 800) },
    ],
    hero: [u('photo-1534438327276-14e5300c3a48', 1920), u('photo-1571019613454-1cb2f99b2d8b', 1920), u('photo-1517838277536-f5f99be501cd', 1920)],
    gallery: [u('photo-1534438327276-14e5300c3a48', 900), u('photo-1571019614242-c5c5dee9f50b', 900), u('photo-1517838277536-f5f99be501cd', 900), u('photo-1583454110551-21f2fa2afe61', 900), u('photo-1544367567-0f2fcb009e0b', 900), u('photo-1581009146145-b5ef050c2e1e', 900)],
    stats: [{ value: '24/7', label: 'Open access' }, { value: '40+', label: 'Weekly classes' }, { value: '2k+', label: 'Members' }],
    marquee: ['No excuses', 'Lift', 'Sweat', 'Recover', 'Repeat'],
    accent: '#EF4444', accent2: '#F97316',
  },
  'Retail Store': {
    label: 'Store',
    heroTitle: 'New season. New favourites.',
    heroText: 'Curated collections, honest prices and pieces you’ll reach for again and again.',
    aboutTitle: 'Picked with an eye for detail',
    aboutText: 'Every product on our shelves is chosen for quality, design and value. Visit the store or order online, and we’ll make sure it reaches you fast.',
    itemsTitle: 'Trending Now',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'New Arrivals',
    services: [
      { title: 'Fast Delivery', description: 'Same-day delivery across the city on most orders.' },
      { title: 'Easy Returns', description: 'Changed your mind? Return within 7 days, no fuss.' },
      { title: 'Gift Wrapping', description: 'Beautifully wrapped and ready to give.' },
    ],
    items: [
      { name: 'Everyday Tote', price: '₹1,499', description: 'Canvas tote with leather handles.', image: u('photo-1620799140408-edc6dcb6d633', 800) },
      { name: 'Minimal Watch', price: '₹3,299', description: 'Stainless case, vegan leather strap.', image: u('photo-1523275335684-37898b6baf30', 800) },
      { name: 'Wireless Headphones', price: '₹4,999', description: 'Noise cancelling, 30-hour battery.', image: u('photo-1505740420928-5e560c06d30e', 800) },
      { name: 'Classic Sneakers', price: '₹2,799', description: 'Clean white leather, cushioned sole.', image: u('photo-1552374196-1ab2a1c593e8', 800) },
    ],
    hero: [u('photo-1441984904996-e0b6ba687e04', 1920), u('photo-1555041469-a586c61ea9bc', 1920), u('photo-1529139574466-a303027c1d8b', 1920)],
    gallery: [u('photo-1441984904996-e0b6ba687e04', 900), u('photo-1555041469-a586c61ea9bc', 900), u('photo-1529139574466-a303027c1d8b', 900), u('photo-1523275335684-37898b6baf30', 900), u('photo-1505740420928-5e560c06d30e', 900), u('photo-1552374196-1ab2a1c593e8', 900)],
    stats: [{ value: '2k+', label: 'Products' }, { value: '24h', label: 'Dispatch' }, { value: '4.8★', label: 'Reviews' }],
    marquee: ['New arrivals', 'Free shipping', 'Easy returns', 'Gift ready', 'Shop local'],
    accent: '#6366F1', accent2: '#06B6D4',
  },
  'Stationery / Books': {
    label: 'Stationery & Books',
    heroTitle: 'Where good ideas get written down',
    heroText: 'Notebooks, pens, art supplies and books for students, creators and dreamers.',
    aboutTitle: 'A store for the curious',
    aboutText: 'From exam essentials to fountain pens and the latest bestsellers, we stock the tools that help you learn, create and organise your world.',
    itemsTitle: 'Desk Favourites',
    ctaPrimary: 'Shop Supplies',
    ctaSecondary: 'Browse Books',
    services: [
      { title: 'School Kits', description: 'Ready-made kits for every class and syllabus.' },
      { title: 'Printing & Binding', description: 'Prints, spiral binding and lamination while you wait.' },
      { title: 'Book Orders', description: 'Can’t find a title? We’ll source it for you.' },
    ],
    items: [
      { name: 'Dotted Journal A5', price: '₹450', description: '160 pages, 120gsm paper, lay-flat binding.', image: u('photo-1544816155-12df9643f363', 800) },
      { name: 'Fountain Pen', price: '₹1,250', description: 'Steel nib, smooth ink flow, gift box.', image: u('photo-1585336261022-680e2a5c0b11', 800) },
      { name: 'Watercolour Set', price: '₹890', description: '24 artist-grade pans with brush.', image: u('photo-1513364776144-60967b0f800f', 800) },
      { name: 'Desk Organiser', price: '₹699', description: 'Bamboo organiser for pens and notes.', image: u('photo-1510172951991-856a654063f9', 800) },
    ],
    hero: [u('photo-1456735190827-d1262f71b8a3', 1920), u('photo-1544816155-12df9643f363', 1920), u('photo-1455390582262-044cdead27d8', 1920)],
    gallery: [u('photo-1456735190827-d1262f71b8a3', 900), u('photo-1544816155-12df9643f363', 900), u('photo-1585336261022-680e2a5c0b11', 900), u('photo-1513364776144-60967b0f800f', 900), u('photo-1455390582262-044cdead27d8', 900), u('photo-1510172951991-856a654063f9', 900)],
    stats: [{ value: '5k+', label: 'Products' }, { value: '1k+', label: 'Book titles' }, { value: '20yrs', label: 'In town' }],
    marquee: ['Write', 'Sketch', 'Plan', 'Read', 'Create'],
    accent: '#2563EB', accent2: '#F59E0B',
  },
  'Fancy Store': {
    label: 'Fancy Store',
    heroTitle: 'Little things that make you shine',
    heroText: 'Jewellery, cosmetics, accessories and gifts, handpicked for every mood and moment.',
    aboutTitle: 'Treasures for every occasion',
    aboutText: 'From everyday earrings to bridal sets and the perfect birthday gift, our shelves are filled with pretty finds at prices that make you smile.',
    itemsTitle: 'Bestsellers',
    ctaPrimary: 'Shop the Edit',
    ctaSecondary: 'Gift Ideas',
    services: [
      { title: 'Bridal Sets', description: 'Coordinated jewellery and accessories for the big day.' },
      { title: 'Gift Hampers', description: 'Custom hampers wrapped and ready to surprise.' },
      { title: 'New Every Week', description: 'Fresh trends and colours added every week.' },
    ],
    items: [
      { name: 'Kundan Earrings', price: '₹599', description: 'Gold-tone kundan drops with pearls.', image: u('photo-1535632066927-ab7c9ab60908', 800) },
      { name: 'Matte Lipstick Set', price: '₹899', description: 'Five long-wear shades.', image: u('photo-1596462502278-27bfdc403348', 800) },
      { name: 'Charm Bracelet', price: '₹449', description: 'Adjustable, tarnish-free finish.', image: u('photo-1599643478514-4a4208bd50d6', 800) },
      { name: 'Silk Scrunchie Pack', price: '₹299', description: 'Set of four pastel scrunchies.', image: u('photo-1584916201218-f4242ceb4809', 800) },
    ],
    hero: [u('photo-1511556820780-d912e42b4980', 1920), u('photo-1535632066927-ab7c9ab60908', 1920), u('photo-1596462502278-27bfdc403348', 1920)],
    gallery: [u('photo-1511556820780-d912e42b4980', 900), u('photo-1535632066927-ab7c9ab60908', 900), u('photo-1596462502278-27bfdc403348', 900), u('photo-1599643478514-4a4208bd50d6', 900), u('photo-1584916201218-f4242ceb4809', 900), u('photo-1515562141207-7a48fb3c274d', 900)],
    stats: [{ value: '3k+', label: 'Products' }, { value: '₹99', label: 'Starting at' }, { value: '4.8★', label: 'Loved' }],
    marquee: ['Jewellery', 'Cosmetics', 'Accessories', 'Gifts', 'Bridal'],
    accent: '#DB2777', accent2: '#F59E0B',
  },
  'Chicken / Meat Stall': {
    label: 'Fresh Meat',
    heroTitle: 'Fresh cuts. Cleaned. Delivered.',
    heroText: 'Farm-fresh chicken, mutton and seafood, hygienically cut the way you like it.',
    aboutTitle: 'Freshness you can trust',
    aboutText: 'We source daily from trusted farms, cut to order in a temperature-controlled facility and pack everything hygienically, so it reaches your kitchen fresh.',
    itemsTitle: 'Today’s Fresh Cuts',
    ctaPrimary: 'Order on WhatsApp',
    ctaSecondary: 'Today’s Rates',
    services: [
      { title: 'Cut to Order', description: 'Curry cut, boneless, mince — just tell us how.' },
      { title: 'Home Delivery', description: 'Packed cold and delivered within the hour nearby.' },
      { title: 'Bulk Orders', description: 'Special rates for events, hotels and caterers.' },
    ],
    items: [
      { name: 'Chicken Curry Cut', price: '₹240/kg', description: 'Skinless, cleaned and cut.', image: u('photo-1604503468506-a8da13d82791', 800) },
      { name: 'Boneless Chicken', price: '₹360/kg', description: 'Tender breast and thigh pieces.', image: u('photo-1587593810167-a84920ea0781', 800) },
      { name: 'Mutton Curry Cut', price: '₹780/kg', description: 'Fresh goat meat, bone-in.', image: u('photo-1607623814075-e51df1bdc82f', 800) },
      { name: 'Fresh Fish', price: '₹420/kg', description: 'Catch of the day, cleaned.', image: u('photo-1598514982205-f36b96d1e8d4', 800) },
    ],
    hero: [u('photo-1588168333986-5078d3ae3976', 1920), u('photo-1607623814075-e51df1bdc82f', 1920), u('photo-1604503468506-a8da13d82791', 1920)],
    gallery: [u('photo-1588168333986-5078d3ae3976', 900), u('photo-1604503468506-a8da13d82791', 900), u('photo-1607623814075-e51df1bdc82f', 900), u('photo-1587593810167-a84920ea0781', 900), u('photo-1598514982205-f36b96d1e8d4', 900), u('photo-1621996346565-e3dbc646d9a9', 900)],
    stats: [{ value: '100%', label: 'Halal' }, { value: '60min', label: 'Delivery' }, { value: 'Daily', label: 'Fresh stock' }],
    marquee: ['Farm fresh', 'Hygienic', 'Cut to order', 'Cold packed', 'Fast delivery'],
    accent: '#DC2626', accent2: '#F97316',
  },
  'Scrap Dealer': {
    label: 'Recycling',
    heroTitle: 'Turn your scrap into cash',
    heroText: 'Fair weights, instant payment and free doorstep pickup for metal, paper, plastic and e-waste.',
    aboutTitle: 'Recycling, done right',
    aboutText: 'We buy all types of scrap from homes, shops and industries, pay the best market rates and make sure everything is recycled responsibly.',
    itemsTitle: 'Today’s Rates',
    ctaPrimary: 'Book a Pickup',
    ctaSecondary: 'See Rates',
    services: [
      { title: 'Doorstep Pickup', description: 'Schedule a free pickup at a time that suits you.' },
      { title: 'Digital Weighing', description: 'Calibrated scales and transparent receipts.' },
      { title: 'Industrial Scrap', description: 'Bulk clearance for factories and warehouses.' },
    ],
    items: [
      { name: 'Iron / Steel', price: '₹32/kg', description: 'Mixed iron, steel and sheet metal.', image: u('photo-1532996122724-e3c354a0b15b', 800) },
      { name: 'Copper', price: '₹720/kg', description: 'Wires, pipes and fittings.', image: u('photo-1588508065123-287b28e013da', 800) },
      { name: 'Newspaper', price: '₹14/kg', description: 'Old papers, books and cartons.', image: u('photo-1611284446314-60a58ac0deb9', 800) },
      { name: 'E-Waste', price: 'Best price', description: 'Old phones, laptops and appliances.', image: u('photo-1518770660439-4636190af475', 800) },
    ],
    hero: [u('photo-1532996122724-e3c354a0b15b', 1920), u('photo-1581091226825-a6a2a5aee158', 1920), u('photo-1604187351574-c75ca79f5807', 1920)],
    gallery: [u('photo-1532996122724-e3c354a0b15b', 900), u('photo-1588508065123-287b28e013da', 900), u('photo-1611284446314-60a58ac0deb9', 900), u('photo-1518770660439-4636190af475', 900), u('photo-1581091226825-a6a2a5aee158', 900), u('photo-1604187351574-c75ca79f5807', 900)],
    stats: [{ value: '500T+', label: 'Recycled' }, { value: 'Instant', label: 'Payment' }, { value: 'Free', label: 'Pickup' }],
    marquee: ['Metal', 'Paper', 'Plastic', 'E-waste', 'Best rates', 'Free pickup'],
    accent: '#16A34A', accent2: '#EAB308',
  },
  'Supermarket / Grocery': {
    label: 'Supermarket',
    heroTitle: 'Fresh groceries, delivered fast',
    heroText: 'Fruits, vegetables, dairy and daily essentials at everyday low prices.',
    aboutTitle: 'Your neighbourhood market',
    aboutText: 'We stock thousands of products from trusted brands and local farms, restock fresh produce every morning and deliver to your door the same day.',
    itemsTitle: 'Fresh Picks',
    ctaPrimary: 'Order Groceries',
    ctaSecondary: 'Weekly Offers',
    services: [
      { title: 'Same-Day Delivery', description: 'Order before 6pm and get it today.' },
      { title: 'Farm Fresh', description: 'Fruits and vegetables sourced every morning.' },
      { title: 'Member Savings', description: 'Weekly deals and loyalty points on every bill.' },
    ],
    items: [
      { name: 'Fresh Fruit Basket', price: '₹399', description: 'Seasonal fruits, 2kg mix.', image: u('photo-1610832958506-aa56368176cf', 800) },
      { name: 'Organic Vegetables', price: '₹249', description: 'Farm-fresh vegetable pack.', image: u('photo-1540420773420-3366772f4999', 800) },
      { name: 'Dairy Combo', price: '₹199', description: 'Milk, curd and paneer.', image: u('photo-1563636619-e9143da7973b', 800) },
      { name: 'Pantry Staples', price: '₹899', description: 'Rice, dal, oil and spices.', image: u('photo-1542838132-92c53300491e', 800) },
    ],
    hero: [u('photo-1542838132-92c53300491e', 1920), u('photo-1578916171728-46686eac8d58', 1920), u('photo-1604719312566-8912e9227c6a', 1920)],
    gallery: [u('photo-1542838132-92c53300491e', 900), u('photo-1578916171728-46686eac8d58', 900), u('photo-1604719312566-8912e9227c6a', 900), u('photo-1610832958506-aa56368176cf', 900), u('photo-1563636619-e9143da7973b', 900), u('photo-1583258292688-d0213dc5a3a8', 900)],
    stats: [{ value: '8k+', label: 'Products' }, { value: '2hr', label: 'Delivery' }, { value: 'Daily', label: 'Fresh stock' }],
    marquee: ['Fresh produce', 'Daily essentials', 'Best prices', 'Fast delivery', 'Weekly offers'],
    accent: '#16A34A', accent2: '#F97316',
  },
  'Textiles / Garments': {
    label: 'Textiles',
    heroTitle: 'Woven with tradition, made for today',
    heroText: 'Sarees, ethnic wear and everyday fashion in fabrics that feel as good as they look.',
    aboutTitle: 'Threads with a story',
    aboutText: 'We work directly with weavers and mills to bring you authentic handlooms, pure silks and modern fits, with tailoring and alterations in-store.',
    itemsTitle: 'The Collection',
    ctaPrimary: 'Shop Collection',
    ctaSecondary: 'Visit Store',
    services: [
      { title: 'Handloom Sarees', description: 'Kanchipuram, Banarasi and Kerala kasavu.' },
      { title: 'Tailoring', description: 'Blouse stitching, alterations and custom fits.' },
      { title: 'Wedding Shopping', description: 'Personal styling for the whole family.' },
    ],
    items: [
      { name: 'Kanchipuram Silk Saree', price: '₹12,500', description: 'Pure silk with zari border.', image: u('photo-1610030469983-98e550d615ef', 800) },
      { name: 'Cotton Kurta Set', price: '₹1,899', description: 'Breathable printed cotton.', image: u('photo-1583391733958-d15fa693d221', 800) },
      { name: 'Linen Shirt', price: '₹1,499', description: 'Relaxed fit, pure linen.', image: u('photo-1596755094514-f87e32f6b717', 800) },
      { name: 'Kids Ethnic Wear', price: '₹999', description: 'Festive sets for little ones.', image: u('photo-1594633312681-425c7b97ccd1', 800) },
    ],
    hero: [u('photo-1610030469983-98e550d615ef', 1920), u('photo-1567401893414-76b7b1e5a7a5', 1920), u('photo-1489987707025-afc232f7ea0f', 1920)],
    gallery: [u('photo-1610030469983-98e550d615ef', 900), u('photo-1583391733958-d15fa693d221', 900), u('photo-1596755094514-f87e32f6b717', 900), u('photo-1594633312681-425c7b97ccd1', 900), u('photo-1567401893414-76b7b1e5a7a5', 900), u('photo-1489987707025-afc232f7ea0f', 900)],
    stats: [{ value: '10k+', label: 'Designs' }, { value: '50+', label: 'Weaver partners' }, { value: '30yrs', label: 'Heritage' }],
    marquee: ['Pure silk', 'Handloom', 'Cotton', 'Ethnic wear', 'Tailoring'],
    accent: '#B91C1C', accent2: '#D4A017',
  },
  'Real Estate': {
    label: 'Real Estate',
    heroTitle: 'Find the place you’ll call home',
    heroText: 'Verified homes, villas and commercial spaces, with honest advice from first visit to final keys.',
    aboutTitle: 'Property, made simple',
    aboutText: 'Our advisors know every neighbourhood, verify every listing and handle the paperwork, loans and registration so you can move in with confidence.',
    itemsTitle: 'Featured Listings',
    ctaPrimary: 'Explore Listings',
    ctaSecondary: 'Talk to an Agent',
    services: [
      { title: 'Buy & Sell', description: 'Verified listings and fair, data-backed valuations.' },
      { title: 'Rentals', description: 'Homes and offices matched to your budget.' },
      { title: 'Loans & Legal', description: 'Home loans, documentation and registration support.' },
    ],
    items: [
      { name: 'Lakeview Villa · 4 BHK', price: '₹2.4 Cr', description: '3,200 sq ft, private garden and pool.', image: u('photo-1600596542815-ffad4c1539a9', 800) },
      { name: 'Skyline Apartment · 3 BHK', price: '₹1.1 Cr', description: '1,650 sq ft, city views, clubhouse.', image: u('photo-1545324418-cc1a3fa10c00', 800) },
      { name: 'Modern Townhouse · 3 BHK', price: '₹95 L', description: 'Gated community, two car parks.', image: u('photo-1600585154340-be6161a56a0c', 800) },
      { name: 'Grade-A Office Space', price: '₹85/sq ft', description: '5,000 sq ft, ready to move.', image: u('photo-1486406146926-c627a92ad1ab', 800) },
    ],
    hero: [u('photo-1600596542815-ffad4c1539a9', 1920), u('photo-1600607687939-ce8a6c25118c', 1920), u('photo-1512917774080-9991f1c4c750', 1920)],
    gallery: [u('photo-1600596542815-ffad4c1539a9', 900), u('photo-1600607687939-ce8a6c25118c', 900), u('photo-1512917774080-9991f1c4c750', 900), u('photo-1600585154340-be6161a56a0c', 900), u('photo-1545324418-cc1a3fa10c00', 900), u('photo-1580587771525-78b9dba3b914', 900)],
    stats: [{ value: '1,200+', label: 'Homes sold' }, { value: '350+', label: 'Listings' }, { value: '18yrs', label: 'Experience' }],
    marquee: ['Villas', 'Apartments', 'Plots', 'Commercial', 'Rentals'],
    accent: '#0EA5E9', accent2: '#C9A227',
  },
  'Consulting': {
    label: 'Consulting',
    heroTitle: 'Clarity for the decisions that matter',
    heroText: 'Strategy, operations and growth advisory for ambitious teams.',
    aboutTitle: 'Partners, not just advisors',
    aboutText: 'We work alongside founders and leadership teams to turn complex challenges into clear plans, then stay to help deliver measurable results.',
    itemsTitle: 'Engagements',
    ctaPrimary: 'Book a Consultation',
    ctaSecondary: 'Our Approach',
    services: [
      { title: 'Strategy', description: 'Market entry, growth plans and clear priorities.' },
      { title: 'Operations', description: 'Leaner processes and systems that scale.' },
      { title: 'Transformation', description: 'Digital, organisational and cultural change.' },
    ],
    items: [
      { name: 'Strategy Sprint', price: '2 weeks', description: 'Diagnose, prioritise and leave with a plan.', image: u('photo-1552664730-d307ca884978', 800) },
      { name: 'Growth Programme', price: '3 months', description: 'Hands-on support to hit your targets.', image: u('photo-1542744173-8e7e53415bb0', 800) },
      { name: 'Board Advisory', price: 'Retainer', description: 'Ongoing guidance for leadership.', image: u('photo-1507679799987-c73779587ccf', 800) },
      { name: 'Workshops', price: '1 day', description: 'Facilitated sessions for your team.', image: u('photo-1517245386807-bb43f82c33c4', 800) },
    ],
    hero: [u('photo-1497366216548-37526070297c', 1920), u('photo-1552664730-d307ca884978', 1920), u('photo-1542744173-8e7e53415bb0', 1920)],
    gallery: [u('photo-1497366216548-37526070297c', 900), u('photo-1552664730-d307ca884978', 900), u('photo-1542744173-8e7e53415bb0', 900), u('photo-1507679799987-c73779587ccf', 900), u('photo-1517245386807-bb43f82c33c4', 900), u('photo-1522071820081-009f0129c71c', 900)],
    stats: [{ value: '150+', label: 'Clients' }, { value: '3x', label: 'Avg. growth' }, { value: '12', label: 'Industries' }],
    marquee: ['Strategy', 'Operations', 'Growth', 'Leadership', 'Results'],
    accent: '#3B82F6', accent2: '#8B5CF6',
  },
  'Other': {
    label: 'Studio',
    heroTitle: 'We make good things happen',
    heroText: 'Quality products and services, delivered with care by a team that cares.',
    aboutTitle: 'Who we are',
    aboutText: 'We are a local business built on quality, honesty and great service. Whatever you need, we’re here to help and we’ll always go the extra mile.',
    itemsTitle: 'What We Offer',
    ctaPrimary: 'Get in Touch',
    ctaSecondary: 'Learn More',
    services: [
      { title: 'Quality First', description: 'Carefully made, carefully checked, every time.' },
      { title: 'Personal Service', description: 'Real people who know you by name.' },
      { title: 'Fast Turnaround', description: 'Quick responses and on-time delivery.' },
    ],
    items: [
      { name: 'Essential Package', price: '₹999', description: 'Everything you need to get started.', image: u('photo-1522071820081-009f0129c71c', 800) },
      { name: 'Standard Package', price: '₹2,499', description: 'Our most popular option.', image: u('photo-1519389950473-47ba0277781c', 800) },
      { name: 'Premium Package', price: '₹4,999', description: 'The complete, all-inclusive service.', image: u('photo-1556761175-5973dc0f32e7', 800) },
      { name: 'Custom', price: 'On request', description: 'Tailored to exactly what you need.', image: u('photo-1497366811353-6870744d04b2', 800) },
    ],
    hero: [u('photo-1497366216548-37526070297c', 1920), u('photo-1522071820081-009f0129c71c', 1920), u('photo-1519389950473-47ba0277781c', 1920)],
    gallery: [u('photo-1522071820081-009f0129c71c', 900), u('photo-1519389950473-47ba0277781c', 900), u('photo-1556761175-5973dc0f32e7', 900), u('photo-1497366811353-6870744d04b2', 900), u('photo-1497366216548-37526070297c', 900), u('photo-1492684223066-81342ee5ff30', 900)],
    stats: [{ value: '500+', label: 'Happy clients' }, { value: '10yrs', label: 'Experience' }, { value: '4.9★', label: 'Rating' }],
    marquee: ['Quality', 'Trust', 'Service', 'Value', 'Care'],
    accent: '#8B5CF6', accent2: '#EC4899',
  },
};

/** Theme names of the motion family, added to every business category. */
export const MOTION_THEME_NAMES = ['Cinematic', 'Aurora', 'Editorial', 'Neon Pulse', 'Luxe Motion'] as const;
