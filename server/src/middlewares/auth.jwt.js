const createHttpError = require("http-errors");
const config = require("../config/auth.config");
const db = require("../model");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");

const { user: User, role: Role } = db;

async function verifyToken(req, res, next) {
  try {
    const token = req.headers["x-access-token"];
    console.log("🚀 ~ verifyToken ~ token:", token);
    if (!token) return next(createHttpError.Unauthorized("Token not provided"));

    // Verify token
    jwt.verify(token, config.secret, async (err, decode) => {
      if (err) {
        const message =
          err instanceof JsonWebTokenError
            ? "Unauthorized! Access Token was expired!"
            : err.message;
        if (!token)
          return next(createHttpError.Unauthorized("Token not provided"));
      }
      req.userId = decode.id;
      const user = await User.findById(decode.id, {
        include: [{ model: Role, as: "roles" }],
      });
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
}

async function isBorrower(req, res, next) {
  try {
    if (!req.user) {
      throw createHttpError.Unauthorized("Unauthorized access");
    }
    if (req.user.roles.some((role) => role.name === "Borrower")) {
      next();
    } else {
      throw createHttpError.Forbidden("Forbidden access");
    }
  } catch (error) {
    next(error);
  }
}

async function isLibrarian(req, res, next) {
  try {
    if (!req.user) {
      throw createHttpError.Unauthorized("Unauthorized access");
    }
    if (req.user.roles.some((role) => role.name === "Librarian")) {
      next();
    } else {
      throw createHttpError.Forbidden("Forbidden access");
    }
  } catch (error) {
    next(error);
  }
}

async function isAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw createHttpError.Unauthorized("Unauthorized access");
    }
    if (req.user.roles.some((role) => role.name === "Admin")) {
      next();
    } else {
      throw createHttpError.Forbidden("Forbidden access");
    }
  } catch (error) {
    next(error);
  }
}

const authJWT = {
  verifyToken,
  isBorrower,
  isAdmin,
  isLibrarian,
};

module.exports = authJWT;
