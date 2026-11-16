export function toBookingPayload(booking, baseUrl) {
  return {
    id: booking._id,
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    serviceCount: booking.items.length,
    serviceCountLabel: `${booking.items.length} service${booking.items.length === 1 ? '' : 's'}`,
    items: booking.items.map((item) => ({
      serviceId: item.service,
      name: item.name,
      imageUrl: item.imageFile ? `${baseUrl}/services/${item.imageFile}` : null,
      durationId: item.durationId,
      minutes: item.minutes,
      durationLabel: `${item.minutes} Minutes`,
      price: item.price,
      originalPrice: item.originalPrice,
      unit: 'Minutes',
    })),
    booking: {
      scheduledFor: booking.scheduledFor,
      slotDate: booking.slotDate,
      slot: booking.slotSnapshot
        ? {
            id: booking.slot,
            ...booking.slotSnapshot,
          }
        : null,
      location: booking.addressSnapshot
        ? {
            id: booking.address,
            label: 'Location',
            displayAddress: booking.addressSnapshot.displayAddress,
          }
        : null,
      contact: booking.contact,
    },
    appliedCoupon: booking.couponSnapshot
      ? {
          id: booking.coupon,
          ...booking.couponSnapshot,
        }
      : null,
    bill: booking.bill,
    createdAt: booking.createdAt,
  };
}

export function toBookingListItem(booking, baseUrl, tab) {
  const first = booking.items[0];
  return {
    id: booking._id,
    bookingNumber: booking.bookingNumber,
    tab,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    scheduledFor: booking.scheduledFor,
    slotDate: booking.slotDate,
    serviceCountLabel: `${booking.items.length} service${booking.items.length === 1 ? '' : 's'}`,
    receiverName:
      booking.contact?.name ||
      booking.addressSnapshot?.receiverName ||
      'Guest',
    receiverPhone:
      booking.contact?.phone || booking.addressSnapshot?.receiverPhone || '',
    imageUrl: first?.imageFile ? `${baseUrl}/services/${first.imageFile}` : null,
    toPay: booking.bill?.toPay ?? 0,
    toPayLabel: booking.bill?.toPayLabel || null,
    createdAt: booking.createdAt,
  };
}

