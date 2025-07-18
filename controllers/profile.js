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

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;

  db('users')
    .where('id', id)
    .update({ name, age, pet })
    .then((resp) => {
      if (resp) {
        res.json('success');
      } else {
        res.status(400).json('Unable to update');
      }
    })
    .catch((err) => res.status(400).json('error updating user'));
};

export { handleProfileGet, handleProfileUpdate };
