import { useMemo } from 'react';

import { getManzilData } from '../services/manzilData';

export function useManzil() {
  return useMemo(() => getManzilData(), []);
}
