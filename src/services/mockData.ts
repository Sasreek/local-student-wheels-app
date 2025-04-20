
import { User, Ride, Booking } from '../types/models';
import { addDays, format, subDays } from 'date-fns';

// Mock Users
export const users: User[] = [
  {
    id: 'user1',
    email: 'john@university.edu',
    name: 'John Smith',
    profilePicture: '/placeholder.svg',
  },
  {
    id: 'user2',
    email: 'emma@university.edu',
    name: 'Emma Johnson',
    profilePicture: '/placeholder.svg',
  },
];

// Mock active rides
export const activeRides: Ride[] = [
  {
    id: 'ride1',
    hostId: 'user2',
    hostName: 'Emma Johnson',
    hostProfilePicture: '/placeholder.svg',
    origin: 'University Library',
    destination: 'Downtown Shopping Mall',
    dateTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    availableSeats: 3,
    totalSeats: 4,
    price: 5,
    notes: 'Meeting at the library entrance. I have space for small bags.',
    status: 'active',
  },
  {
    id: 'ride2',
    hostId: 'user1',
    hostName: 'John Smith',
    hostProfilePicture: '/placeholder.svg',
    origin: 'Student Housing Complex',
    destination: 'Airport',
    dateTime: format(addDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
    availableSeats: 2,
    totalSeats: 3,
    price: 15,
    notes: 'Early morning ride to catch flights. Can help with luggage.',
    status: 'active',
  },
  {
    id: 'ride3',
    hostId: 'user2',
    hostName: 'Emma Johnson',
    hostProfilePicture: '/placeholder.svg',
    origin: 'University Center',
    destination: 'Concert Hall',
    dateTime: format(addDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm"),
    availableSeats: 3,
    totalSeats: 3,
    price: 7,
    notes: 'Going to the jazz festival! Looking for fellow music lovers.',
    status: 'active',
  },
];

// Mock past rides
export const pastRides: Ride[] = [
  {
    id: 'ride4',
    hostId: 'user1',
    hostName: 'John Smith',
    hostProfilePicture: '/placeholder.svg',
    origin: 'Campus Center',
    destination: 'Football Stadium',
    dateTime: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm"),
    availableSeats: 0,
    totalSeats: 4,
    price: 4,
    status: 'completed',
  },
  {
    id: 'ride5',
    hostId: 'user2',
    hostName: 'Emma Johnson',
    hostProfilePicture: '/placeholder.svg',
    origin: 'Student Union',
    destination: 'Beach',
    dateTime: format(subDays(new Date(), 10), "yyyy-MM-dd'T'HH:mm"),
    availableSeats: 0,
    totalSeats: 3,
    price: 8,
    status: 'cancelled',
  },
];

// Mock bookings
export const bookings: Booking[] = [
  {
    id: 'booking1',
    userId: 'user1',
    rideId: 'ride1',
    bookingTime: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
    seats: 1,
    status: 'confirmed',
  },
];

// All rides (active + past)
export const allRides: Ride[] = [...activeRides, ...pastRides];

// Mock user (for testing the logged-in state)
export const currentUser: User = users[0]; // Using John Smith as the current user
