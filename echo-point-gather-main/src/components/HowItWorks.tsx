
import { Card } from "@/components/ui/card";
import { Mail, User, Calendar, CreditCard, Users, Utensils } from "lucide-react";

const steps = [
  {
    icon: Mail,
    title: "Sign Up",
    description: "Register with your university email (.edu) to verify student status",
    color: "text-primary"
  },
  {
    icon: User,
    title: "Create Profile",
    description: "Add your WeChat ID and basic info for group matching",
    color: "text-accent"
  },
  {
    icon: Calendar,
    title: "Choose Date",
    description: "Select Saturday or Sunday dinners that work for your schedule",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Get Matched",
    description: "Our algorithm creates diverse groups of 4-6 people",
    color: "text-accent"
  },
  {
    icon: CreditCard,
    title: "Confirm & Pay",
    description: "Secure your spot with payment ($9.99 one-time or $14.99/month)",
    color: "text-primary"
  },
  {
    icon: Utensils,
    title: "Enjoy Dinner",
    description: "Meet your group at the restaurant and make new connections!",
    color: "text-accent"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to join meaningful dinner conversations with fellow students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              
              <step.icon className={`h-12 w-12 ${step.color} mb-6`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
