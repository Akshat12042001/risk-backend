import { asyncHandler } from '../../utils/asyncHandler.js';
import { createAddress, deleteAddress, listAddresses, updateAddress } from './address.service.js';

export const listAddressesController = asyncHandler(async (req, res) => {
  const addresses = await listAddresses(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Addresses fetched',
    data: { addresses },
  });
});

export const createAddressController = asyncHandler(async (req, res) => {
  const address = await createAddress(req.user._id, req.validated.body);
  res.status(201).json({
    success: true,
    message: 'Address saved',
    data: { address },
  });
});

export const updateAddressController = asyncHandler(async (req, res) => {
  const address = await updateAddress(req.user._id, req.validated.params.addressId, req.validated.body);
  res.status(200).json({
    success: true,
    message: 'Address updated',
    data: { address },
  });
});

export const deleteAddressController = asyncHandler(async (req, res) => {
  await deleteAddress(req.user._id, req.validated.params.addressId);
  res.status(200).json({
    success: true,
    message: 'Address deleted',
  });
});
