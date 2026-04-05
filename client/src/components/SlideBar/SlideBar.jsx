import React, { useMemo, useRef, useEffect, useState } from 'react';
import Flickity from 'react-flickity-component';
import style from './SlideBar.module.sass';
import carouselConstants from '../../carouselConstants';
import './flickity.css';

const SliderBar = props => {
  const { images, carouselType } = props;
  const flickityRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const options = useMemo(() => ({
    draggable: true,
    wrapAround: true,
    pageDots: false,
    prevNextButtons: true,
    autoPlay: true,
    groupCells: true,
    lazyLoad: true,
  }), []);

  // Validate images - must be a non-empty array or object
  const hasValidImages = useMemo(() => {
    if (!images) return false;
    if (Array.isArray(images)) return images.length > 0;
    if (typeof images === 'object') return Object.keys(images).length > 0;
    return false;
  }, [images]);

  // Validate carouselType and get className
  const className = useMemo(() => {
    if (!carouselType) return '';
    switch (carouselType) {
      case carouselConstants.MAIN_SLIDER:
        return style.mainCarousel || '';
      case carouselConstants.EXAMPLE_SLIDER:
        return style.exampleCarousel || '';
      case carouselConstants.FEEDBACK_SLIDER:
        return style.feedbackCarousel || '';
      default:
        return '';
    }
  }, [carouselType, style]);

  // Render slides based on carouselType
  const slides = useMemo(() => {
    if (!hasValidImages || !carouselType) return null;
    
    const imageKeys = Array.isArray(images) 
      ? images.map((_, i) => i.toString()) 
      : Object.keys(images);
    
    switch (carouselType) {
      case carouselConstants.MAIN_SLIDER:
        return imageKeys.map((key, index) => (
          <img
            src={images[key]}
            alt="slide"
            key={index}
            className={style['carousel-cell']}
          />
        ));
      case carouselConstants.EXAMPLE_SLIDER:
        return imageKeys.map((key, index) => (
          <div className={style['example-cell']} key={index}>
            <img src={images[key]} alt="slide" />
            <p>{carouselConstants.EXAMPLE_SLIDER_TEXT[index]}</p>
          </div>
        ));
      case carouselConstants.FEEDBACK_SLIDER:
        return imageKeys.map((key, index) => (
          <div className={style['feedback-cell']} key={index}>
            <img src={images[key]} alt="slide" />
            <p>{carouselConstants.FEEDBACK_SLIDER_TEXT[index].feedback}</p>
            <span>{carouselConstants.FEEDBACK_SLIDER_TEXT[index].name}</span>
          </div>
        ));
      default:
        return null;
    }
  }, [images, carouselType, hasValidImages, style]);

  // Don't render if we don't have valid images or className
  if (!hasValidImages || !className || !slides) {
    return null;
  }

  // Handle Flickity initialization
  useEffect(() => {
    // Set a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle Flickity events
  const handleFlickityReady = () => {
    console.log('Flickity ready for carousel:', carouselType);
  };

  const handleFlickityError = (error) => {
    console.warn('Flickity error for carousel:', carouselType, error);
  };

  if (!isReady) {
    return null;
  }

  return (
    <Flickity
      ref={flickityRef}
      className={className}
      elementType="div"
      options={options}
      on={handleFlickityReady}
      onError={handleFlickityError}
    >
      {slides}
    </Flickity>
  );
};

export default SliderBar;
