const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../helpers/createError");
const { User } = require("../models/user");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const { SECRET_KEY } = process.env;

// const register = async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
  
//     if (user) {
//       throw createError(409, "Email in use");
//     }
  
//     const hashPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ ...req.body, password: hashPassword });
//     res.status(201).json({
//       user: {
//             email: newUser.email,
//                },
//     });
//   };

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw createError(409, "Such email already exists");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  const payload = {
    id: newUser._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  newUser.token = token;
  await newUser.save();
  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      name: newUser.name,
    },
  });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, "Email or password invalid");
         }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
      throw createError(401, "Email or password invalid");
    }
      const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
            },
    });
  };

  const getCurrent = async (req, res) => {
    const { email, name } = req.user;
    res.json({
      email,
      name
          });
  };

  const getRefresh = async (req, res, next) => {
    const { refreshToken } = req.body;
  
    try {
      if (!refreshToken) {
        throw createError(400, "Refresh token is required");
      }
        const decoded = jwt.verify(refreshToken, SECRET_KEY);
      const userId = decoded.id;
      const user = await User.findById(userId);
  
      if (!user) {
        throw createError(404, "User not found");
      }
      if (user.token !== refreshToken) {
        throw createError(401, "Invalid refresh token");
      }
      const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "23h" });
      user.token = accessToken;
      await user.save();

      res.json({ token: accessToken });
    } catch (error) {
      next(error); 
    }
  };

  const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  };
  
    module.exports = {
        register: ctrlWrapper(register),
        login: ctrlWrapper(login),
        getCurrent: ctrlWrapper(getCurrent),
        getRefresh: ctrlWrapper(getRefresh),
        signout: ctrlWrapper(signout)

    };