const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const sendMail = async (name, email, password) => {
  let mailOptions = {
    from: {
      name: "TNS Academy",
      address: "tnsacademy1@gmail.com",
    },
    to: email,
    subject: `Your aero2astro account access granted`,
    html: `
      	<!DOCTYPE html>
		<html>
		<head>
		    <meta charset="UTF-8">
		    <title>Your aero2astro Account Access Granted</title>
		    <style>
		        /* Reset some default styles to ensure consistency */
		        body, p {
		            margin: 0;
		            padding: 0;
		            font-family: Arial, sans-serif;
		        }

		        /* Main container style */
		        .container {
		            max-width: 600px;
		            margin: 0 auto;
		            padding: 20px;
		            background-color: #f5f5f5;
		            text-align: center;
		        }

		        /* Header style */
		        .header {
		            background-color: #007BFF;
		            color: #ffffff;
		            padding: 20px;
		        }

		        /* Content style */
		        .content {
		            background-color: #ffffff;
		            padding: 20px;
		        }

		        /* Button style */
		        .button {
		            display: inline-block;
		            padding: 10px 20px;
		            background-color: #007BFF;
		            color: #ffffff;
		            text-decoration: none;
		            border-radius: 5px;
		        }

		        .button:hover {
		            background-color: #0056b3;
		        }

		        /* Footer style */
		        .footer {
		            background-color: #f5f5f5;
		            padding: 20px;
		        }
		    </style>
		</head>
		<body>
		    <div class="container">
		        <div class="header">
		            <h1>Hello ${name}! Your aero2astro Account Access Granted</h1>
		        </div>
		        <div class="content">
		            <p>This mail is to inform you that your account access has been granted by our team. </p>
		            
		            <h2>Your Login Credentials:</h2>
		            <ul>
		                <li><strong>Gmail ID:</strong> ${email}</li>
		                <li><strong>Password:</strong> ${password}</li>
		            </ul>
		            
		            <p>Please keep these credentials secure and do not share them with anyone. If you ever forget your password, you can use the "Forgot Password" option on our login page to reset it.</p>

		            <p>To access your account, simply visit our website <a href="[Website URL]">[Website URL]</a> and click on the "Login" button. Enter your Gmail ID and the provided password to get started.</p>

		            <p>If you have any questions, encounter any issues, or need assistance with your account, please feel free to contact our support team at <a href="mailto:aero2astro@gmail.com">aero2astro@gmail.com</a>. We are here to assist you every step of the way.</p>
		        </div>
		        <div class="footer">
		            <p>Thank you for choosing aero2astro. We look forward to seeing all that you'll accomplish with us!</p>
		            <p>Warm regards,</p>
		            <p>Team<br>aero2astro<br>Chennai<br></p>
		        </div>
		    </div>
		</body>
		</html>


      `,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      return "Error";
    } else {
      console.log(`Email sent Successfully to ${email}`);
      return "Success";
    }
  });
};

module.exports.register = async (req, res, next) => {
  try {
    const {
      email,
      name,
      image,
      number,
      password,
      clientIndustry,
      organizationType,
      organizationName,
      organizationId,
      roles,
    } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "account already exist", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      number,
      image,
      name,
      password: hashedPassword,
      clientIndustry,
      organizationType,
      organizationName,
      organizationId,
      roles,
    });
    if (user) {
      let result = await sendMail(name, email, password);
      return res.json({ status: true, user });
    }
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.registerUserRouteByAdmin = async (req, res, next) => {
  try {
    const {
      email,
      name,
      image,
      number,
      password,
      clientIndustry,
      organizationType,
      organizationName,
      organizationId,
      organizationRole,
      roles,
    } = req.body;

    if (!email || !name || !password || !organizationId || !roles) {
      return res.status(400).json({
        status: false,
        msg: "Missing required fields",
      });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(409).json({
        status: false,
        msg: "Account already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      number,
      image,
      name,
      password: hashedPassword,
      clientIndustry,
      organizationType,
      organizationName,
      organizationId,
      roles,
      organizationRole,
    });

    await sendMail(name, email, password);

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    return res.status(201).json({
      status: true,
      msg: "User registered successfully",
      user: userToReturn,
    });
  } catch (error) {
    console.error("Error in registerUserRouteByAdmin:", error);
    return res.status(500).json({
      status: false,
      msg: "Server error during registration",
    });
  }
};

module.exports.clientLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .cookie("auth", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: true,
        message: "Login successful",
        user,
        token,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
module.exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .cookie("adminAuth", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: true,
        message: "Login successful",
        user,
        token,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

module.exports.verifySession = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized", status: false });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", status: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found", status: false });
    }
    res.status(200).json({ user: user, status: true });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.checkForUserExist = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: false, msg: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ status: false, msg: "Email ID is already in use" });
    }

    return res.status(200).json({ status: true, msg: "Email is available" });
  } catch (error) {
    console.error("Error in checkForUserExist:", error); // add this
    return res.status(500).json({ status: false, msg: "Server error" });
  }
};

