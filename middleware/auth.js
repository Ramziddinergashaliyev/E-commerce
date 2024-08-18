import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      msg: "Access denied. No token provided.",
      variant: "error",
      payload: null,
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
          });
        }
        if (decoded.isActive) {
          req.admin = decoded;
          next();
        } else {
          return res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
          });
        }
      }
    );
  } catch (err) {
    res.status(401).json({
      msg: "Invalid token.",
      variant: "error",
      payload: null,
    });
  }
};

export const OwnerAdmin = (req, res, next) => {
  if (req.admin === "owner") {
    next();
  } else {
    return res.status(403).json({
      msg: "Token mavjudmas.",
      variant: "error",
      payload: null,
    });
  }
};
