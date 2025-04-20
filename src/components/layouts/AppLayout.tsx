
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from '../ui/Logo';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    // In a real app, would clear auth state/token here
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Logo onClick={() => navigate('/dashboard')} className="cursor-pointer" />
          
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <div className="flex flex-1 container px-0 mt-4 md:mt-6 gap-4 md:gap-6">
        {/* Sidebar Navigation */}
        <Card className="hidden md:flex flex-col p-3 w-56 h-fit gap-1 shrink-0 sticky top-20">
          <Button 
            variant={isActive('/dashboard') ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => navigate('/dashboard')}
          >
            <Navigation className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button 
            variant={isActive('/host-ride') ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => navigate('/host-ride')}
          >
            <MapPin className="mr-2 h-5 w-5" />
            Host a Ride
          </Button>
          <Button 
            variant={isActive('/find-rides') ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => navigate('/find-rides')}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Find Rides
          </Button>
          <Button 
            variant={isActive('/ride-history') ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => navigate('/ride-history')}
          >
            <Clock className="mr-2 h-5 w-5" />
            Ride History
          </Button>
        </Card>
        
        {/* Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-10 flex justify-around p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={isActive('/dashboard') ? "text-primary" : ""} 
            onClick={() => navigate('/dashboard')}
          >
            <Navigation className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={isActive('/host-ride') ? "text-primary" : ""} 
            onClick={() => navigate('/host-ride')}
          >
            <MapPin className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={isActive('/find-rides') ? "text-primary" : ""} 
            onClick={() => navigate('/find-rides')}
          >
            <Calendar className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={isActive('/ride-history') ? "text-primary" : ""} 
            onClick={() => navigate('/ride-history')}
          >
            <Clock className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 pb-20 md:pb-6 px-4 md:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
