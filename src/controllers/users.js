/* eslint-disable no-console */
const User = require('../models/user');

exports.create = (req, res) => {
  const user = new User({
    forename: req.body.forename,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
    .then(() => {
      const sanitisedUser = user.sanitise();
      res.status(201).json(sanitisedUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const emailError = error.errors.email ? error.errors.email.message : null; 
        res.status(400).json({
          errors: {
            email: emailError,
          },
        });
      } else {
        res.sendStatus(500);
      }
    });
};
