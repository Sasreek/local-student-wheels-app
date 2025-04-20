import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Ride } from '@/types/models';

// Database ride and booking mapping
const mapDbRide = (db: any): Ride => ({
  id: db.id,
  hostId: db['driver id'],
  hostName: '', // Not available unless profiles are implemented
  hostProfilePicture: '', // Not available unless profiles are implemented
  origin: db.origin || db['from'] || '',
  destination: db.to || '',
  dateTime: db.date_time || db.date || db.time || '',
  availableSeats: db.seats || 0,
  totalSeats: db.seats || 0,
  price: db.price !== undefined && db.price !== null ? Number(db.price) : undefined,
  notes: db.notes || '',
  status: db.status || 'active',
});

const mapDbBooking = (db: any) => ({
  id: db.id,
  userId: db.userId,
  rideId: db.rideId,
  bookingTime: db.created_at || '',
  seats: db.numPassengers || 1,
  status: db.status || 'confirmed',
});

// Redefine CreateRideInput with simple, direct types to avoid deep instantiation
interface CreateRideInput {
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
}

export const useRideService = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Get all available rides (from rides table)
  const getAvailableRides = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*');
      if (error) throw error;
      return (data || []).map(mapDbRide);
    } finally {
      setIsLoading(false);
    }
  };

  // Get one ride by ID
  const getRideById = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) return undefined;
      return mapDbRide(data);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's hosted rides (rides.driver id = user.id)
  const getUserHostedRides = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver id', userId);
      if (error) throw error;
      return (data || []).map(mapDbRide);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's bookings, and the rides for them
  const getUserBookedRides = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', userId)
        .eq('status', 'confirmed');
      if (bookingsError) throw bookingsError;
      const rideIds = (bookingsData || []).map((b: any) => b.rideId);
      if (rideIds.length === 0) return [];

      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .in('id', rideIds);
      if (ridesError) throw ridesError;

      return (ridesData || []).map(mapDbRide);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new ride (host ride)
  const createRide = async (rideData: CreateRideInput) => {
    setIsLoading(true);

    try {
      const rideToInsert = {
        "driver id": rideData.hostId,
        origin: rideData.origin,
        to: rideData.destination,
        date_time: rideData.dateTime,
        seats: rideData.totalSeats,
        price: rideData.price,
        notes: rideData.notes,
        status: 'active',
      };

      // DEBUG: Output the ride data to ensure "driver id" is the user's id
      console.log('[createRide] rideToInsert:', rideToInsert);

      const { data, error } = await supabase
        .from('rides')
        .insert([rideToInsert])
        .select()
        .single();
      if (error) throw error;
      toast.success('Ride created successfully!');
      return mapDbRide(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create ride');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Book a ride
  const bookRide = async (userId: string, rideId: string, seats: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('bookings').insert([{
        userId,
        rideId,
        numPassengers: seats,
        status: 'confirmed',
      }]);
      if (error) throw error;
      toast.success('Ride booked successfully!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to book ride');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a booking (by id)
  const cancelBooking = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      if (error) throw error;
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
