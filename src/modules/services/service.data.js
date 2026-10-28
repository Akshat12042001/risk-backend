const assurance = {
  title: 'Relax, your home is in professional hands',
  trustedBy: '15 lakh',
  trustedByLabel: 'Families',
  rating: 4.8,
  ratingCount: '3 Lakh+ Ratings',
};

const sharedFaqs = [
  {
    question: 'What if I need more time?',
    answer: 'Add more time from the booking while your Pro is still at home.',
  },
  {
    question: 'Is there a damage policy?',
    answer: 'Tell your Pro during the visit. Support reviews damage reported on the booking.',
  },
  {
    question: 'Are Pros background-verified?',
    answer: 'Yes. Pros on this service are background-verified.',
  },
  {
    question: 'How do I reach support?',
    answer: 'Open Help in the app after you book. Support is available on the booking.',
  },
];

function detail(content) {
  return {
    ...content,
    faqs: [...content.faqs, ...sharedFaqs],
    assurance,
  };
}

export const serviceDetails = {
  'hourly-service': detail({
    label: 'HOURLY SERVICE',
    headline: 'One visit. Everything handled.',
    ratingCount: '239.6k',
    durations: [
      { id: '30', label: '30 mins', minutes: 30, price: 30, originalPrice: 125 },
      { id: '60', label: '60 mins', minutes: 60, price: 59, originalPrice: 250 },
      { id: '90', label: '90 mins', minutes: 90, price: 89, originalPrice: 375 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Tell your Pro what matters most.' },
      { id: 'work', title: 'Work', description: 'They work through your list in the time you booked.' },
      { id: 'check', title: 'Check', description: 'Final wipe and tidy before they leave.' },
    ],
    included: [
      'Sweeping, mopping and dusting',
      'Bathroom and kitchen cleaning',
      'Utensils and kitchen prep',
      'Laundry',
      'Balcony, window and fan cleaning',
    ],
    excluded: [
      'Ironing',
      'Deep cleans: walls, wardrobes, cabinets, tubs',
      'Deep steam, car wash or plant care',
      'Chandeliers or fragile glass',
      'Commercial or construction sites',
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'Yes. Your Pro uses your supplies - please keep a broom, mop and detergent ready.',
      },
    ],
  }),
  'festive-home-help': detail({
    label: 'FESTIVE HOME HELP',
    headline: 'A guest-ready home before the celebrations.',
    ratingCount: '19.2k',
    durations: [
      { id: 'visit', label: '1 visit', minutes: 120, price: 199, originalPrice: null },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Share which rooms guests will use.' },
      { id: 'work', title: 'Work', description: 'Your Pro cleans and sets those rooms.' },
      { id: 'check', title: 'Check', description: 'A final walkthrough before they leave.' },
    ],
    included: [
      'Living and dining cleanup',
      'Guest bathroom cleaning',
      'Kitchen surface and utensil wash',
      'Floor sweeping and mopping',
      'Trash removal from cleaned rooms',
    ],
    excluded: [
      'Decoration setup',
      'Outside catering cleanup',
      'Deep cleaning of sofas or carpets',
      'Utensil polishing',
      'Commercial venues',
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'Yes. Keep a broom, mop, and bathroom cleaner ready.',
      },
    ],
  }),
  'packers-movers': detail({
    label: 'PACKERS & MOVERS',
    headline: 'Packed, moved, and set down safely.',
    ratingCount: '13.3k',
    durations: [
      { id: 'within-city', label: 'Within city', minutes: null, price: 799, originalPrice: null },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Share the pickup and drop address.' },
      { id: 'work', title: 'Work', description: 'The crew packs and moves your listed items.' },
      { id: 'check', title: 'Check', description: 'You confirm the items at the new home.' },
    ],
    included: [
      'Packing of listed household items',
      'Loading at pickup',
      'Transport within the city',
      'Unloading at drop',
      'Basic placement in the rooms you choose',
    ],
    excluded: [
      'Intercity moves',
      'Dismantling of fitted furniture',
      'Appliance installation',
      'Storage',
      'Items not listed at booking',
    ],
    faqs: [
      {
        question: 'Do I need to pack everything myself?',
        answer: 'No. The crew packs the items you listed. Keep valuables and documents with you.',
      },
    ],
  }),
  'kitchen-prep': detail({
    label: 'KITCHEN PREP',
    headline: 'Dishes done and the counter cleared.',
    ratingCount: '25.4k',
    durations: [
      { id: '30', label: '30 mins', minutes: 30, price: 30, originalPrice: 125 },
      { id: '60', label: '60 mins', minutes: 60, price: 59, originalPrice: 250 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Point out what needs washing or prep.' },
      { id: 'work', title: 'Work', description: 'Your Pro works through utensils and counters.' },
      { id: 'check', title: 'Check', description: 'The sink and slab are left cleared.' },
    ],
    included: [
      'Utensil washing',
      'Counter and slab wipe',
      'Sink cleaning',
      'Basic chopping or prep you request',
      'Stove top wipe',
    ],
    excluded: [
      'Chimney or deep degreasing',
      'Oven cleaning',
      'Floor mopping outside the kitchen',
      'Grocery shopping',
      'Cooking a full meal',
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'Yes. Keep dish soap, a scrubber, and a wiping cloth ready.',
      },
    ],
  }),
  balcony: detail({
    label: 'BALCONY',
    headline: 'A swept balcony, ready to use.',
    ratingCount: '17.3k',
    durations: [
      { id: '30', label: '30 mins', minutes: 30, price: 30, originalPrice: 125 },
      { id: '60', label: '60 mins', minutes: 60, price: 59, originalPrice: 250 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Show the balcony and anything to move aside.' },
      { id: 'work', title: 'Work', description: 'Your Pro sweeps, mops, and wipes the railing.' },
      { id: 'check', title: 'Check', description: 'The floor is left dry before they go.' },
    ],
    included: [
      'Sweeping and mopping',
      'Railing and grill wipe',
      'Dry leaf and dust removal',
      'Shoe rack or mat dusting',
      'Trash from the balcony',
    ],
    excluded: [
      'High-rise exterior glass',
      'Plant pruning',
      'Waterproofing',
      'Painting',
      'Furniture shifting to another room',
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'Yes. Keep a broom, mop, and floor cleaner ready.',
      },
    ],
  }),
  'fan-cleaning': detail({
    label: 'FAN CLEANING',
    headline: 'Dust off the fan without the mess.',
    ratingCount: '24.1k',
    durations: [
      { id: '30', label: '30 mins', minutes: 30, price: 30, originalPrice: 125 },
      { id: '60', label: '60 mins', minutes: 60, price: 59, originalPrice: 250 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Tell your Pro which fans to clean.' },
      { id: 'work', title: 'Work', description: 'They cover the area and wipe each fan.' },
      { id: 'check', title: 'Check', description: 'The floor underneath is cleaned before they leave.' },
    ],
    included: [
      'Ceiling fan blade wipe',
      'Fan body and rod dusting',
      'Light fixture dusting on the same fan',
      'Floor cleanup under the fan',
      'Up to the fans that fit the booked time',
    ],
    excluded: [
      'Fan repair or installation',
      'Exhaust fan opening',
      'Wall marks around the fan',
      'Chandelier cleaning',
      'Electrical work',
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'Yes. Keep a sturdy stool, a dry cloth, and a mild cleaner ready.',
      },
    ],
  }),
  'kitchen-cabinets': detail({
    label: 'KITCHEN CABINETS',
    headline: 'Cabinets emptied, cleaned, and wiped dry.',
    ratingCount: '24.1k',
    durations: [
      { id: 'standard', label: 'Standard', minutes: 90, price: 177, originalPrice: 750 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Choose the cabinets to include.' },
      { id: 'work', title: 'Work', description: 'Your Pro empties, degreases, and wipes them.' },
      { id: 'check', title: 'Check', description: 'Items go back once the shelves are dry.' },
    ],
    included: [
      'Inside shelf and side wipe',
      'Outer door and handle wipe',
      'Degreasing of reachable shelves',
      'Putting items back',
      'Counter under the cabinets',
    ],
    excluded: [
      'Appliance interiors',
      'Wall tiles behind cabinets',
      'Cabinet repair',
      'Pest control',
      'Items stored above reachable height without a stool',
    ],
    faqs: [
      {
        question: 'Do I need to empty the cabinets first?',
        answer: 'No. Your Pro empties what they clean and puts it back after wiping.',
      },
    ],
  }),
  'complete-wardrobe': detail({
    label: 'COMPLETE WARDROBE',
    headline: 'The wardrobe, cleaned from the inside out.',
    ratingCount: '16.1k',
    durations: [
      { id: 'standard', label: 'Standard', minutes: 90, price: 177, originalPrice: 750 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Show the wardrobe and shelves to include.' },
      { id: 'work', title: 'Work', description: 'Your Pro cleans shelves, rods, and doors.' },
      { id: 'check', title: 'Check', description: 'Clothes and boxes are placed back neatly.' },
    ],
    included: [
      'Shelf and drawer wipe',
      'Hanging rod dusting',
      'Door, mirror, and handle wipe',
      'Putting clothes back',
      'Floor in front of the wardrobe',
    ],
    excluded: [
      'Dry cleaning or ironing',
      'Wardrobe repair',
      'Shoe deep cleaning',
      'Wall cleaning around the wardrobe',
      'Packing for a move',
    ],
    faqs: [
      {
        question: 'Will my clothes be removed?',
        answer: 'Yes, from the sections being cleaned. They are placed back after the shelves dry.',
      },
    ],
  }),
  window: detail({
    label: 'WINDOW',
    headline: 'Clear glass, frames, and sills.',
    ratingCount: '25.2k',
    durations: [
      { id: '30', label: '30 mins', minutes: 30, price: 30, originalPrice: 125 },
      { id: '60', label: '60 mins', minutes: 60, price: 59, originalPrice: 250 },
    ],
    steps: [
      { id: 'plan', title: 'Plan', description: 'Point out the windows to include.' },
      { id: 'work', title: 'Work', description: 'Your Pro cleans the glass, frame, and sill.' },
      { id: 'check', title: 'Check', description: 'Tracks are wiped before they leave.' },
    ],
    included: [
      'Interior glass cleaning',
      'Frame and sill wipe',
      'Window track dusting',
      'Grill wipe from inside',
      'Floor under the windows',
    ],
    excluded: [
      'Exterior facade or high-rise outside glass',
      'Broken glass replacement',
      'Tint or film removal',
      'Curtain washing',
      'Balcony floor cleaning',
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'Yes. Keep a glass cleaner, a cloth, and a stool ready for higher panes.',
      },
    ],
  }),
};
