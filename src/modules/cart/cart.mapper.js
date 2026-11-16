import { calculateCouponDiscount } from '../coupons/coupon.discount.js';
import { cartCopy, cartPricing } from './cart.config.js';

function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function formatMoney(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatSlotLabelForDisplay(label) {
  if (!label) {
    return null;
  }
  return label.replace(/\s*(am|pm)$/i, (_, period) => period.toUpperCase()).replace(/\s+/g, '');
}

function buildScheduledFor(slotDate, slot) {
  if (!slotDate || !slot) {
    return null;
  }
  const [year, month, day] = slotDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
  const time = formatSlotLabelForDisplay(slot.label);
  return `${weekday}, ${monthLabel} ${day} - ${time}`;
}

function addressDisplay(address) {
  if (!address) {
    return null;
  }
  return [address.flatOrHouseNo, address.floor, address.building, address.landmark, address.area]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .join(', ');
}

function contactPayload(user, address) {
  const name =
    address?.receiverName ||
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    '';
  const phone = address?.receiverPhone || user.phone || '';
  return {
    name,
    phone,
  };
}

export function buildBill({ items, slotSurcharge, coupon }) {
  const itemTotal = money(items.reduce((sum, item) => sum + item.price, 0));
  const originalTotal = money(items.reduce((sum, item) => sum + (item.originalPrice || item.price), 0));
  const slotCharge = money(slotSurcharge || 0);
  const professionalServiceFee = money(cartPricing.professionalServiceFee);
  let couponDiscount = 0;
  try {
    couponDiscount = calculateCouponDiscount(coupon, itemTotal);
  } catch {
    couponDiscount = 0;
  }
  const discountedItemTotal = money(Math.max(itemTotal - couponDiscount, 0));
  const taxable = money(discountedItemTotal + slotCharge + professionalServiceFee);
  const taxesAndFee = money(taxable * cartPricing.taxRate);
  const toPay = money(taxable + taxesAndFee);
  const savedAmount = money(originalTotal - itemTotal + couponDiscount);

  const lines = [
    { key: 'itemTotal', label: 'Item total', amount: itemTotal },
  ];
  if (couponDiscount > 0) {
    lines.push({ key: 'couponDiscount', label: 'Coupon discount', amount: -couponDiscount });
  }
  lines.push(
    { key: 'slotCharge', label: 'Slot charge', amount: slotCharge },
    { key: 'professionalServiceFee', label: 'Professional Service Fee', amount: professionalServiceFee },
    { key: 'taxesAndFee', label: cartPricing.taxLabel, amount: taxesAndFee },
  );

  return {
    itemTotal,
    couponDiscount,
    slotCharge,
    professionalServiceFee,
    taxesAndFee,
    toPay,
    savedAmount,
    savedLabel: savedAmount > 0 ? `₹${formatMoney(savedAmount)} saved on the total!` : null,
    toPayLabel: `To pay ₹${formatMoney(toPay)}`,
    payNowLabel: `${cartCopy.payNowLabel} | ₹${formatMoney(toPay)}`,
    lines,
  };
}

export function toCartPayload({ cart, user, servicesById, slot, address, coupon, baseUrl }) {
  const items = cart.items.map((item) => {
    const service = servicesById.get(String(item.service));
    return {
      id: item._id,
      serviceId: item.service,
      name: service?.name || '',
      imageUrl: service ? `${baseUrl}/services/${service.imageFile}` : null,
      durationId: item.durationId,
      minutes: item.minutes,
      durationLabel: `${item.minutes} Minutes`,
      price: item.price,
      originalPrice: item.originalPrice,
      unit: 'Minutes',
    };
  });

  const bill = buildBill({
    items,
    slotSurcharge: slot?.surcharge || 0,
    coupon,
  });

  return {
    serviceCount: items.length,
    serviceCountLabel: `${items.length} service${items.length === 1 ? '' : 's'}`,
    availabilityNote: cartCopy.availabilityNote,
    addMoreLabel: cartCopy.addMoreLabel,
    couponsLabel: cartCopy.couponsLabel,
    appliedCoupon: coupon
      ? {
          id: coupon._id,
          code: coupon.code,
          title: coupon.title,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        }
      : null,
    items,
    booking: {
      scheduledFor: buildScheduledFor(cart.slotDate, slot),
      slotDate: cart.slotDate,
      slot: slot
        ? {
            id: slot._id,
            label: slot.label,
            startTime: slot.startTime,
            period: slot.period,
            surcharge: slot.surcharge || 0,
          }
        : null,
      location: address
        ? {
            id: address._id,
            label: 'Location',
            displayAddress: addressDisplay(address),
          }
        : null,
      contact: contactPayload(user, address),
    },
    bill,
  };
}
