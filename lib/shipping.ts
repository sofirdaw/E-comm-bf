// lib/shipping.ts
export interface ShippingCalculation {
  shippingCost: number;
  isFreeShipping: boolean;
  subtotal: number;
  freeShippingThreshold: number;
  baseShippingCost: number;
  remainingForFreeShipping: number;
}

export const SHIPPING_CONFIG = {
  BASE_COST: 1000, // 1000F
  FREE_THRESHOLD: 50000, // 50000F
} as const;

export function calculateShipping(subtotal: number): ShippingCalculation {
  const { BASE_COST, FREE_THRESHOLD } = SHIPPING_CONFIG;
  
  const isFreeShipping = subtotal >= FREE_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : BASE_COST;
  const remainingForFreeShipping = Math.max(0, FREE_THRESHOLD - subtotal);
  
  return {
    shippingCost,
    isFreeShipping,
    subtotal,
    freeShippingThreshold: FREE_THRESHOLD,
    baseShippingCost: BASE_COST,
    remainingForFreeShipping,
  };
}

export function formatShippingMessage(calculation: ShippingCalculation): string {
  if (calculation.isFreeShipping) {
    return "🎉 Livraison gratuite offerte !";
  }
  
  const remaining = calculation.remainingForFreeShipping;
  return `📦 Frais de livraison: ${calculation.shippingCost}F (Plus que ${remaining}F pour la livraison gratuite)`;
}
