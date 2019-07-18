import { getClientX, absolute } from './utils';

class Rail {
  mountElement: HTMLDivElement;

  constructor(mountElement: HTMLDivElement) {
    this.mountElement = mountElement;
  }

  resize = (slideItemWidth: number, slideCount: number) => {
    this.mountElement.style.width = `${slideItemWidth * slideCount}px`;
    for (let index = 0; index < this.mountElement.children.length; index++) {
      const item = this.mountElement.children.item(index) as HTMLDivElement;
      if (item) {
        item.style.width = `${slideItemWidth}px`;
        item.style.display = 'block';
        item.style.userSelect = 'none';
      }
    }
  };

  initialize = (slideItemWidth: number, slideCount: number) => {
    this.mountElement.style.width = `${slideItemWidth * slideCount}px`;
    this.mountElement.style.display = 'flex';
    this.mountElement.style.transitionProperty = 'margin-left';
    this.mountElement.style.transitionTimingFunction = 'ease-in-out';

    this.resize(slideItemWidth, slideCount);
  };

  move = (
    distance: number,
    currentIndex: number,
    itemWidth: number,
    animation = false
  ) => {
    this.mountElement.style.transitionDuration = animation ? '200ms' : '0ms';
    const nextPosition = -1 * (distance + currentIndex * itemWidth);
    this.mountElement.style.marginLeft = `${nextPosition}px`;
  };
}

type StageEvent = MouseEvent | TouchEvent;

interface StageConfig {
  mount: HTMLDivElement;
  railMount: HTMLDivElement;
  slideCount: number;
  slidesToShow: number;
  slideThreshold: number;
  infinite: boolean;
  onDragUpdate: (state: boolean) => void;
}

export class Stage {
  rail: Rail;
  mount: HTMLDivElement;
  slideCount = 0;

  infinite: boolean;
  slidesToShow: number;
  slideItemWidth = 0;
  slideThreshold: number;

  currentIndex = 0;
  isDragging = false;
  draggingDistance = 0;
  draggingStartedAt = 0;
  draggingDirection = 1;

  onDragUpdate: (state: boolean) => void;

  constructor(config: StageConfig) {
    const {
      mount,
      railMount,
      slideCount,
      onDragUpdate,
      infinite,
      slidesToShow,
      slideThreshold,
    } = config;

    this.mount = mount;
    this.slideCount = slideCount;
    this.onDragUpdate = onDragUpdate;
    this.slidesToShow = slidesToShow;
    this.slideThreshold = slideThreshold;
    this.infinite = infinite;
    this.slideItemWidth = this.mount.clientWidth / slidesToShow;

    this.rail = new Rail(railMount);
    this.rail.initialize(this.slideItemWidth, this.slideCount);
    this.initialize();
  }

  start = (event: StageEvent) => {
    this.isDragging = true;
    this.draggingDistance = 0;
    this.draggingStartedAt = getClientX(event);
    this.onDragUpdate(true);
  };

  stopOnEdges = () => {
    const tempNextIndex = this.getNextIndex(
      (this.slideItemWidth / 4) * this.draggingDirection
    );
    if (
      (this.draggingDistance < 0 && tempNextIndex < 0) ||
      (tempNextIndex > this.slideCount - this.slidesToShow &&
        this.draggingDistance > 0)
    ) {
      this.stop();
    }
  };

  move = (event: StageEvent) => {
    if (this.isDragging) {
      this.draggingDistance = this.draggingStartedAt - getClientX(event);
      this.draggingDirection = this.draggingDistance > 0 ? 1 : -1;
      if (!this.infinite) {
        this.stopOnEdges();
      }

      this.rail.move(
        this.draggingDistance,
        this.currentIndex,
        this.slideItemWidth,
        false
      );
    }
  };

  idle = () => {
    this.isDragging = false;
    this.draggingDistance = 0;
    this.draggingStartedAt = 0;
  };

  jump = (index: number, animate = true) => {
    this.currentIndex = index;
    this.rail.move(0, index, this.slideItemWidth, animate);
  };

  stop = () => {
    this.isDragging = false;
    this.onDragUpdate(false);
    this.jump(this.currentIndex);
  };

  getNextIndex = (buffer = 0) => {
    const itemWidth = this.mount.clientWidth / this.slidesToShow;
    const threshold = itemWidth * this.slideThreshold;
    const nextIndexStep = Math.floor(
      (this.draggingDistance + buffer + threshold) / itemWidth
    );
    return this.currentIndex + nextIndexStep;
  };

  resize = () => {
    this.slideItemWidth = this.mount.clientWidth / this.slidesToShow;
    this.rail.resize(this.slideItemWidth, this.slideCount);
    this.jump(this.currentIndex, false);
  };

  destroy = () => {
    this.mount.removeEventListener('mousedown', this.start);
    this.mount.removeEventListener('mousemove', this.move);
    this.mount.removeEventListener('mouseup', this.stop);
    this.mount.removeEventListener('mouseleave', this.stop);
    this.mount.removeEventListener('touchstart', this.start);
    this.mount.removeEventListener('touchmove', this.move);
    this.mount.removeEventListener('touchend', this.stop);
    this.mount.removeEventListener('touchcancel', this.stop);
  };

  private initialize = () => {
    this.mount.addEventListener('mousemove', this.move, {
      passive: true,
    });
    this.mount.addEventListener('mousedown', this.start);
    this.mount.addEventListener('mouseup', this.stop);
    this.mount.addEventListener('mouseleave', this.stop);

    this.mount.addEventListener('touchmove', this.move, {
      passive: true,
    });
    this.mount.addEventListener('touchcancel', this.stop, {
      passive: true,
    });
    this.mount.addEventListener('touchstart', this.start);
    this.mount.addEventListener('touchend', this.stop);
  };
}
