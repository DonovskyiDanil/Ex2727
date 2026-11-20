import React from 'react';
import Hero from '../../components/Hero/Hero';
import Ways from '../../components/Ways/Ways';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import FAQ from '../../components/FAQ/FAQ';
import SearchSection from '../../components/SearchSection/SearchSection';

const HowItWorksPage = () => {
  return (
    <>
      <main>
        <Hero />
        <Ways />
        <HowItWorks />
        <FAQ />
        <SearchSection />
      </main>
    </>
  );
};

export default HowItWorksPage;
