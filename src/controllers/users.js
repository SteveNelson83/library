const User = require('../models/user');

exports.create = (req, res) => {
  const user = new User({
    forename: req.body.forename,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
  });

  user.save().then(() => {
    user.sanitise();
    res.status(201).json(user);
  });
};
