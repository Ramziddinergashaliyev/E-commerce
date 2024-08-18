import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admins, validateAdmin } from "../models/adminSchema.js";

class AdminsController {
  async getProfile(req, res) {
    try {
      let admin = await Admins.findById(req.admin._id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          msg: "Invalid token.",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "admin registered successfully",
        variant: "success",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async updateProfile(req, res) {
    try {
      const id = req.admin._id;
      const { username } = req.body;
      if (req.body.password) {
        return res.status(200).json({
          msg: "Password jonatmang",
          variant: "success",
          payload: null,
        });
      }
      const existingAdmin = await Admins.findOne({
        username,
      });
      if (existingAdmin && id !== existingAdmin._id?.toString()) {
        return res.status(400).json({
          msg: "Admin already exists.",
          variant: "error",
          payload: null,
        });
      }

      let updateAdmin = await Admins.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        msg: "Admin updated",
        variant: "success",
        payload: updateAdmin,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async get(req, res) {
    try {
      const admins = await Admins.find().sort({ createdAt: -1 });
      if (!admins.length) {
        return res.status(400).json({
          msg: "Admin is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Admins",
        variant: "success",
        payload: admins,
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
      let admin = await Admins.findById(id);
      res.status(200).json({
        msg: "admin topildi",
        variant: "success",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async createAdmin(req, res) {
    try {
      const { error } = validateAdmin(req.body);
      if (error)
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "error",
          payload: null,
        });

      const { username, password } = req.body;

      const existingAdmin = await Admins.findOne({ username });

      if (existingAdmin)
        return res.status(400).json({
          msg: "Admin already exists.",
          variant: "error",
          payload: null,
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = await Admins.create({
        ...req.body,
        password: hashedPassword,
      });

      res.status(201).json({
        msg: "Admin registered successfully",
        variant: "success",
        payload: admin,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async loginAdmin(req, res) {
    const { username, password } = req.body;

    const admin = await Admins.findOne({ username });
    if (!admin)
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });

    const token = jwt.sign(
      { _id: admin._id, role: admin.role, isActive: admin.isActive },
      process.env.SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      msg: "Logged in successfully",
      variant: "success",
      payload: { token, admin: admin },
    });
  }
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;

      const existingAdmin = await Admins.findOne({
        username: req.body.username,
      });
      if (existingAdmin && id !== existingAdmin._id?.toString())
        return res.status(400).json({
          msg: "admin already exists.",
          variant: "error",
          payload: null,
        });

      req.body.password = existingAdmin.password;

      let admin = await Admins.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        msg: "admin updated",
        variant: "success",
        payload: admin,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Admins.findByIdAndDelete(id);
      res.status(201).json({
        msg: "admin is deleted",
        variant: "success",
        payload: null,
      });
    } catch {
      res.status(500).json({
        msg: "server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new AdminsController();
