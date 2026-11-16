export function toSlotPayload(slot, { isAvailable = true } = {}) {
  return {
    id: slot._id,
    period: slot.period,
    label: slot.label,
    startTime: slot.startTime,
    surcharge: slot.surcharge || 0,
    surchargeLabel: slot.surcharge > 0 ? `+₹${slot.surcharge}` : null,
    isAvailable,
  };
}
