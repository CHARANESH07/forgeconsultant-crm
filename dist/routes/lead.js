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
const leadController = __importStar(require("../controllers/lead"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post('/', (0, validation_1.validateBody)(validators_1.leadSchemas.create), leadController.createLead);
router.get('/', (0, validation_1.validateQuery)(validators_1.paginationSchema), leadController.listLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/:id', (0, validation_1.validateParams)(validators_1.idParamSchema), leadController.getLead);
router.put('/:id', (0, validation_1.validateParams)(validators_1.idParamSchema), (0, validation_1.validateBody)(validators_1.leadSchemas.update), leadController.updateLead);
router.delete('/:id', (0, validation_1.validateParams)(validators_1.idParamSchema), leadController.deleteLead);
router.post('/:id/convert', (0, validation_1.validateParams)(validators_1.idParamSchema), (0, validation_1.validateBody)(validators_1.leadSchemas.convert), leadController.convertLead);
exports.default = router;
//# sourceMappingURL=lead.js.map