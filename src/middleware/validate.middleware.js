import { ApiError } from '../utils/apiError.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Invalid request';
      return next(new ApiError(400, message));
    }

    req.validated = result.data;
    return next();
  };
}
