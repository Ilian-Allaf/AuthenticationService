"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = __importDefault(require("../controllers/signup"));
const login_1 = __importDefault(require("../controllers/login"));
const logout_1 = __importDefault(require("../controllers/logout"));
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.post("/signup", (req, res) => { (0, signup_1.default)(req, res); });
router.post("/login", (req, res) => { (0, login_1.default)(req, res); });
router.post("/logout", (req, res) => { (0, logout_1.default)(req, res); });
exports.default = router;
