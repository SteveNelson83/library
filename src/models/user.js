/* eslint-disable no-console */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  forename: String,
  surname: String,
  email: String,
  password: String,
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
  console.log(this);
  const user = this;
  const noPassword = ({ password, ...rest }) => rest;
  const editedUser = noPassword(user);
  return editedUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
