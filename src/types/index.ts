export type StudioCategory =
  | 'Photo Studio'
  | 'Sound Stage'
  | 'Film Stage'
  | 'Podcast Room'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Music Studio'
  | 'Art Workshop';

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  address: string;
  imageUrl: string;
  galleryImages: string[];
  amenities: string[];
  overview: string;
  hostName: string;
  hostEmail: string;
  hostAvatar?: string;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioCategory: string;
  studioImage: string;
  hourlyRate: number;
  securityDeposit: number;
  hostEmail: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}
