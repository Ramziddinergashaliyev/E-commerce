import express from "express";
import AdminsController from "../controller/admin.js";
const router = express.Router();

router.get("/api/admins", AdminsController.get);
// router.get("/api/profile", AdminsController.getProfile);
router.post("/api/admins/sign-up", AdminsController.createAdmin);
router.post("/api/admins/sign-in", AdminsController.loginAdmin);
router.patch("/api/admins/:id", AdminsController.updateAdmin);
router.delete("/api/admins/:id", AdminsController.delete);

export default router;
