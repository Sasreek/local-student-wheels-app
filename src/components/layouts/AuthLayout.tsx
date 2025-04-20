
import React from 'react';
import { Card } from "@/components/ui/card";
import Logo from '../ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700">
            Campus ride-sharing made simple
          </h2>
        </div>
        <Card className="w-full p-6 shadow-lg border-none">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
