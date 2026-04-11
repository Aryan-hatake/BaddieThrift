import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors;
    ((err.status = 401), (err.message = errors.array()));

    return res.status(err.status).json({
      message: "validation failed",
      err: err.message,
    });
  }

  next();
};

export const registerValidation = [
  body("fullName")
    .trim()
    .isString()
    .withMessage("fullname should be string")
    .notEmpty()
    .withMessage("fullname can't be empty"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .isLowercase()
    .withMessage("email should be in lowercase")
    .notEmpty()
    .withMessage("email can't be empty"),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage("password must be combination of alphabets and digits")
    .isLength({ min: 6 })
    .withMessage("minimum length of password should be 6"),
  body("contactNo")
    .trim()
    .isNumeric()
    .withMessage("invalid contact number")
    .notEmpty()
    .withMessage("contact number can't be empty")
    .matches(/^\d{10}$/)
    .withMessage("Contact must be a 10-digit number"),
  validate,
];

export const loginValidation = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("invalid email")
    .trim()
    .isLowercase()
    .withMessage("email should be in lowercase"),
  body("contact")
    .optional()
    .isNumeric()
    .withMessage("invalid contact Number")
    .matches(/^\d{10}$/)
    .withMessage("Contact must be a 10-digit number"),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage("password must be combination of alphabets and digits")
    .isLength({ min: 6 })
    .withMessage("minimum length of password should be 6"),
  body().custom((data) => {
    if (!data.email && !data.contactNo) {
      throw Error("Either email or contact is required");
    }
    return true;
  }),
  validate,
];
