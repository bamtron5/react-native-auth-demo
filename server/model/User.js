const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'invalid email']
  },
  passwordHash: {type: String, select: false},
  salt: {type: String, select: false},
  roles: {type: Array, default: ['user']},
  count: {type: Number, default: 0}
});

UserSchema.method('setPassword', function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
});

UserSchema.method('validatePassword', function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return (hash === this.passwordHash);
});

module.exports = mongoose.model('User', UserSchema);