function localPhone(phone) {
  if (phone.startsWith('+91') && phone.length === 13) {
    return phone.slice(3);
  }
  return phone.replace(/^\+/, '');
}

export function toAddressPayload(address) {
  const displayAddress = [
    address.flatOrHouseNo,
    address.floor,
    address.building,
    address.landmark,
    address.area,
  ]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .join(', ');

  return {
    id: address._id,
    saveAs: address.saveAs,
    label: address.saveAs === 'home' ? 'Home' : 'Other',
    flatOrHouseNo: address.flatOrHouseNo,
    floor: address.floor || '',
    building: address.building,
    landmark: address.landmark || '',
    area: address.area,
    receiverName: address.receiverName,
    receiverPhone: address.receiverPhone,
    isSelected: address.isSelected,
    displayAddress: `${displayAddress}, Mobile:${localPhone(address.receiverPhone)}`,
  };
}
