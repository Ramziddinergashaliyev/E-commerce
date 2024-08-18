import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Products, validateProduct } from "../models/productSchema.js";

class ProductsController {
  async get(req, res) {
    try {
      const products = await Products.find()
        .populate([
          { path: "adminId", select: ["fname", "lname"] },
          { path: "categoryId", select: ["title"] },
        ])
        .sort({ createAt: -1 });

      if (!products.length) {
        return res.status(500).json({
          msg: "Products is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Products",
        variant: "success",
        payload: products,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message || "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getCategory(req, res) {
    try {
      let { categoryId } = req.params;
      const products = await Products.find({ categoryId }).populate([
        { path: "adminId", select: ["fname", "username"] },
        { path: "categoryId", select: ["title"] },
      ]);
      if (!products.length) {
        return res.status(500).json({
          msg: "Products is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Products",
        variant: "success",
        payload: products,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message || "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      const urls = req.files
        ? req.files.map(
            (i) => `${req.protocol}://${req.get("host")}/images/${i.filename}`
          )
        : [];

      let newProduct = {
        ...req.body,
        adminId: req.admin._id,
        urls,
      };
      console.log(req.admin);

      const { error } = validateProduct(newProduct);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const product = await Products.create({
        ...newProduct,
        info: JSON.parse(req.body.info),
      });
      res.status(201).json({
        msg: "Product is created",
        variant: "success",
        payload: product,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message || "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Products.findByIdAndDelete(id, req.body);
      res.status(200).json({
        msg: "Delete products",
        variant: "success",
        payload: null,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async single(req, res) {
    try {
      const { id } = req.params;
      let product = await Products.findById(id);
      res.status(200).json({
        msg: "admin topildi",
        variant: "success",
        payload: product,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new ProductsController();
