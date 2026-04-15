import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

let url = '';
let key = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

const initialProducts = [
  {
    name: 'Stylish Grey Chair',
    price: 150.00,
    original_price: null,
    image: '/images/grey-chair.png',
    rating: 5,
    badge: '10% Off',
    badge_type: 'sale',
    category: 'Living Room',
    description: 'Experience unparalleled comfort with this stylish grey chair.',
  },
  {
    name: 'Chair Pillow',
    price: 190.00,
    image: '/images/teal-chair.png',
    rating: 4,
    category: 'Bedroom',
    description: 'A beautifully crafted teal accent chair with pillow-soft cushioning.',
  },
  {
    name: 'Seater Gray Sofa',
    price: 300.00,
    image: '/images/leather-chair.png',
    badge: '15% Off',
    badge_type: 'sale',
    category: 'Living Room',
    rating: 5,
    description: 'This premium leather seater combines durability with sophisticated design.',
  },
  {
    name: 'Wooden Chair',
    price: 129.00,
    image: '/images/wooden-chair.png',
    category: 'Dining',
    rating: 4,
    description: 'A minimalist wooden accent chair blending timeless craftsmanship.',
  },
  {
    name: 'Alexander Sofa',
    price: 150.00,
    image: '/images/white-sofa.png',
    badge: '10% Off',
    badge_type: 'sale',
    category: 'Living Room',
    rating: 5,
    description: 'The Alexander Sofa Chair features a plush white tufted design with elegant gold legs.',
  },
  {
    name: 'Chair Nobody Armchair',
    price: 80.00,
    image: '/images/wooden-chair.png',
    badge: 'NEW',
    badge_type: 'new',
    category: 'Living Room',
    rating: 4,
    description: 'A handcrafted armchair combining natural wood with a sleek black cushion.',
  },
  {
    name: 'Realistic Sofa',
    price: 49.00,
    image: '/images/checkered-chair.png',
    category: 'Living Room',
    rating: 5,
    description: 'A statement piece featuring a bold checkered pattern.',
  },
  {
    name: 'Alexander Roll Arm Sofa',
    price: 19.25,
    original_price: 30.35,
    image: '/images/hero-chair.png',
    rating: 4,
    badge: 'TOP SALE',
    badge_type: 'sale',
    category: 'Construction',
    description: 'This beautiful roll arm sofa features a completely modern design at an unbeatable price.',
  },
  {
    name: 'Leather Chair',
    price: 200.00,
    image: '/images/leather-chair.png',
    category: 'Living Room',
    rating: 5,
    description: 'Premium tan leather bucket chair with a contemporary silhouette.',
  }
];

async function seed() {
  console.log('Wiping existing dummy database products...');
  const { error: delError } = await supabase.from('products').delete().neq('id', 0);
  if (delError) console.error("Error wiping table:", delError);

  console.log('Seeding original 9 products...');
  const { error: insError } = await supabase.from('products').insert(initialProducts);
  
  if (insError) {
    console.error("Failed to seed products:", insError);
  } else {
    console.log("Success! The storefront is fully loaded with dynamic original images and real descriptions.");
  }
}

seed();