module.exports.updateUserRoles = async (req, res, next) => {
  try {
    const { id, roles } = req.body;

    if (!id || !Array.isArray(roles)) {
      return res.status(400).json({
        status: false,
        msg: "User ID  is required.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { roles },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, msg: "User not found." });
    }

    return res.status(200).json({ status: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateUserRoles:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error" });
  }
};

module.exports.getClientById = async (req, res, next) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return res
        .status(400)
        .json({ status: false, msg: "Client ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid Client ID format" });
    }

    const user = await User.findById(clientId).select("-chats");

    if (!user) {
      return res.status(404).json({ status: false, msg: "Client not found" });
    }

    return res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
    console.error("Error in getClientById:", error);
    return res.json({ status: false, msg: "Something went wrong" });
  }
};

module.exports.getClientFromOrganisation = async (req, res, next) => {
  try {
    const { organizationId } = req.body;

    if (!organizationId) {
      return res
        .status(400)
        .json({ status: false, msg: "Organization ID is required" });
    }

    const clients = await User.find({
      organizationId,
      roles: "User",
    }).lean();

    if (!clients || clients.length === 0) {
      return res.status(404).json({ status: false, msg: "No clients found" });
    }

    const sanitizedClients = clients.map((user) => ({
      ...user,
      chats: [],
    }));

    return res.status(200).json({ status: true, clients: sanitizedClients });
  } catch (error) {
    console.error("Error in getClientFromOrganisation:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

module.exports.updateUserOrganization = async (req, res, next) => {
  try {
    const { organizationId, organizationRole, organizationName, id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { organizationId, organizationRole, organizationName },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    delete updatedUser.chats;

    return res.status(200).json({ status: true, user: updatedUser });
  } catch (error) {
    console.error("Error removing user organization:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const { key } = req.body;
    if (key === "Wq1t9EDJVFfPXJXxjtL577/jETBDoUKeSz2KfclReCw=") {
      const user = await User.find();
      if (user) {
        let newUserList = user.map((usr) => {
          const { chats, ...rest } = usr.toObject(); // destructuring to exclude 'chats'
          return rest; // return object without 'chats'
        });
        return res.json({ status: true, user: newUserList });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else {
      return res.json({ status: false, msg: "Invalid key!" });
    }
  } catch (ex) {
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.updateOrganizationNameAndDescription = async (
  req,
  res,
  next
) => {
  try {
    const { organizationName, organizationDescription, id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "User ID is required." });
    }

    if (!organizationName && !organizationDescription) {
      return res.status(400).json({
        status: false,
        msg: "At least one of organizationName or organizationDescription must be provided.",
      });
    }

    const updateFields = {};
    if (organizationName) updateFields.organizationName = organizationName;
    if (organizationDescription)
      updateFields.organizationDescription = organizationDescription;

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      select: "-chats",
    });

    if (!updatedUser) {
      return res.status(404).json({ status: false, msg: "User not found." });
    }

    return res.status(200).json({ status: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateOrganizationNameAndDescription:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error" });
  }
};

module.exports.updateProjectRequests = async (req, res, next) => {
  try {
    const { projectRequestsId, id } = req.body;

    if (!id || !projectRequestsId) {
      return res.status(400).json({
        status: false,
        msg: "User ID and Project Requests ID are required.",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { projectRequestsId },
      { new: true, select: "-chats" }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ status: false, msg: "User not found!" });
    }

    res.status(200).json({ status: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating project requests:", error);
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "User ID is required" });
    }
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    const userObj = user.toObject();
    delete userObj.chats;

    return res.status(200).json({ status: true, user: userObj });
  } catch (err) {
    console.error("Error in getUserById:", err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error" });
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    if (!_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.searchClient = async (req, res, next) => {
  try {
    const { searchText: name } = req.body;
    const user = await User.find({
      name: {
        $regex: new RegExp(name, "ig"),
      },
    });
    if (user.length > 0) {
      return res.json({ status: true, user });
    }
    return res.json({ status: false, msg: "Not found" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateUserChats = async (req, res, next) => {
  try {
    const { chats } = req.body;
    const id = req.params.id;
    const user = User.findByIdAndUpdate(
      id,
      {
        chats,
      },
      { new: true },
      (err, user) => {
        delete user["chats"];
        return res.json({ status: true, user });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserByIdWithChats = async (req, res, next) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ _id: id });
    if (user) {
      return res.json({ status: true, user });
    }
    return res.json({ status: false, msg: "Something went wrong!" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateTowerProjectsId = async (req, res, next) => {
  try {
    const { towerProjectsId, id } = req.body;
    const user = User.findByIdAndUpdate(
      id,
      {
        towerProjectsId,
      },
      { new: true },
      (err, user) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong" });
        }
        delete user["chats"];
        return res.json({ status: true, user: user });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateSolarProjectsId = async (req, res, next) => {
  try {
    const { solarProjectsId, id } = req.body;
    const user = User.findByIdAndUpdate(
      id,
      {
        solarProjectsId,
      },
      { new: true },
      (err, user) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong" });
        }
        delete user["chats"];
        return res.json({ status: true, user: user });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateUserSites = async (req, res) => {
  try {
    const { id, sites } = req.body;

    if (!id || !sites) {
      return res
        .status(400)
        .json({ status: false, message: "User ID and sites are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { sites },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    return res.status(200).json({
      status: true,
      message: "User sites updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user sites:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};
