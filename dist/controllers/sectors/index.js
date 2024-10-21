"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentUser = exports.getCurrentUser = exports.createCurrentUser = void 0;
const models_1 = require("../../models");
// Create new user
const createCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.body;
        const existingUser = yield models_1.UserModel.findOne({ auth0Id });
        if (existingUser) {
            const result = {
                code: 200,
                data: existingUser,
                message: "User already exists",
            };
            res.status(200).json(result);
            return;
        }
        const newUser = new models_1.UserModel(req.body);
        yield newUser.save();
        const result = {
            code: 201,
            data: newUser,
            message: "User created successfully",
        };
        res.status(201).json(result);
    }
    catch (error) {
        const result = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
});
exports.createCurrentUser = createCurrentUser;
// Get current user
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield models_1.UserModel.findOne({ _id: req.userId });
        if (!currentUser) {
            const result = {
                code: 404,
                message: "User not found",
            };
            res.status(404).json(result);
            return;
        }
        const result = {
            code: 200,
            data: currentUser,
            message: "User found successfully",
        };
        res.status(200).json(result);
    }
    catch (error) {
        const result = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
});
exports.getCurrentUser = getCurrentUser;
// Update current user
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = yield models_1.UserModel.findById(req.userId);
        if (!user) {
            const result = {
                code: 404,
                message: "User not found",
            };
            res.status(404).json(result);
            return;
        }
        user.name = name !== null && name !== void 0 ? name : user.name;
        user.addressLine1 = addressLine1 !== null && addressLine1 !== void 0 ? addressLine1 : user.addressLine1;
        user.country = country !== null && country !== void 0 ? country : user.country;
        user.city = city !== null && city !== void 0 ? city : user.city;
        yield user.save();
        const result = {
            code: 200,
            data: user,
            message: "User updated successfully",
        };
        res.status(200).json(result);
    }
    catch (error) {
        const result = {
            code: 500,
            message: "Error updating user",
        };
        res.status(500).json(result);
    }
});
exports.updateCurrentUser = updateCurrentUser;
