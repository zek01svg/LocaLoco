import { Business, Review, Event } from '../types/business';
import { useState, useEffect } from 'react';

import axios from 'axios';

export default function BusinessesLoader() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/businesses')
      .then(response => {
        setBusinesses(response.data); // assumes array shape matches your Business[]
      })
      .catch(error => {
        console.error('Failed to fetch businesses:', error);
      })
      .finally(() => setLoading(false));
  }, []);

}
export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Lau Pa Sat Chicken Rice',
    category: 'fnb',
    subcategory: 'Hawker Stall',
    address: '18 Raffles Quay, Lau Pa Sat, Singapore 048582',
    phone: '+65 6220 2138',
    website: 'https://laupasat.sg',
    description: 'Famous Hainanese chicken rice stall serving tender poached chicken with fragrant rice. A beloved local favorite with over 30 years of heritage.',
    image: 'https://images.unsplash.com/photo-1602586814425-16431703d1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjBoYXdrZXIlMjBjZW50ZXIlMjBmb29kfGVufDF8fHx8MTc2MDA4ODY3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    reviewCount: 342,
    priceRange: '$',
    hours: {
      'Monday': { open: '8:00 AM', close: '9:00 PM' },  // ✅ Correct
      'Tuesday': { open: '8:00 AM', close: '9:00 PM' },
      'Wednesday': { open: '8:00 AM', close: '9:00 PM' },
      'Thursday': { open: '8:00 AM', close: '9:00 PM' },
      'Friday': { open: '8:00 AM', close: '10:00 PM' },
      'Saturday': { open: '8:00 AM', close: '10:00 PM' },
      'Sunday': { open: '8:00 AM', close: '8:00 PM' }
    },
    
    coordinates: { lat: 1.2803, lng: 103.8509 },
    isPopular: true,
    tags: ['hawker', 'chicken rice', 'local food', 'halal']
  },
  {
    id: '2',
    name: 'Tiong Bahru Bakery',
    category: 'fnb',
    subcategory: 'Cafe & Bakery',
    address: '56 Eng Hoon Street, #01-70, Singapore 160056',
    phone: '+65 6220 3430',
    website: 'https://tiongbahrubakery.com',
    description: 'Artisan bakery and café offering freshly baked croissants, sourdough bread, and specialty coffee. Cozy ambiance perfect for brunch or afternoon tea.',
    image: 'https://images.unsplash.com/photo-1705719418777-6ad45f437938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjBjYWZlJTIwY29mZmVlfGVufDF8fHx8MTc2MDA4ODY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    reviewCount: 289,
    priceRange: '$$',
    hours: {
      'Monday': { open: '8:00 AM', close: '8:00 PM' },
      'Tuesday': { open: '8:00 AM', close: '8:00 PM' },
      'Wednesday': { open: '8:00 AM', close: '8:00 PM' },
      'Thursday': { open: '8:00 AM', close: '8:00 PM' },
      'Friday': { open: '8:00 AM', close: '9:00 PM' },
      'Saturday': { open: '8:00 AM', close: '9:00 PM' },
      'Sunday': { open: '8:00 AM', close: '8:00 PM' }
    },
    coordinates: { lat: 1.2857, lng: 103.8341 },
    isPopular: true,
    tags: ['bakery', 'coffee', 'brunch', 'pastries', 'wifi']
  },
  {
    id: '3',
    name: 'Labyrinth',
    category: 'fnb',
    subcategory: 'Fine Dining',
    address: 'Esplanade Mall, 8 Raffles Avenue #02-23, Singapore 039802',
    phone: '+65 6223 4098',
    website: 'https://labyrinth.sg',
    description: 'Michelin-starred restaurant showcasing modern Singaporean cuisine. Experience local flavors elevated with innovative culinary techniques.',
    image: 'https://images.unsplash.com/photo-1700520687943-12c8a034d59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc2MDA4ODY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviewCount: 567,
    priceRange: '$$$',
    hours: {
      'Monday': { open: 'Closed', close: 'Closed' },
      'Tuesday': { open: '6:00 PM', close: '10:00 PM' },
      'Wednesday': { open: '6:00 PM', close: '10:00 PM' },
      'Thursday': { open: '6:00 PM', close: '10:00 PM' },
      'Friday': { open: '6:00 PM', close: '10:30 PM' },
      'Saturday': { open: '6:00 PM', close: '10:30 PM' },
      'Sunday': { open: '6:00 PM', close: '10:00 PM' }
    },
    
    coordinates: { lat: 1.2897, lng: 103.8556 },
    isPopular: true,
    tags: ['fine dining', 'michelin', 'singaporean', 'tasting menu']
  },
  {
    id: '4',
    name: 'Orchard Central Fashion Hub',
    category: 'retail',
    subcategory: 'Fashion Boutique',
    address: '181 Orchard Road, #04-12, Singapore 238896',
    phone: '+65 6735 6824',
    website: 'https://orchardcentralfashion.com',
    description: 'Contemporary fashion boutique featuring curated collections from local and international designers. Personal styling consultations available.',
    image: 'https://images.unsplash.com/photo-1648115674180-4798bd9d2826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoYXJkJTIwcm9hZCUyMHNob3BwaW5nJTIwc2luZ2Fwb3JlfGVufDF8fHx8MTc2MDA4ODY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.4,
    reviewCount: 178,
    priceRange: '$$$',
    hours: {
      'Monday': { open: '10:00 AM', close: '9:00 PM' },
      'Tuesday': { open: '10:00 AM', close: '9:00 PM' },
      'Wednesday': { open: '10:00 AM', close: '9:00 PM' },
      'Thursday': { open: '10:00 AM', close: '9:00 PM' },
      'Friday': { open: '10:00 AM', close: '10:00 PM' },
      'Saturday': { open: '10:00 AM', close: '10:00 PM' },
      'Sunday': { open: '10:00 AM', close: '9:00 PM' }
    },
    coordinates: { lat: 1.3012, lng: 103.8392 },
    tags: ['fashion', 'designer', 'boutique', 'styling', 'orchard']
  },
  {
    id: '5',
    name: 'SG Tech Repair Pro',
    category: 'services',
    subcategory: 'Electronics Repair',
    address: '1 Rochor Canal Road, #02-81 Sim Lim Square, Singapore 188504',
    phone: '+65 6339 2847',
    description: 'Expert electronics repair services for smartphones, laptops, and tablets. Same-day service available with genuine parts and warranty.',
    image: 'https://images.unsplash.com/photo-1533280385001-c32ffcbd52a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBzaW5nYXBvcmV8ZW58MXx8fHwxNzYwMDg4NjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    reviewCount: 234,
    priceRange: '$$',
    hours: {
      'Monday': { open: '10:00 AM', close: '8:00 PM' },
      'Tuesday': { open: '10:00 AM', close: '8:00 PM' },
      'Wednesday': { open: '10:00 AM', close: '8:00 PM' },
      'Thursday': { open: '10:00 AM', close: '8:00 PM' },
      'Friday': { open: '10:00 AM', close: '8:00 PM' },
      'Saturday': { open: '10:00 AM', close: '8:00 PM' },
      'Sunday': { open: '11:00 AM', close: '6:00 PM' }
    },
    coordinates: { lat: 1.3030, lng: 103.8530 },
    tags: ['electronics', 'repair', 'smartphone', 'warranty', 'sim lim']
  },
  {
    id: '6',
    name: 'The Halal Kitchen',
    category: 'dietary-options',
    subcategory: 'Halal Restaurant',
    address: '100 Beach Road, #01-26 Shaw Tower, Singapore 189702',
    phone: '+65 6291 3847',
    website: 'https://thehalalkitchen.sg',
    description: 'Certified halal restaurant serving authentic Middle Eastern and fusion cuisine. Wide variety of dishes catering to diverse tastes.',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxhbCUyMHJlc3RhdXJhbnQlMjBmb29kfGVufDF8fHx8MTc2MDA4ODY4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviewCount: 412,
    priceRange: '$$',
    hours: {
      'Monday': { open: '11:00 AM', close: '10:00 PM' },
      'Tuesday': { open: '11:00 AM', close: '10:00 PM' },
      'Wednesday': { open: '11:00 AM', close: '10:00 PM' },
      'Thursday': { open: '11:00 AM', close: '10:00 PM' },
      'Friday': { open: '11:00 AM', close: '11:00 PM' },
      'Saturday': { open: '11:00 AM', close: '11:00 PM' },
      'Sunday': { open: '11:00 AM', close: '10:00 PM' }
    },
    coordinates: { lat: 1.2996, lng: 103.8573 },
    tags: ['halal', 'middle eastern', 'certified', 'family friendly']
  },
  {
    id: '7',
    name: 'Marina Bay Wellness Spa',
    category: 'health-wellness',
    subcategory: 'Spa & Wellness',
    address: '10 Bayfront Avenue, #B1-48 The Shoppes at Marina Bay Sands, Singapore 018956',
    phone: '+65 6688 8888',
    website: 'https://marinabayspa.sg',
    description: 'Luxurious wellness spa offering traditional and modern therapies. Signature massages, facials, and holistic wellness programs in a serene environment.',
    image: 'https://images.unsplash.com/photo-1638325147810-b84f577938bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjB3ZWxsbmVzcyUyMHNwYXxlbnwxfHx8fDE3NjAwODg2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviewCount: 523,
    priceRange: '$$$',
    hours: {
      'Monday': { open: '10:00 AM', close: '10:00 PM' },
      'Tuesday': { open: '10:00 AM', close: '10:00 PM' },
      'Wednesday': { open: '10:00 AM', close: '10:00 PM' },
      'Thursday': { open: '10:00 AM', close: '10:00 PM' },
      'Friday': { open: '10:00 AM', close: '11:00 PM' },
      'Saturday': { open: '9:00 AM', close: '11:00 PM' },
      'Sunday': { open: '9:00 AM', close: '10:00 PM' }
    },
    coordinates: { lat: 1.2834, lng: 103.8607 },
    isPopular: true,
    tags: ['spa', 'wellness', 'massage', 'luxury', 'marina bay']
  },
  {
    id: '8',
    name: 'Virtual Reality Arcade SG',
    category: 'entertainment',
    subcategory: 'VR Gaming Center',
    address: '313 Orchard Road, #04-29 313@Somerset, Singapore 238895',
    phone: '+65 6909 3847',
    website: 'https://vrarcadesg.com',
    description: 'State-of-the-art VR gaming center with latest VR games and experiences. Perfect for team building, parties, and entertainment.',
    image: 'https://images.unsplash.com/photo-1754246522949-69355c187b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnRhaW5tZW50JTIwYXJjYWRlJTIwZ2FtaW5nfGVufDF8fHx8MTc1Nzk0MDczMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    reviewCount: 398,
    priceRange: '$$',
    hours: {
      'Monday': { open: '12:00 PM', close: '10:00 PM' },
      'Tuesday': { open: '12:00 PM', close: '10:00 PM' },
      'Wednesday': { open: '12:00 PM', close: '10:00 PM' },
      'Thursday': { open: '12:00 PM', close: '10:00 PM' },
      'Friday': { open: '12:00 PM', close: '11:00 PM' },
      'Saturday': { open: '11:00 AM', close: '11:00 PM' },
      'Sunday': { open: '11:00 AM', close: '10:00 PM' }
    },
    coordinates: { lat: 1.3013, lng: 103.8381 },
    tags: ['vr', 'gaming', 'entertainment', 'parties', 'team building']
  },
  {
    id: '9',
    name: 'Lion City Legal Associates',
    category: 'professional-services',
    subcategory: 'Legal Services',
    address: '6 Battery Road, #20-01, Singapore 049909',
    phone: '+65 6532 1888',
    website: 'https://lioncitylegal.sg',
    description: 'Established law firm providing comprehensive legal services including corporate law, property transactions, and family law. Trusted advisors since 1998.',
    image: 'https://images.unsplash.com/photo-1630265927428-a62b061a5270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2UlMjBwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlc3xlbnwxfHx8fDE3NTc5NDA3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviewCount: 156,
    priceRange: '$$$',
    hours: {
      'Monday': { open: '9:00 AM', close: '6:00 PM' },
      'Tuesday': { open: '9:00 AM', close: '6:00 PM' },
      'Wednesday': { open: '9:00 AM', close: '6:00 PM' },
      'Thursday': { open: '9:00 AM', close: '6:00 PM' },
      'Friday': { open: '9:00 AM', close: '5:00 PM' },
      'Saturday': { open: 'By appointment', close: 'By appointment' },
      'Sunday': { open: 'Closed', close: 'Closed' }
    },
    coordinates: { lat: 1.2858, lng: 103.8514 },
    tags: ['legal', 'corporate law', 'property', 'consultation']
  },
  {
    id: '10',
    name: 'Scandi Living Furniture',
    category: 'home-living',
    subcategory: 'Furniture Store',
    address: '32 Ang Mo Kio Industrial Park 2, #01-08, Singapore 569510',
    phone: '+65 6481 2945',
    website: 'https://scandiliving.sg',
    description: 'Premium Scandinavian-inspired furniture and home decor. Quality crafted pieces with minimalist design, perfect for modern Singapore homes.',
    image: 'https://images.unsplash.com/photo-1759753976401-4b41b1acdaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBzaG93cm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NjAwODg2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviewCount: 267,
    priceRange: '$$$',
    hours: {
      'Monday': { open: '10:00 AM', close: '7:00 PM' },
      'Tuesday': { open: '10:00 AM', close: '7:00 PM' },
      'Wednesday': { open: '10:00 AM', close: '7:00 PM' },
      'Thursday': { open: '10:00 AM', close: '7:00 PM' },
      'Friday': { open: '10:00 AM', close: '8:00 PM' },
      'Saturday': { open: '10:00 AM', close: '8:00 PM' },
      'Sunday': { open: '11:00 AM', close: '6:00 PM' }
    },
    coordinates: { lat: 1.3780, lng: 103.8647 },
    tags: ['furniture', 'scandinavian', 'modern', 'home decor', 'minimalist']
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    businessId: '1',
    userId: 'user-1',
    userName: 'Alex Johnson',
    rating: 5,
    comment: 'Best chicken rice in Singapore! The chicken is so tender and the rice is perfectly fragrant. A must-try!',
    date: '2025-10-05'
  },
  {
    id: '2',
    businessId: '2',
    userName: 'Sarah Tan',
    rating: 5,
    comment: 'Love their croissants! Perfectly flaky and buttery. The coffee is excellent too. Great place for brunch in Tiong Bahru.',
    date: '2025-10-08'
  },
  {
    id: '3',
    businessId: '3',
    userId: 'user-1',
    userName: 'Alex Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Absolutely mind-blowing tasting menu! Every dish tells a story of Singapore. Well worth the Michelin star.',
    date: '2025-10-03'
  },
  {
    id: '4',
    businessId: '3',
    userId: 'user-1',
    userName: 'Alex Johnson',
    rating: 5,
    comment: 'The service and presentation are impeccable. A true fine dining experience showcasing local flavors.',
    date: '2025-09-30'
  },
  {
    id: '5',
    businessId: '6',
    userName: 'Ahmad Rahman',
    rating: 5,
    comment: 'Authentic halal food with great variety. The lamb dishes are exceptional. Highly recommended for families!',
    date: '2025-10-02'
  },
  {
    id: '6',
    businessId: '7',
    userName: 'Emily Lim',
    rating: 5,
    comment: 'The most relaxing spa experience I\'ve had in Singapore. The massage therapists are highly skilled and professional.',
    date: '2025-10-01'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Michelin Menu Showcase',
    description: 'Labyrinth presents a special tasting menu featuring new Singaporean-inspired dishes celebrating local heritage.',
    businessId: '3',
    businessName: 'Labyrinth',
    date: '2025-10-25',
    image: 'https://images.unsplash.com/photo-1700520687943-12c8a034d59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc2MDA4ODY3OXww&ixlib=rb-4.1.0&q=80&w=400',
    isLatest: true
  },
  {
    id: '2',
    title: 'Wellness Week Promotion',
    description: 'Marina Bay Wellness Spa is offering 20% off all spa packages. Book now for ultimate relaxation experience.',
    businessId: '7',
    businessName: 'Marina Bay Wellness Spa',
    date: '2025-10-20',
    image: 'https://images.unsplash.com/photo-1638325147810-b84f577938bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjB3ZWxsbmVzcyUyMHNwYXxlbnwxfHx8fDE3NjAwODg2ODB8MA&ixlib=rb-4.1.0&q=80&w=400',
    isLatest: true
  },
  {
    id: '3',
    title: 'VR Gaming Championship',
    description: 'Join our monthly VR gaming tournament at Virtual Reality Arcade SG with amazing prizes and exclusive game demos.',
    businessId: '8',
    businessName: 'Virtual Reality Arcade SG',
    date: '2025-10-18',
    image: 'https://images.unsplash.com/photo-1754246522949-69355c187b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnRhaW5tZW50JTIwYXJjYWRlJTIwZ2FtaW5nfGVufDF8fHx8MTc1Nzk0MDczMnww&ixlib=rb-4.1.0&q=80&w=400',
    isLatest: false
  }
];
