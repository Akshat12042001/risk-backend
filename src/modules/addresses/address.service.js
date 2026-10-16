import { Address } from '../../models/address.model.js';
import { ApiError } from '../../utils/apiError.js';
import { normalizePhone } from '../../utils/phone.js';
import { toAddressPayload } from './address.mapper.js';

function blankToEmpty(value) {
  return value?.trim() || '';
}

async function findOwnedAddress(userId, addressId) {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw new ApiError(404, 'Address not found');
  }
  return address;
}

async function selectAddress(userId, addressId) {
  await Address.updateMany({ user: userId, _id: { $ne: addressId } }, { isSelected: false });
  await Address.updateOne({ _id: addressId, user: userId }, { isSelected: true });
}

function addressInput(input) {
  return {
    ...(input.saveAs !== undefined ? { saveAs: input.saveAs } : {}),
    ...(input.flatOrHouseNo !== undefined ? { flatOrHouseNo: input.flatOrHouseNo.trim() } : {}),
    ...(input.floor !== undefined ? { floor: blankToEmpty(input.floor) } : {}),
    ...(input.building !== undefined ? { building: input.building.trim() } : {}),
    ...(input.landmark !== undefined ? { landmark: blankToEmpty(input.landmark) } : {}),
    ...(input.area !== undefined ? { area: input.area.trim() } : {}),
    ...(input.receiverName !== undefined ? { receiverName: input.receiverName.trim() } : {}),
    ...(input.receiverPhone !== undefined ? { receiverPhone: normalizePhone(input.receiverPhone) } : {}),
  };
}

export async function listAddresses(userId) {
  const addresses = await Address.find({ user: userId }).sort({ isSelected: -1, createdAt: -1 });
  return addresses.map(toAddressPayload);
}

export async function createAddress(userId, input) {
  const existingCount = await Address.countDocuments({ user: userId });
  const address = await Address.create({
    user: userId,
    ...addressInput(input),
    isSelected: false,
  });

  if (input.isSelected === true || existingCount === 0) {
    await selectAddress(userId, address._id);
    address.isSelected = true;
  }

  return toAddressPayload(address);
}

export async function updateAddress(userId, addressId, input) {
  const address = await findOwnedAddress(userId, addressId);
  Object.assign(address, addressInput(input));
  await address.save();

  if (input.isSelected === true) {
    await selectAddress(userId, address._id);
    address.isSelected = true;
  } else if (input.isSelected === false && address.isSelected) {
    const replacement = await Address.findOne({ user: userId, _id: { $ne: address._id } }).sort({ updatedAt: -1 });
    if (replacement) {
      await selectAddress(userId, replacement._id);
      address.isSelected = false;
    }
  }

  return toAddressPayload(address);
}

export async function deleteAddress(userId, addressId) {
  const address = await findOwnedAddress(userId, addressId);
  const wasSelected = address.isSelected;
  await address.deleteOne();

  if (wasSelected) {
    const replacement = await Address.findOne({ user: userId }).sort({ updatedAt: -1 });
    if (replacement) {
      await selectAddress(userId, replacement._id);
    }
  }
}
