import { ForumDiscussion } from '../types/forum';

export const mockDiscussions: ForumDiscussion[] = [
  {
    id: '1',
    title: 'Sunny Fashion Sizing',
    businessTag: 'Orchard Central Fashion Hub',
    content: 'Heads up: their oversized shirts actually fit true to size! Staff were super nice and helpful too!',
    userName: 'Ahmad',
    userAvatar: undefined,
    createdAt: '2025-10-09T10:30:00',
    likes: 12,
    replies: [
      {
        id: '1-1',
        discussionId: '1',
        userName: 'Jasmine',
        userAvatar: undefined,
        content: 'I agree! Bought a jacket there -- great quality for the price.',
        createdAt: '2025-10-09T11:15:00',
      },
    ],
  },
  {
    id: '2',
    title: 'Best Chicken Rice in CBD?',
    businessTag: 'Lau Pa Sat Chicken Rice',
    content: 'Just tried the chicken rice at Lau Pa Sat and it was amazing! The rice was so fragrant. Highly recommend!',
    userName: 'Wei Chen',
    userAvatar: undefined,
    createdAt: '2025-10-08T14:20:00',
    likes: 25,
    replies: [
      {
        id: '2-1',
        discussionId: '2',
        userName: 'Priya',
        userAvatar: undefined,
        content: 'Yes! Been going there for years. Their chili sauce is the best.',
        createdAt: '2025-10-08T15:00:00',
      },
      {
        id: '2-2',
        discussionId: '2',
        userName: 'Marcus',
        userAvatar: undefined,
        content: 'Try their roasted chicken version too, equally good!',
        createdAt: '2025-10-08T16:30:00',
      },
    ],
  },
  {
    id: '3',
    title: 'Marina Bay Spa Weekend Deals',
    businessTag: 'Marina Bay Wellness Spa',
    content: 'Does anyone know if they have weekend promotions? Looking to book a massage for next Saturday.',
    userName: 'Sarah',
    userAvatar: undefined,
    createdAt: '2025-10-07T09:00:00',
    likes: 8,
    replies: [
      {
        id: '3-1',
        discussionId: '3',
        userName: 'David',
        userAvatar: undefined,
        content: 'They usually have a 15% off deal on Sundays. Check their website!',
        createdAt: '2025-10-07T10:30:00',
      },
    ],
  },
];
