const handleProfileGet = (req, res, db) => {
  const { id } = req.params;

  db('users')
    .where('id', id)
    .then((users) => {
      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json('not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
};

/* module.exports = {
  handleProfileGet,
};
 */

export { handleProfileGet };
