"use client";

import { createContext, useContext } from 'react';

interface EnterprisePricing {
  pricingModel: string;
  fuelPricePerLiter: number | null;
  fuelConsumptionKmpl: number | null;
  markupPercent: number;
  pricePerKm: number | null;
  baseFare: number;
  minimumFare: number;
}

interface EnterpriseContextType {
  subRole: 'OWNER' | 'OPERATOR' | null;
  enterprise: {
    id: string;
    name: string;
    rate: number;
    active: boolean;
  } | null;
  pricing: EnterprisePricing | null;
  loading: boolean;
}

export const EnterpriseContext = createContext<EnterpriseContextType>({
  subRole: null,
  enterprise: null,
  pricing: null,
  loading: true,
});

export function useEnterprise() {
  return useContext(EnterpriseContext);
}
