const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "First name required"]
  },
  lname: {
    type: String,
    required: [true, "Last name required"]
  },
  nickname: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password required"]
  },
  blurb: {
    type: String,
  },
  dob: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);