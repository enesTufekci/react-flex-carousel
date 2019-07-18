import * as React from 'react';

interface CarouselContextValue {
  nextSlide: VoidFunction;
  prevSlide: VoidFunction;
  goTo: (index: number) => void;
  setSlideCount: (count: number) => void;
  currentIndex: number;
  slidesToShow: number;
  slideCount: number;
  slideThreshold: number;
  infinite: boolean;
}

const CarouselContext = React.createContext<CarouselContextValue>({} as any);

export default CarouselContext;
