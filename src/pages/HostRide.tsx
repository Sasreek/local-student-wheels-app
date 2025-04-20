
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/services/authService';
import { useRideService } from '@/services/rideService';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

const hostRideSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  totalSeats: z.string().min(1, 'Number of seats is required'),
  price: z.string().optional(),
  notes: z.string().optional(),
});

type HostRideFormValues = z.infer<typeof hostRideSchema>;

const HostRide: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRide, isLoading } = useRideService();
  
  const { register, handleSubmit, formState: { errors }, control } = useForm<HostRideFormValues>({
    resolver: zodResolver(hostRideSchema),
    defaultValues: {
      totalSeats: '3',
    }
  });
  
  const onSubmit = async (data: HostRideFormValues) => {
    if (!user) {
      toast.error('You must be logged in to host a ride');
      return;
    }
    
    try {
      // Combine date and time
      const dateTime = `${data.date}T${data.time}`;
      
      // Create ride data
      const rideData = {
        hostId: user.id,
        hostName: user.name,
        hostProfilePicture: user.profilePicture,
        origin: data.origin,
        destination: data.destination,
        dateTime,
        totalSeats: parseInt(data.totalSeats),
        availableSeats: parseInt(data.totalSeats),
        price: data.price ? parseFloat(data.price) : undefined,
        notes: data.notes,
      };
      
      // Create the ride
      const newRide = await createRide(rideData);
      
      toast.success('Ride created successfully!');
      navigate(`/ride/${newRide.id}`);
    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error('Failed to create ride');
    }
  };
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Host a Ride</h1>
        <p className="text-muted-foreground">
          Share your journey with other students
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="origin">Pickup Location</Label>
              <Input
                id="origin"
                placeholder="e.g. University Library"
                {...register('origin')}
              />
              {errors.origin && (
                <p className="text-sm text-red-500">{errors.origin.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g. Downtown Mall"
                {...register('destination')}
              />
              {errors.destination && (
                <p className="text-sm text-red-500">{errors.destination.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={today}
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalSeats">Number of Seats</Label>
              <Controller
                control={control}
                name="totalSeats"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="totalSeats">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 seat</SelectItem>
                      <SelectItem value="2">2 seats</SelectItem>
                      <SelectItem value="3">3 seats</SelectItem>
                      <SelectItem value="4">4 seats</SelectItem>
                      <SelectItem value="5">5 seats</SelectItem>
                      <SelectItem value="6">6 seats</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.totalSeats && (
                <p className="text-sm text-red-500">{errors.totalSeats.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">
                Price per Seat (optional)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  {...register('price')}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">
              Additional Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any details about your ride, what to bring, meetup specifics, etc."
              className="resize-none"
              rows={4}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Ride'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default HostRide;
