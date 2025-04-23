import React from 'react';
import BreadcrumbSection from './BreadcrumbSection';
import FeaturedSection from './FeaturedSection';
import AboutSection from './AboutSection';
import TeamSection from './TeamSection';
import TestimonialSection from '../home/TestimonialSection';
import LogoCarousel from '../home/LogoCarousel';

function About() {
  // Sử dụng useEffect để scroll to top khi component mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Breadcrumb section */}
      <BreadcrumbSection />

      {/* Featured section */}
      <FeaturedSection />

      {/* About section */}
      <AboutSection />

      {/* Team section */}
      <TeamSection />

      {/* Testimonial section - tái sử dụng từ Home */}
      <TestimonialSection />

      {/* Logo carousel - tái sử dụng từ Home */}
      <LogoCarousel />
    </>
  );
}

export default About;