const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status.json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
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
            res.json(users[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
};

/* module.exports = {
  handleRegister,
};
 */

export { handleRegister };
