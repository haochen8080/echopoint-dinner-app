import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-gray-900">EchoPoint</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </a>
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Login
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => window.location.href = '/join'}>
              Join Now
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </a>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>
                Login
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white w-full" onClick={() => window.location.href = '/join'}>
                Join Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
