// lib/coupons.ts
export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  discount: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponValidation {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

export interface CartCalculation {
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  finalTotal: number;
  shippingCost: number;
  totalWithShipping: number;
}

export function validateCoupon(
  coupon: Coupon | null,
  cartTotal: number
): CouponValidation {
  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      message: "Code invalide"
    };
  }

  // Vérifier si le coupon est actif
  if (!coupon.active) {
    return {
      isValid: false,
      discountAmount: 0,
      message: "Ce coupon n'est plus actif"
    };
  }

  // Vérifier si le coupon a expiré
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return {
      isValid: false,
      discountAmount: 0,
      message: "Ce coupon a expiré"
    };
  }

  // Vérifier le nombre d'utilisations
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return {
      isValid: false,
      discountAmount: 0,
      message: "Ce coupon a été entièrement utilisé"
    };
  }

  // Vérifier le montant minimum
  if (coupon.minOrder && cartTotal < coupon.minOrder) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Montant minimum requis: ${coupon.minOrder}F`
    };
  }

  // Calculer la réduction
  let discountAmount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discountAmount = (cartTotal * coupon.discount) / 100;
  } else {
    discountAmount = Math.min(coupon.discount, cartTotal);
  }

  return {
    isValid: true,
    coupon,
    discountAmount,
    message: `Réduction de ${coupon.type === 'PERCENTAGE' ? `${coupon.discount}%` : `${coupon.discount}F`} appliquée !`
  };
}

export function calculateCartTotal(
  subtotal: number,
  shippingCost: number,
  couponValidation?: CouponValidation
): CartCalculation {
  const discountAmount = couponValidation?.isValid ? couponValidation.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalWithShipping = finalTotal + shippingCost;

  return {
    subtotal,
    discountAmount,
    couponCode: couponValidation?.coupon?.code,
    finalTotal,
    shippingCost,
    totalWithShipping,
  };
}

export function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
