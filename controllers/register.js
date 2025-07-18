import { createSession } from './auth.js';

const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status.json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  return db
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
          return trx('users')
            .returning('*')
            .insert({
              name: name,
              email: loginEmail[0].email,
              joined: new Date(),
            })
            .then((users) => {
              console.log('users', users);
              return users[0];
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => {
      if (err.code === '23505') {
        return Promise.reject('Email already exists');
      }
      // console.log('err for register', err);
      return Promise.reject('unable to get register');
    });
};

const registerAuthentication = (db, bcrypt) => (req, res) => {
  handleRegister(req, res, db, bcrypt)
    .then((data) => {
      console.log('registerAuthentication data', data);
      return data?.id && data?.email
        ? createSession(data)
        : Promise.reject(data);
    })
    .then((session) => res.json(session))
    .catch((err) => res.status(400).json(err));
};

export { handleRegister, registerAuthentication };
