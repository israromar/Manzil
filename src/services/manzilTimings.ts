import type { ManzilTimings } from '../types/manzilTimings';

import rawTimings from '../../assets/data/manzil-timings.json';

export function getManzilTimings(): ManzilTimings {
  return rawTimings as ManzilTimings;
}
