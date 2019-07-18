This project is bootstrapped with [tsdx](https://github.com/palmerhq/tsdx)

# Usage

```jsx
import { Carousel, Slides, useCarousel } from 'react-flex-carousel';

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
    <div>
      <Carousel initialIndex={0} slidesToShow={3}>
        <Slides>
          <Slide color="red">Slide 1</Slide>
          <Slide color="green">Slide 2</Slide>
          <Slide color="blue">Slide 3</Slide>
          <Slide color="yellow">Slide 4</Slide>
          <Slide color="aquamarine">Slide 5</Slide>
        </Slides>
        <PrevButton />
        <NextButton />
      </Carousel>
    </div>
  );
};
```

# Development

- Run library

  ```bash
    npm run start
  ```

  or

  ```bash
    yarn start
  ```

- Run example
  ```bash
    cd example
    npm run start
  ```
  or
  ```bash
    yarn start
  ```

# Build

```bash
  npm run build
```

or

```bash
  yarn build
```
