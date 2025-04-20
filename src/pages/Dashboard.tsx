
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/services/authService';
import { useRideService } from '@/services/rideService';
import { Ride } from '@/types/models';
import RideCard from '@/components/RideCard';
import { MapPin, Calendar, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserHostedRides, getUserBookedRides, getAvailableRides } = useRideService();
  
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [hostedRides, setHostedRides] = useState<Ride[]>([]);
  const [bookedRides, setBookedRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get upcoming rides
        const availableRides = await getAvailableRides();
        setUpcomingRides(availableRides.slice(0, 3)); // Just show first 3
        
        // Get user's hosted rides
        const hosted = await getUserHostedRides(user.id);
        setHostedRides(hosted);
        
        // Get user's booked rides
        const booked = await getUserBookedRides(user.id);
        setBookedRides(booked);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, getAvailableRides, getUserHostedRides, getUserBookedRides]);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Student'}!
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={() => navigate('/host-ride')}>
            Host a Ride
          </Button>
          <Button variant="outline" onClick={() => navigate('/find-rides')}>
            Find Rides
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Quick Host
            </CardTitle>
            <CardDescription>Create a new ride</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Share your next journey with fellow students and help others get where they need to go.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/host-ride')}>
              Host a Ride
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Quick Find
            </CardTitle>
            <CardDescription>Find available rides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse available rides to your destination and book a seat in just a few clicks.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => navigate('/find-rides')}>
              Find Rides
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              History
            </CardTitle>
            <CardDescription>View your ride history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access your past rides and bookings to track your travel history.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => navigate('/ride-history')}>
              View History
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
          <TabsTrigger value="hosted">My Hosted Rides</TabsTrigger>
          <TabsTrigger value="booked">My Booked Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="h-24 animate-pulse bg-muted rounded-md mb-3" />
                  <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md mb-2" />
                  <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
                </Card>
              ))
            ) : upcomingRides.length > 0 ? (
              upcomingRides.map(ride => (
                <RideCard 
                  key={ride.id} 
                  ride={ride} 
                  onBookClick={() => navigate(`/ride/${ride.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No upcoming rides available</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/find-rides')}
                >
                  Browse all rides
                </Button>
              </div>
            )}
          </div>
          
          {upcomingRides.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button variant="link" onClick={() => navigate('/find-rides')}>
                View all available rides
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="hosted" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array(2).fill(0).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="h-24 animate-pulse bg-muted rounded-md mb-3" />
                  <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md mb-2" />
                  <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
                </Card>
              ))
            ) : hostedRides.length > 0 ? (
              hostedRides.map(ride => (
                <RideCard 
                  key={ride.id} 
                  ride={ride}
                  showBookButton={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">You haven't hosted any rides yet</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/host-ride')}
                >
                  Host your first ride
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="booked" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array(2).fill(0).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="h-24 animate-pulse bg-muted rounded-md mb-3" />
                  <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md mb-2" />
                  <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
                </Card>
              ))
            ) : bookedRides.length > 0 ? (
              bookedRides.map(ride => (
                <RideCard 
                  key={ride.id} 
                  ride={ride}
                  showBookButton={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">You haven't booked any rides yet</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/find-rides')}
                >
                  Find and book a ride
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
