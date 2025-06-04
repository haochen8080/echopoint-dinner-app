
import { Card } from "@/components/ui/card";
import { Heart, Globe, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why EchoPoint?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe great conversations happen over great food. EchoPoint creates 
            meaningful connections for Chinese university students through carefully 
            curated dinner experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Built for Community
            </h3>
            <p className="text-gray-600 mb-6">
              As Chinese students studying abroad, we understand the importance of 
              finding your community. EchoPoint bridges the gap between online 
              connections and real-world friendships.
            </p>
            <p className="text-gray-600">
              Our smart matching algorithm ensures you meet new people each time 
              while keeping group sizes intimate and conversations meaningful.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <Heart className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Community First</h4>
              <p className="text-sm text-gray-600">Building lasting friendships</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5">
              <Globe className="h-8 w-8 text-accent mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Cultural Bridge</h4>
              <p className="text-sm text-gray-600">Connecting shared experiences</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5">
              <Shield className="h-8 w-8 text-accent mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Safe Space</h4>
              <p className="text-sm text-gray-600">Verified university students</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <Sparkles className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Quality Matches</h4>
              <p className="text-sm text-gray-600">Smart algorithm pairing</p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Students Connected</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">150+</div>
            <div className="text-gray-600">Dinner Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-gray-600">Partner Restaurants</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
