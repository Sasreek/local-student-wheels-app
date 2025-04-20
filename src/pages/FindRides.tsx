
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRideService } from '@/services/rideService';
import { Ride } from '@/types/models';
import RideCard from '@/components/RideCard';

const FindRides: React.FC = () => {
  const navigate = useNavigate();
  const { getAvailableRides } = useRideService();
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  // Load initial rides on component mount
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setIsLoading(true);
        const availableRides = await getAvailableRides();
        setRides(availableRides);
      } catch (error) {
        console.error('Error fetching rides:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRides();
  }, [getAvailableRides]);
  
  // Handle search
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      // Call getAvailableRides without parameters and filter client-side
      const allRides = await getAvailableRides();
      
      // Filter rides based on the search criteria
      const filteredRides = allRides.filter(ride => {
        const matchesDate = !date || (ride.dateTime && new Date(ride.dateTime).toDateString() === date.toDateString());
        const matchesOrigin = !origin.trim() || ride.origin.toLowerCase().includes(origin.toLowerCase());
        const matchesDestination = !destination.trim() || ride.destination.toLowerCase().includes(destination.toLowerCase());
        
        return matchesDate && matchesOrigin && matchesDestination;
      });
      
      setRides(filteredRides);
    } catch (error) {
      console.error('Error searching rides:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear filters
  const handleClearFilters = async () => {
    setDate(undefined);
    setOrigin('');
    setDestination('');
    
    try {
      setIsLoading(true);
      const allRides = await getAvailableRides();
      setRides(allRides);
    } catch (error) {
      console.error('Error clearing filters:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Find Rides</h1>
        <p className="text-muted-foreground">
          Search for available rides to your destination
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Rides</CardTitle>
          <CardDescription>Filter rides by date and location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <Input
                id="origin"
                placeholder="Starting point"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isLoading}
          >
            Clear Filters
          </Button>
          <Button
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Rides</h2>
        <div className="text-sm text-muted-foreground">
          {rides.length} {rides.length === 1 ? 'ride' : 'rides'} found
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="h-24 animate-pulse bg-muted rounded-md mb-3" />
              <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md mb-2" />
              <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
            </Card>
          ))
        ) : rides.length > 0 ? (
          // Ride cards
          rides.map(ride => (
            <RideCard 
              key={ride.id} 
              ride={ride} 
              onBookClick={() => navigate(`/ride/${ride.id}`)}
            />
          ))
        ) : (
          // No rides found
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No rides found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters or host a ride yourself.
            </p>
            <Button onClick={() => navigate('/host-ride')}>
              Host a Ride
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRides;
