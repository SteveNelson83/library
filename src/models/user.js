/* eslint-disable no-console */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('isemail');

const userSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [isEmail.validate, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
});

userSchema.pre('save', function encryptPassword(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    bcrypt.hash(this.password, 10, (error, hash) => {
      if (error) {
        next(error);
      } else {
        this.password = hash;
        return next();
      }
    });
  }
});

// eslint-disable-next-line func-names
userSchema.methods.sanitise = function () {
  const user = this.toJSON();
  const noPassword = ({ password, ...rest }) => rest;
  const editedUser = noPassword(user);
  return editedUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
