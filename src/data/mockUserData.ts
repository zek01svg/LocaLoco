import { User } from '../types/user';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'user', // ✅ ADD THIS - Required property
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', // ✅ Optional but recommended
  memberSince: '2024-01-15',
  bio: 'Local food enthusiast and supporter of small businesses. Always on the lookout for hidden gems in the community!',
  location: 'Downtown District',
};
