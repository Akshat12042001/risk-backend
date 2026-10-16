export function toUserPayload(user, isNewUser = false) {
  return {
    id: user._id,
    phone: user.phone,
    name: user.name || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    referralCode: user.referralCode || '',
    referredByCode: user.referredByCode || '',
    isNewUser,
  };
}
