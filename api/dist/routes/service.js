"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = __importDefault(require("../controllers/signup"));
const login_1 = __importDefault(require("../controllers/login"));
const logout_1 = __importDefault(require("../controllers/logout"));
const forgotPassword_1 = __importDefault(require("../controllers/forgotPassword"));
const passwordReset_1 = __importDefault(require("../controllers/passwordReset"));
const emailResetForAuthenticatedUser_1 = __importDefault(require("../controllers/user/emailResetForAuthenticatedUser"));
const passwordResetForAuthenticatedUser_1 = __importDefault(require("../controllers/user/passwordResetForAuthenticatedUser"));
const usernameResetForAuthenticatedUser_1 = __importDefault(require("../controllers/user/usernameResetForAuthenticatedUser"));
const getAuthorizationToken_1 = __importDefault(require("../controllers/user/getAuthorizationToken"));
const getUser_1 = __importDefault(require("../controllers/user/getUser"));
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
function checkAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
}
;
router.post("/signup", (req, res) => { (0, signup_1.default)(req, res); });
router.post("/login", (req, res) => { (0, login_1.default)(req, res); });
router.post("/forgot-password", (req, res) => { (0, forgotPassword_1.default)(req, res); });
router.post("/password-reset", (req, res) => { (0, passwordReset_1.default)(req, res); });
router.get("/user", checkAuth, (req, res) => { (0, getUser_1.default)(req, res); });
router.get("/user/logout", checkAuth, (req, res) => { (0, logout_1.default)(req, res); });
router.post("/user/email-reset", checkAuth, (req, res) => { (0, emailResetForAuthenticatedUser_1.default)(req, res); });
router.post("/user/password-reset", checkAuth, (req, res) => { (0, passwordResetForAuthenticatedUser_1.default)(req, res); });
router.post("/user/username-reset", checkAuth, (req, res) => { (0, usernameResetForAuthenticatedUser_1.default)(req, res); });
router.get("/user/authorization", checkAuth, (req, res) => { (0, getAuthorizationToken_1.default)(req, res); });
router.get("/test", checkAuth, (req, res) => { res.status(200).json({ message: 'Test successful' }); });
exports.default = router;
