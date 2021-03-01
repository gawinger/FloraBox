if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const AddressSchema = new mongoose.Schema({
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  number: {
    type: String,
  },
  postalCode: {
    type: String,
    maxlength: 6,
    minlength: 6,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  addresses: [AddressSchema],
  role: {
    type: String,
    default: "basic",
    enum: ["basic", "admin"],
  },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", UserSchema);

module.exports = User;
