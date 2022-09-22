require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
  results: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  studentNum: {
    type: Number,
    required: true,
    unique: true,
    maxLength: [8, "max length is 8"],
  },
  rollNum: {
    type: Number,
    required: true,
    unique: true,
    minLength: [13, "min length is 13"],
    maxLength: [13, "max length is 13"],
  },
  mobileNum: {
    type: Number,
    required: true,
    maxLength: 10,
    minLength: 10,
    unique: true,
  },
  password: { type: String },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  branch: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  isHosteler: {
    type: Boolean,
    default: false,
    required: true,
  },
  hasAppeared: {
    type: Boolean,
    default: false,
  },
  loginAt: {
    type: Date,
    default: null,
  },
  logoutAt: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  lang: { type: String },
  score: {
      type: Number,
      default: 0,
  }
},
  {timestamps:true}
);
// token generate---------
// UserSchema.methods.generateAuthToken = async function () {
//   try {
//     const pay_load = { _id: this._id };
//     const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
//     return token;
//   } catch (err) {
//     res.status(400).send(err);
//   }
// };

// password encryption------------
// UserSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }
//   if (this.isModified("adminPassword")) {
//     this.adminPassword = await bcrypt.hash(this.adminPassword, saltRounds);
//   }
//   next();
// });

const User = new mongoose.model("User", UserSchema);
module.exports = User;



