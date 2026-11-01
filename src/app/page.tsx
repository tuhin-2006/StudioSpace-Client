import React from 'react';
import { HeroSlider } from '@/components/HeroSlider';
import { CategoryCards } from '@/components/CategoryCards';
import { FeaturedStudiosSection } from '@/components/FeaturedStudiosSection';
import { HowBookingWorksSection, HostGuaranteeSection } from '@/components/ExtraHomeSections';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Slider Banner (Interactive slider with 3 slides) */}
      <HeroSlider />

      {/* 2. Browse by Studio Categories */}
      <CategoryCards />

      {/* 3. Featured Studios Section (Dynamically fetched from MongoDB limit 6) */}
      <FeaturedStudiosSection />

      {/* 4. Extra Section 1: How Booking Works (4-step workflow) */}
      <HowBookingWorksSection />

      {/* 5. Extra Section 2: Host Guarantee & Creator Support */}
      <HostGuaranteeSection />
    </div>
  );
}
