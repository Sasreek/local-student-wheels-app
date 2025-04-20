
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/services/authService';
import { useRideService } from '@/services/rideService';
import { Ride } from '@/types/models';
import RideCard from '@/components/RideCard';

const RideHistory: React.FC = () => {
  const { user } = useAuth();
  const { getUserHostedRides, getUserBookedRides } = useRideService();
  
  const [hostedRides, setHostedRides] = useState<Ride[]>([]);
  const [bookedRides, setBookedRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRideHistory = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get user's hosted rides
        const hosted = await getUserHostedRides(user.id);
        setHostedRides(hosted);
        
        // Get user's booked rides
        const booked = await getUserBookedRides(user.id);
        setBookedRides(booked);
      } catch (error) {
        console.error('Error fetching ride history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRideHistory();
  }, [user, getUserHostedRides, getUserBookedRides]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Ride History</h1>
        <p className="text-muted-foreground">
          View your past and upcoming rides
        </p>
      </div>
      
      <Tabs defaultValue="hosted" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hosted">Rides You Hosted</TabsTrigger>
          <TabsTrigger value="booked">Rides You Booked</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hosted" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="h-24 animate-pulse bg-muted rounded-md mb-3" />
                  <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md mb-2" />
                  <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
                </Card>
              ))
            ) : hostedRides.length > 0 ? (
              // Hosted ride cards
              hostedRides.map(ride => (
                <RideCard key={ride.id} ride={ride} showBookButton={false} />
              ))
            ) : (
              // No hosted rides
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No hosted rides yet</h3>
                <p className="text-muted-foreground">
                  You haven't hosted any rides yet. Host a ride to see it here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="booked" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="h-24 animate-pulse bg-muted rounded-md mb-3" />
                  <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md mb-2" />
                  <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
                </Card>
              ))
            ) : bookedRides.length > 0 ? (
              // Booked ride cards
              bookedRides.map(ride => (
                <RideCard key={ride.id} ride={ride} showBookButton={false} />
              ))
            ) : (
              // No booked rides
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No booked rides yet</h3>
                <p className="text-muted-foreground">
                  You haven't booked any rides yet. Find and book a ride to see it here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RideHistory;
