import type { ManzilData } from '../types/manzil';

import manzilData from '../../assets/data/manzil.json';

export function getManzilData(): ManzilData {
  return manzilData as ManzilData;
}
