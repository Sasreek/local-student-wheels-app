
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/services/authService';
import { useRideService } from '@/services/rideService';
import { Ride } from '@/types/models';
import { MapPin, Calendar, Clock, Users, DollarSign, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast;
  const { user } = useAuth();
  const { getRideById, bookRide, isLoading: serviceLoading } = useRideService();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seats, setSeats] = useState('1');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const rideData = await getRideById(id);
        
        if (!rideData) {
          toast.error('Ride not found');
          navigate('/find-rides');
          return;
        }
        
        setRide(rideData);
      } catch (error) {
        console.error('Error fetching ride details:', error);
        toast.error('Failed to load ride details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRideDetails();
  }, [id, getRideById, navigate, toast]);
  
  // Handle booking
  const handleBookRide = async () => {
    if (!user || !ride) return;
    
    try {
      setIsBooking(true);
      await bookRide(user.id, ride.id, parseInt(seats));
      setIsBookingOpen(false);
      
      // Refresh ride data
      const updatedRide = await getRideById(ride.id);
      if (updatedRide) {
        setRide(updatedRide);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking ride:', error);
    } finally {
      setIsBooking(false);
    }
  };
  
  // Format date and time
  const formattedDate = ride ? format(parseISO(ride.dateTime), 'EEEE, MMMM d, yyyy') : '';
  const formattedTime = ride ? format(parseISO(ride.dateTime), 'h:mm a') : '';
  
  // Check if user is the host
  const isHost = user && ride && user.id === ride.hostId;
  
  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>
      
      {isLoading ? (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ) : ride ? (
        <>
          <Card className="max-w-3xl mx-auto mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {ride.origin} to {ride.destination}
                  </CardTitle>
                  <CardDescription>
                    Hosted by {ride.hostName}
                  </CardDescription>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`
                    ${ride.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    ${ride.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${ride.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                  `}
                >
                  {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex gap-4 items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={ride.hostProfilePicture || ''} />
                  <AvatarFallback>{ride.hostName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{ride.hostName}</div>
                  <div className="text-sm text-muted-foreground">Host</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Pickup Location</div>
                      <div>{ride.origin}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Destination</div>
                      <div>{ride.destination}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div>{formattedDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div>{formattedTime}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Available Seats</div>
                    <div>
                      {ride.availableSeats} of {ride.totalSeats} seats available
                    </div>
                  </div>
                </div>
                
                {ride.price !== undefined && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Price per Seat</div>
                      <div>${ride.price.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {ride.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Additional Notes</h3>
                    <p className="text-muted-foreground">{ride.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter>
              {ride.status === 'active' && !isHost && ride.availableSeats > 0 && (
                <Button 
                  className="w-full" 
                  onClick={() => setIsBookingOpen(true)}
                  disabled={serviceLoading}
                >
                  Book This Ride
                </Button>
              )}
              
              {ride.status === 'active' && isHost && (
                <div className="w-full text-center text-muted-foreground">
                  You are the host of this ride
                </div>
              )}
              
              {ride.status === 'active' && !isHost && ride.availableSeats === 0 && (
                <div className="w-full text-center text-muted-foreground">
                  This ride is fully booked
                </div>
              )}
              
              {ride.status !== 'active' && (
                <div className="w-full text-center text-muted-foreground">
                  This ride is {ride.status}
                </div>
              )}
            </CardFooter>
          </Card>
          
          {/* Booking Dialog */}
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book a Ride</DialogTitle>
                <DialogDescription>
                  Confirm your seat booking for this ride.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Ride Details</h4>
                  <p className="text-sm">
                    {ride.origin} to {ride.destination}
                  </p>
                  <p className="text-sm">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Number of Seats
                  </label>
                  <Select 
                    value={seats} 
                    onValueChange={setSeats}
                    disabled={isBooking}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select seats" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(ride.availableSeats, 4) }, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'seat' : 'seats'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {ride.price !== undefined && (
                  <div className="text-sm">
                    <span className="font-medium">Total Price: </span>
                    ${(ride.price * parseInt(seats)).toFixed(2)}
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsBookingOpen(false)}
                  disabled={isBooking}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBookRide}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Ride not found</h2>
          <p className="text-muted-foreground mb-6">
            The ride you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/find-rides')}>
            Browse Available Rides
          </Button>
        </div>
      )}
    </div>
  );
};

export default RideDetails;
