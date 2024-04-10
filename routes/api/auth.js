const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.get("/current/refresh", authenticate, ctrl.getRefresh);

router.post("/signout", authenticate, ctrl.signout);


module.exports = router;
