import * as React from 'react';

import CarouselContext from './CarouselContext';
import { Stage } from './Stage';

const stageMountStyles: React.CSSProperties = {
  overflowY: 'hidden',
  touchAction: 'none',
  width: '100%',
  overflow: 'hidden',
  maxWidth: '100vw',
};

const Slides: React.FC = ({ children }) => {
  const {
    currentIndex,
    slidesToShow,
    slideThreshold,
    setSlideCount,
    infinite,
    goTo,
  } = React.useContext(CarouselContext);

  const [isDragging, setIsDragging] = React.useState(false);

  const stageMount = React.createRef<HTMLDivElement>();
  const railMount = React.createRef<HTMLDivElement>();
  const stage = React.useRef<Stage | null>();

  React.useEffect(() => {
    // Initialize the stage
    if (stageMount && stageMount.current && railMount && railMount.current) {
      const slideCount = React.Children.count(children);
      stage.current = new Stage({
        infinite,
        slidesToShow,
        slideThreshold,
        mount: stageMount.current,
        railMount: railMount.current,
        slideCount,
        onDragUpdate: (state: boolean) => setIsDragging(state),
      });
      setSlideCount(slideCount);
      // Jumps the stage to initial index
      stage.current.jump(currentIndex);
    }
    return () => {
      // destroys the stage on unmount
      stage.current && stage.current.destroy();
    };
  }, [stageMount.current, railMount.current, goTo, children]);

  React.useEffect(() => {
    // Dragging finishes
    if (!isDragging && stage.current) {
      goTo(stage.current.getNextIndex());
    }
  }, [isDragging, goTo, stage]);

  React.useEffect(() => {
    if (stage && stage.current) {
      // moves stage on every index change
      stage.current.jump(currentIndex);
    }
  }, [currentIndex, stage]);

  React.useEffect(() => {
    // Readapts the stage to window size
    const handleResize = () => {
      if (stage && stage.current) {
        stage.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', () => handleResize);
    };
  }, [stage]);

  return (
    <div ref={stageMount} style={stageMountStyles}>
      <div ref={railMount}>
        {React.Children.toArray(children).map((item, index) => {
          return (
            <div style={{ display: 'none' }} key={`slide-${index}`}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slides;
