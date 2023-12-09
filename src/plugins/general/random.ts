export function randomNumberWithinRange(min: number, max: number): number {

  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  
}