// const User = require("../models/userModel.js");
// const jwt = require("jsonwebtoken");

// const verifyUserJwt = async (req, res, next) => {
//   const authorizationHeader = req.headers.authorization;
//   // console.log("Authorization :",authorizationHeader)
//   if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized header" });
//   }

//   const token = authorizationHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized request" });
//   }
//   // console.log("Token :",token)

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // console.log("Decoded :",decoded)
//     const user = await User.findById(decoded._id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     req.user = user;

//     console.log("USER   : ", req.user);

//     next();
//   } catch (error) {
//     res.status(401).json({ message: error?.message || "Invalid access Token" });
//   }
// };

// module.exports = verifyUserJwt;

const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const verifyUserJwt = async (req, res, next) => {
  let token;

  // 1️⃣ Check in Authorization Header (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2️⃣ If not found in header, check in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 3️⃣ If token is still missing, return unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error?.message || "Invalid access token" });
  }
};

module.exports = verifyUserJwt;
