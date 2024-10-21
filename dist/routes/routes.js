"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/// /api/my/user
// Get current user
router.get("/", middleware_1.jwtCheck, middleware_1.jwtParse, controllers_1.getCurrentUser);
// Create a new user
router.post("/", middleware_1.jwtCheck, controllers_1.createCurrentUser);
// Update current user
router.put("/", middleware_1.jwtCheck, middleware_1.jwtParse, middleware_1.validateMyUserRequest, controllers_1.updateCurrentUser);
exports.default = router;
