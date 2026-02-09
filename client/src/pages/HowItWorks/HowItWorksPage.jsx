import React from 'react';
import Container from '../../components/Container/Container';
import Hero from '../../components/Hero/Hero';
import Ways from '../../components/Ways/Ways';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import FAQ from '../../components/FAQ/FAQ';
import SearchSection from '../../components/SearchSection/SearchSection';
import AtomHeader from '../../components/Header/AtomHeader';
import AtomFooter from '../../components/Footer/AtomFooter';

const HowItWorksPage = () => {
  return (
    <>
      <AtomHeader />
      <div>
        <Container>
          <Hero />
        </Container>
        <Ways />
        <Container>
          <HowItWorks />
        </Container>
        <FAQ />
        <SearchSection />
      </div>
      <AtomFooter />
    </>
  );
};

export default HowItWorksPage;
