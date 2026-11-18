import React from 'react';
<<<<<<< HEAD
=======
import Container from '../../components/Container/Container';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import Hero from '../../components/Hero/Hero';
import Ways from '../../components/Ways/Ways';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import FAQ from '../../components/FAQ/FAQ';
import SearchSection from '../../components/SearchSection/SearchSection';
<<<<<<< HEAD
=======
import AtomHeader from '../../components/Header/AtomHeader';
import AtomFooter from '../../components/Footer/AtomFooter';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

const HowItWorksPage = () => {
  return (
    <>
<<<<<<< HEAD
      <main>
        <Hero />
        <Ways />
        <HowItWorks />
        <FAQ />
        <SearchSection />
      </main>
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    </>
  );
};

export default HowItWorksPage;
