import React from 'react';
import Header from "@/components/Header";
import Hero from "@/components/JoinForm";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
