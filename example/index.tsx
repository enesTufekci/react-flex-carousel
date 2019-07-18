import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Carousel, Slides, useCarousel } from '../dist';

const Slide: React.FC<{ color: string }> = ({ color, children }) => {
  return (
    <div style={{ height: '300px', backgroundColor: color }}>{children}</div>
  );
};

const NextButton: React.FC = () => {
  const { nextSlide, currentIndex, slideCount, slidesToShow } = useCarousel();
  const disabled = currentIndex === slideCount - slidesToShow;
  return (
    <button disabled={disabled} onClick={nextSlide}>
      Next
    </button>
  );
};
const PrevButton: React.FC = () => {
  const { prevSlide, currentIndex } = useCarousel();
  const disabled = currentIndex === 0;
  return (
    <button disabled={disabled} onClick={prevSlide}>
      Prev
    </button>
  );
};

const App = () => {
  return (
    <div style={{ height: '200vh', width: '50vw' }}>
      <Carousel initialIndex={0} slidesToShow={3}>
        <Slides>
          <Slide color="red">Slide 1</Slide>
          <Slide color="green">Slide 2</Slide>
          <Slide color="blue">Slide 3</Slide>
          <Slide color="yellow">Slide 4</Slide>
          <Slide color="aquamarine">Slide 5</Slide>
        </Slides>
        <PrevButton></PrevButton>
        <NextButton />
      </Carousel>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
