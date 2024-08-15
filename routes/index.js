import express from "express";
import AdminsController from "../controller/admin.js";
import CategoryController from "../controller/category.js";
import ProductsController from "../controller/product.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../models/uploades.js";
const router = express.Router();

router.get("/api/admins", AdminsController.get);
router.get("/api/admins/:id", AdminsController.single);
router.get("/api/profile", [auth], AdminsController.getProfile);
router.patch("/api/profile", [auth], AdminsController.updateProfile);
router.post("/api/admins/sign-up", AdminsController.createAdmin);
router.post("/api/admins/sign-in", AdminsController.loginAdmin);
router.patch("/api/admins/:id", AdminsController.updateAdmin);
router.delete("/api/admins/:id", AdminsController.delete);

router.get("/api/product", ProductsController.get);
router.get("/api/product/category/:id", ProductsController.getCategory);
router.post(
  "/api/product",
  [auth, upload.array("photos")],
  ProductsController.create
);

router.get("/api/categories", CategoryController.get);
router.post("/api/categories", [auth], CategoryController.create);
router.delete("/api/categories/:id", CategoryController.delete);
router.patch("/api/categories/:id", CategoryController.update);

export default router;
