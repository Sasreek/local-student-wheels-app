
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}

export interface Ride {
  id: string;
  hostId: string;
  hostName: string;
  hostProfilePicture?: string;
  origin: string;
  destination: string;
  dateTime: string;
  availableSeats: number;
  totalSeats: number;
  price?: number;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  userId: string;
  rideId: string;
  bookingTime: string;
  seats: number;
  status: 'confirmed' | 'cancelled';
}
