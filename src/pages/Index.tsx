
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { Calendar, MapPin, Users, Check } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white border-b">
        <div className="container flex justify-between items-center">
          <Logo />
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/signup')}>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Campus rides made <span className="text-primary">simple</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Go Local connects students for safe, affordable, and convenient rides around campus and beyond.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          </div>
          
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Find Your Way</h3>
                  <p className="text-gray-600">Connect with students traveling your way</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Schedule Rides</h3>
                  <p className="text-gray-600">Book rides in advance or host your own</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Split the Cost</h3>
                  <p className="text-gray-600">Save money by sharing rides with fellow students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Go Local?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is built specifically for college students, prioritizing safety, 
              affordability, and community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <Check className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Student Verified</h3>
              <p className="text-gray-600">
                Only verified students with .edu emails can join our platform.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <Check className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Split costs with fellow students instead of paying full price for rides.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <Check className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reduce Carbon Footprint</h3>
              <p className="text-gray-600">
                Share rides to help reduce traffic and carbon emissions on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-12">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Local?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join our community of students sharing rides and making connections.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="mb-4 md:mb-0" />
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Go Local. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
