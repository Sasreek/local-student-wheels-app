
import { useState } from 'react';
import { Ride, Booking } from '../types/models';
import { activeRides, pastRides, allRides, bookings as mockBookings } from './mockData';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

interface RideFilters {
  date?: Date;
  origin?: string;
  destination?: string;
}

export const useRideService = () => {
  const [rides, setRides] = useState<Ride[]>(allRides);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isLoading, setIsLoading] = useState(false);

  // Get all available rides
  const getAvailableRides = async (filters?: RideFilters): Promise<Ride[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredRides = [...activeRides];
      
      // Apply filters if provided
      if (filters) {
        if (filters.date) {
          const dateStr = format(filters.date, 'yyyy-MM-dd');
          filteredRides = filteredRides.filter(ride => 
            ride.dateTime.startsWith(dateStr)
          );
        }
        
        if (filters.origin) {
          const origin = filters.origin.toLowerCase();
          filteredRides = filteredRides.filter(ride => 
            ride.origin.toLowerCase().includes(origin)
          );
        }
        
        if (filters.destination) {
          const destination = filters.destination.toLowerCase();
          filteredRides = filteredRides.filter(ride => 
            ride.destination.toLowerCase().includes(destination)
          );
        }
      }
      
      return filteredRides;
    } finally {
      setIsLoading(false);
    }
  };

  // Get ride by ID
  const getRideById = async (id: string): Promise<Ride | undefined> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return rides.find(ride => ride.id === id);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's hosted rides
  const getUserHostedRides = async (userId: string): Promise<Ride[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return rides.filter(ride => ride.hostId === userId);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's booked rides
  const getUserBookedRides = async (userId: string): Promise<Ride[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get all booking IDs for this user
      const userBookingIds = bookings
        .filter(booking => booking.userId === userId && booking.status === 'confirmed')
        .map(booking => booking.rideId);
      
      // Return all rides that match those IDs
      return rides.filter(ride => userBookingIds.includes(ride.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new ride
  const createRide = async (rideData: Omit<Ride, 'id' | 'status'>): Promise<Ride> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new ride with a random ID
      const newRide: Ride = {
        ...rideData,
        id: `ride${rides.length + 1}`,
        status: 'active',
      };
      
      // Update state
      setRides(prevRides => [...prevRides, newRide]);
      
      toast.success('Ride created successfully!');
      return newRide;
    } catch (error) {
      toast.error('Failed to create ride');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Book a ride
  const bookRide = async (userId: string, rideId: string, seats: number): Promise<Booking> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the ride
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      if (rideIndex === -1) {
        throw new Error('Ride not found');
      }
      
      const ride = rides[rideIndex];
      
      // Check if enough seats are available
      if (ride.availableSeats < seats) {
        throw new Error('Not enough seats available');
      }
      
      // Update the ride with reduced seats
      const updatedRide = {
        ...ride,
        availableSeats: ride.availableSeats - seats,
      };
      
      // Create a new booking
      const newBooking: Booking = {
        id: `booking${bookings.length + 1}`,
        userId,
        rideId,
        bookingTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        seats,
        status: 'confirmed',
      };
      
      // Update state
      setRides(prevRides => {
        const newRides = [...prevRides];
        newRides[rideIndex] = updatedRide;
        return newRides;
      });
      
      setBookings(prevBookings => [...prevBookings, newBooking]);
      
      toast.success('Ride booked successfully!');
      return newBooking;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to book ride');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the booking
      const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      const booking = bookings[bookingIndex];
      
      // Find the ride
      const rideIndex = rides.findIndex(ride => ride.id === booking.rideId);
      if (rideIndex === -1) {
        throw new Error('Ride not found');
      }
      
      const ride = rides[rideIndex];
      
      // Update the ride with restored seats
      const updatedRide = {
        ...ride,
        availableSeats: ride.availableSeats + booking.seats,
      };
      
      // Update the booking status
      const updatedBooking = {
        ...booking,
        status: 'cancelled' as const,
      };
      
      // Update state
      setRides(prevRides => {
        const newRides = [...prevRides];
        newRides[rideIndex] = updatedRide;
        return newRides;
      });
      
      setBookings(prevBookings => {
        const newBookings = [...prevBookings];
        newBookings[bookingIndex] = updatedBooking;
        return newBookings;
      });
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to cancel booking');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rides,
    bookings,
    isLoading,
    getAvailableRides,
    getRideById,
    getUserHostedRides,
    getUserBookedRides,
    createRide,
    bookRide,
    cancelBooking,
  };
};
