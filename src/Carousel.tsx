import * as React from 'react';
import CarouselContext from './CarouselContext';

const DEFAULT_SLIDING_THRESHOLD = 1 / 2;
const DEFAULT_SLIDES_TO_SHOW = 3;
const DEFAULT_INFINITE = false;

interface CarouselProps {
  initialIndex?: number;
  slidesToShow?: number;
  slideThreshold?: number;
  infinite?: boolean;
}

const Carousel: React.FC<CarouselProps> = React.memo(
  ({
    children,
    initialIndex = 0,
    slidesToShow = DEFAULT_SLIDES_TO_SHOW,
    slideThreshold = DEFAULT_SLIDING_THRESHOLD,
    infinite = DEFAULT_INFINITE,
  }) => {
    const [sliderIndex, setSliderIndex] = React.useState(initialIndex);
    const [slideCount, setSlideCount] = React.useState(0);
    const nextSlide = React.useMemo(() => {
      return () => {
        if (!infinite) {
          setSliderIndex(index =>
            Math.min(index + 1, slideCount - slidesToShow)
          );
        } else {
          setSliderIndex(index => index + 1);
        }
      };
    }, [setSliderIndex, slideCount, infinite]);

    const prevSlide = React.useMemo(() => {
      return () => {
        if (!infinite) {
          setSliderIndex(index => Math.max(index - 1, 0));
        } else {
          setSliderIndex(index => index - 1);
        }
      };
    }, [setSliderIndex, sliderIndex, slideCount, infinite]);

    const goTo = React.useMemo(
      () => (index: number) => {
        setSliderIndex(index);
      },
      [setSliderIndex]
    );

    return (
      <CarouselContext.Provider
        value={{
          nextSlide,
          prevSlide,
          goTo,
          slideCount,
          slidesToShow,
          slideThreshold,
          infinite,
          setSlideCount,
          currentIndex: sliderIndex,
        }}
      >
        <div>SlideIndex: {sliderIndex}</div>
        {children}
      </CarouselContext.Provider>
    );
  }
);

export default Carousel;
