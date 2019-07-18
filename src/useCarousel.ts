import * as React from 'react';

import CarouselContext from './CarouselContext';

export default function useCarousel() {
  const {
    goTo,
    nextSlide,
    prevSlide,
    slideCount,
    currentIndex,
    slidesToShow,
  } = React.useContext(CarouselContext);

  return { goTo, nextSlide, prevSlide, slideCount, currentIndex, slidesToShow };
}
