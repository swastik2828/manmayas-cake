import { Review } from '../types';

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-pragnya',
    name: 'Pragnya',
    rating: 5,
    timeAgo: '2 months ago',
    verified: true,
    reviewText: 'Had a wonderful experience! The birthday cake was beautiful, fresh, and tasted amazing. Everything was perfect. Thank you so much!',
    occasionTag: 'Birthday Celebration',
    source: 'Google Maps',
    highlight: 'Beautiful, fresh, and tasted amazing'
  },
  {
    id: 'rev-amrita',
    name: 'Amrita Priyadarshini',
    rating: 5,
    timeAgo: '4 months ago',
    verified: true,
    reviewText: 'The cake is really delicious and fresh. Loved the cake. I would recommend all to taste the cake.',
    occasionTag: 'Family Celebration',
    source: 'Google Maps',
    highlight: 'Really delicious and fresh'
  },
  {
    id: 'rev-prangya-panda',
    name: 'Prangya Panda',
    rating: 5,
    timeAgo: '6 months ago',
    verified: true,
    reviewText: 'Cake was very tasty nd nice',
    occasionTag: 'Birthday Cake',
    source: 'Google Maps',
    highlight: 'Very tasty nd nice'
  },
  {
    id: 'rev-subhashree',
    name: 'Subhashree Das',
    rating: 5,
    timeAgo: '1 month ago',
    verified: true,
    reviewText: 'Ordered the Feather Wings signature cake for our daughter’s birthday. The design was breathtaking and the eggless vanilla sponge was so moist. Truly top-tier bakery work in Kavisuryanagar!',
    occasionTag: '1st Birthday Celebration',
    source: 'Google Maps',
    highlight: 'Feather Wings design was breathtaking'
  },
  {
    id: 'rev-bikash',
    name: 'Bikash Tripathy',
    rating: 5,
    timeAgo: '3 months ago',
    verified: true,
    reviewText: 'Best bakery experience in Boirani & Kavisuryanagar. Punctual delivery, very polite communication on phone, and the Belgian chocolate truffle was rich without being overly sugary.',
    occasionTag: 'Anniversary Surprise',
    source: 'Google Maps',
    highlight: 'Best bakery experience in Boirani & Kavisuryanagar'
  },
  {
    id: 'rev-ananya',
    name: 'Ananya Rath',
    rating: 5,
    timeAgo: '5 months ago',
    verified: true,
    reviewText: 'We needed a 100% pure vegetarian cake for a religious celebration at home. They took special care with eggless preparation and hygiene. Everyone in the family loved it!',
    occasionTag: 'Pure Veg Celebration',
    source: 'Google Maps',
    highlight: 'Special care with pure vegetarian preparation'
  }
];

export const GOOGLE_RATING_SUMMARY = {
  score: 5.0,
  totalReviews: 66,
  fiveStarPercentage: 100,
  verifiedAsOf: 'Verified from Google Maps listing',
  mapsUrl: "https://www.google.com/maps/place/Manmaya's+CAKE+DELIGHTS/@19.5851882,84.7441104,17z/data=!3m1!4b1!4m6!3m5!1s0x3a22b324f12b7ac1:0x4967568dd28a741d!8m2!3d19.5851832!4d84.7466853!16s%2Fg%2F11msfsygss",
  address: 'Krupasindu Nagar Road, Kavisuryanagar, Boirani, Odisha 761104'
};
