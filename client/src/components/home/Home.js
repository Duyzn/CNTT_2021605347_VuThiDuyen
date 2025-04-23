import React from 'react';
import HomeSlider from './HomeSlider';
import FeaturesList from './FeaturesList';
import ProductSection from './ProductSection';
import CartBanner from './CartBanner';
import TestimonialSection from './TestimonialSection';
import LogoCarousel from './LogoCarousel';

function Home() {
  return (
    <>
      <HomeSlider />
      <FeaturesList />
      <ProductSection />
      <CartBanner />
      <TestimonialSection />
      <LogoCarousel />
    </>
  );
}

export default Home;