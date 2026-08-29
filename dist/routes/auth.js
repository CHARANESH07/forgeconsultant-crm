"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.post('/login', (0, validators_1.authRateLimit)(), (0, validation_1.validateBody)(validators_1.authSchemas.login), authController.login);
router.post('/register', (0, validators_1.authRateLimit)(), (0, validation_1.validateBody)(validators_1.authSchemas.register), authController.register);
router.post('/refresh', (0, validation_1.validateBody)(validators_1.authSchemas.refreshToken), authController.refreshToken);
router.post('/logout', auth_1.authenticateToken, authController.logout);
router.post('/forgot-password', (0, validators_1.authRateLimit)(), (0, validation_1.validateBody)(validators_1.authSchemas.forgotPassword), authController.forgotPassword);
router.post('/reset-password', (0, validation_1.validateBody)(validators_1.authSchemas.resetPassword), authController.resetPassword);
router.post('/change-password', auth_1.authenticateToken, (0, validation_1.validateBody)(validators_1.authSchemas.changePassword), authController.changePassword);
router.get('/me', auth_1.authenticateToken, authController.me);
exports.default = router;
//# sourceMappingURL=auth.js.map