"use client";

import { createContext, useContext } from 'react';

interface EnterpriseContextType {
  subRole: 'OWNER' | 'OPERATOR' | null;
  enterprise: { id: string; name: string; rate: number; active: boolean } | null;
  loading: boolean;
}

export const EnterpriseContext = createContext<EnterpriseContextType>({
  subRole: null,
  enterprise: null,
  loading: true,
});

export function useEnterprise() {
  return useContext(EnterpriseContext);
}
