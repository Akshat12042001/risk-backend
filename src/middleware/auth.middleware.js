import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return next(new ApiError(401, 'Login required'));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('_id phone name tokenVersion');
    if (!user) {
      return next(new ApiError(401, 'Login required'));
    }
    if ((user.tokenVersion ?? 0) !== (payload.tv ?? 0)) {
      return next(new ApiError(401, 'Session expired. Please log in again'));
    }
    req.user = user;
    return next();
  } catch {
    return next(new ApiError(401, 'Session expired. Please log in again'));
  }
}
