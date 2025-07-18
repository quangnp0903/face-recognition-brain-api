import { redisClient } from './auth.js';

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;

  return authorization
    ? redisClient.get(authorization).then((reply) => {
        if (!reply) {
          return res.status(401).json('Unauthorized');
        }
        req.userId = reply;
        next();
      })
    : res.status(401).json('Unauthorized');
};

export { requireAuth };
