import { z } from 'zod';

const saveAsSchema = z.enum(['home', 'other'], {
  errorMap: () => ({ message: 'Save address as Home or Other' }),
});

const requiredText = (label, max) => z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const optionalText = (max, message) => z.string().trim().max(max, message).optional();

const addressFields = {
  saveAs: saveAsSchema,
  flatOrHouseNo: requiredText('Flat/House No.', 50),
  floor: optionalText(20, 'Floor is too long'),
  building: requiredText('Apartment / Building name', 120),
  landmark: optionalText(120, 'Landmark is too long'),
  area: requiredText('Area/Sector/Locality', 200),
  receiverPhone: z
    .string({ required_error: "Receiver's phone number is required" })
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(16, 'Enter a valid phone number'),
  receiverName: requiredText("Receiver's name", 80),
  isSelected: z.boolean().optional(),
};

export const createAddressSchema = z.object({
  body: z.object(addressFields).strict(),
});

export const updateAddressSchema = z.object({
  params: z.object({
    addressId: z.string().regex(/^[a-f\d]{24}$/i, 'Address not found'),
  }),
  body: z
    .object({
      saveAs: saveAsSchema.optional(),
      flatOrHouseNo: requiredText('Flat/House No.', 50).optional(),
      floor: optionalText(20, 'Floor is too long'),
      building: requiredText('Apartment / Building name', 120).optional(),
      landmark: optionalText(120, 'Landmark is too long'),
      area: requiredText('Area/Sector/Locality', 200).optional(),
      receiverPhone: addressFields.receiverPhone.optional(),
      receiverName: requiredText("Receiver's name", 80).optional(),
      isSelected: z.boolean().optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, { message: 'Nothing to update' }),
});

export const addressIdSchema = z.object({
  params: z.object({
    addressId: z.string().regex(/^[a-f\d]{24}$/i, 'Address not found'),
  }),
});
