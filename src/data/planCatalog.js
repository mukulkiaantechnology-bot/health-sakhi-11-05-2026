export const PLAN_STORAGE_KEY = 'hs_admin_plans';
export const MEMBER_PLAN_KEY = 'hs_member_plan';
export const RECEIPT_STORAGE_KEY = 'hs_payment_receipts';

export const defaultPlans = [
  {
    id: 'PLN-01',
    name: 'Free Sakhi',
    price: '0',
    duration: 'Lifetime',
    status: 'Active',
    members: 1240,
    videos: '10',
    books: '1',
    advisorSessions: '0/month',
    aiSakhiChat: false,
    shortDescription: 'Start your wellness journey with core essentials.',
    highlightTag: 'Starter',
    features: [
      'Access to 10 free videos',
      'AI Sakhi (5 chats/day)',
      '1 free healing book',
      'Mood tracker (basic)',
      'Community access'
    ]
  },
  {
    id: 'PLN-02',
    name: 'Premium Pro',
    price: '1799',
    duration: '12 Months',
    status: 'Active',
    members: 342,
    videos: 'Unlimited',
    books: '50+',
    advisorSessions: '1/month',
    aiSakhiChat: true,
    shortDescription: 'Most loved complete healing package for daily growth.',
    highlightTag: 'Most Popular',
    features: [
      'Unlimited videos & courses',
      'AI Sakhi (unlimited chats)',
      'Full book library (50+ books)',
      'Mood tracker + history',
      '1 advisor session/month',
      'Personalized healing plan',
      'Exclusive wellness programs'
    ]
  },
  {
    id: 'PLN-03',
    name: 'Advisor Connect+',
    price: '2499',
    duration: '12 Months',
    status: 'Inactive',
    members: 0,
    videos: 'Unlimited',
    books: 'Unlimited',
    advisorSessions: '4/month',
    aiSakhiChat: true,
    shortDescription: 'Advanced care with premium advisor and support access.',
    highlightTag: 'Advanced',
    features: [
      'Everything in Premium Pro',
      '4 advisor sessions/month',
      'Priority AI Sakhi support',
      'Custom nutrition plans',
      'Exclusive masterclasses',
      '1-on-1 wellness coaching'
    ]
  }
];
