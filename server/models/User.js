/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 5,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    unique: true,
    match: /.+@.+\..+/,
  },
  mobileNumber: {
    type: Number,
    validate: {
      validator(v) {
        return /d{10}/.test(v);
      },
      message: '{VALUE} is not a valid 10 digit number!',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [6, 'Password should be at least six characters'],
  },
  //   passwordHash: { type: String, required: true },
  profilePicture: {
    type: String,
    default: '',
  },
  coverPicture: {
    type: String,
    default: '',
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// UserSchema.virtual('password')
//   .get(function () {
//     return this._password;
//   })
//   .set(async function (value) {
//     this._password = value;
//     const salt = await bcrypt.genSalt(10);
//     this.passwordHash = await bcrypt.hash(value, salt);
//   });

// UserSchema.virtual('passwordConfirm')
//   .get(function () {
//     return this._passwordConfirm;
//   })
//   .set(function (value) {
//     this._passwordConfirm = value;
//   });

// UserSchema.path('passwordHash').validate(function (val) {
//   if (this._password || this._passwordConfirm) {
//     if (!val.check(this._password).min(6)) {
//       this.invalidate('password', 'must be at least 6 characters.');
//     }
//     if (this._password !== this._passwordConfirm) {
//       this.invalidate('passwordConfirm', 'must match confirmation.');
//     }
//   }

//   if (this.isNew && !this._password) {
//     this.invalidate('password', 'required');
//   }
// }, null);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', UserSchema);
