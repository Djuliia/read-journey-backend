const { model, Schema } = require("mongoose");
const Joi = require("joi");
const  handleMongooseError  = require("../helpers/handleMongooseError");

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            minLength: 3,
            required: [true, "Name is required"],
    },
      password: {
        type: String,
        minLength: 7,
        required: [true, "Password is required"],
      },
      email: {
        type: String,
        match: emailRegexp,
        required: [true, "Email is required"],
        unique: true,
      },

      token: {
        type: String,
        default: null,
      },
    },
    { versionKey: false }
  );

userSchema.post("save", handleMongooseError);
  
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(7).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
  
const schemas = {
  registerSchema,
  loginSchema,
 
};
  
const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};