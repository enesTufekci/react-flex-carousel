export function getClientX(event: MouseEvent | TouchEvent): number {
  if ((event as any).touches) {
    return (event as TouchEvent).touches[0].clientX;
  }
  return (event as MouseEvent).clientX;
}

export function absolute(num: number) {
  return num < 0 ? num * -1 : num;
}
