import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

// setup redis client
// Note: Ensure you have redis server running and the 'redis' package installed
const redisClient = createClient({ url: process.env.REDIS_URI });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }

  return db
    .select('email', 'hash')
    .from('login')
    .where('email', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db('users')
          .where('email', email)
          .then((users) => users[0])
          .catch((err) => Promise.reject('unable to get user'));
      } else {
        return Promise.reject('wrong credentials');
      }
    })
    .catch((err) => Promise.reject('wrong credentials'));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;

  return redisClient.get(authorization).then((reply) => {
    if (!reply) {
      return res.status(401).json('Unauthorized');
    }
    return res.json({ id: reply });
  });
};

const signToken = (email) => {
  const payload = { email };
  const options = { expiresIn: '2 days' };
  return jwt.sign(payload, 'JWT_SECRET', options);
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user) => {
  // JWT token, return user data
  const { id, email } = user;
  const token = signToken(email);

  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token };
    })
    .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

const handleSignout = (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? redisClient.del(authorization).then(() => {
        res.json({ success: 'true' });
      })
    : res.status(401).json('Unauthorized');
};

export {
  handleSignin,
  signinAuthentication,
  redisClient,
  createSession,
  signToken,
  setToken,
  handleSignout,
};
