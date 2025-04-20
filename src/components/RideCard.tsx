
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ride } from '@/types/models';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface RideCardProps {
  ride: Ride;
  onBookClick?: () => void;
  showBookButton?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ 
  ride, 
  onBookClick,
  showBookButton = true
}) => {
  const navigate = useNavigate();
  
  // Format the date and time
  const formattedDate = format(parseISO(ride.dateTime), 'MMM d, yyyy');
  const formattedTime = format(parseISO(ride.dateTime), 'h:mm a');
  
  const handleViewDetails = () => {
    navigate(`/ride/${ride.id}`);
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">
              {ride.origin} to {ride.destination}
            </h3>
            <div className="text-muted-foreground text-sm">{ride.hostName}</div>
          </div>
          <div>
            {ride.status === 'active' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            )}
            {ride.status === 'completed' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Completed
              </Badge>
            )}
            {ride.status === 'cancelled' && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Cancelled
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>From <span className="font-medium">{ride.origin}</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>To <span className="font-medium">{ride.destination}</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{ride.availableSeats} of {ride.totalSeats} seats available</span>
          </div>
          
          {ride.price !== undefined && (
            <div className="font-medium text-accent mt-2">
              ${ride.price.toFixed(2)} per seat
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-muted/20 gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        
        {showBookButton && ride.status === 'active' && ride.availableSeats > 0 && (
          <Button 
            variant="default" 
            size="sm"
            className="flex-1"
            onClick={onBookClick}
          >
            Book Ride
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RideCard;
