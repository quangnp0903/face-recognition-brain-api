const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status.json('incorrect form submission');
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        db('users')
          .where('email', email)
          .then((users) => {
            res.json(users[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
};

/* module.exports = {
  handleSignin,
};
 */

export { handleSignin };
