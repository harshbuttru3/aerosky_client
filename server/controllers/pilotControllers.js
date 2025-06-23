const Pilot = require("../models/pilotModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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
    subject: `Your aero2astro pilot account access granted`,
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
		            <h1>Hello ${name}! Your aero2astro Pilot Account Access Granted</h1>
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

module.exports.registerPilot = async (req, res, next) => {
  try {
    const {
      name,
      email,
      image,
      number,
      location,
      password,
      previousWorkExperience,
    } = req.body;

    const emailCheck = await Pilot.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "account already exist", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const pilot = await Pilot.create({
      name,
      email,
      image,
      number,
      location,
      password: hashedPassword,
      previousWorkExperience,
    });
    delete pilot.password;
    if (pilot) {
      let result = await sendMail(name, email, password);
      return res.json({ status: true, pilot });
    }
    return res.json({ status: true, pilot });
  } catch (ex) {
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.loginPilot = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pilot = await Pilot.findOne({ email });
    console.log(pilot, password);
    if (!pilot)
      return res.json({ msg: "Incorrect email or password", status: false });
    const isPasswordValid = await bcrypt.compare(password, pilot.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect email or password", status: false });
    delete pilot.password;
    return res.json({ status: true, pilot });
  } catch (ex) {
    next(ex);
  }
};

module.exports.checkForPilotExist = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Pilot.findOne({ email });
    if (user) {
      return res.json({ status: true, msg: "Email ID is already in use" });
    }
    return res.json({ status: false, msg: "Okay" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllPilots = async (req, res, next) => {
  try {
    const pilot = await Pilot.find();
    if (pilot.length > 0) {
      return res.status(200).json({ status: true, pilot });
    } else {
      return res.status(404).json({ status: false, msg: "No pilots found!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, msg: "Server error!" });
  }
};

module.exports.updatePilotStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    if ((key = "wHP^~#uEDe9t=R,ksa&4AS")) {
      const plot = Pilot.findByIdAndUpdate(
        id,
        {
          status,
        },
        { new: true },
        (err, pilot) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, pilot });
        }
      );
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.updatePilotProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      number,
      aadharPdf,
      aadharNumber,
      willingToJoinAs,
      willingEvents,
      canTravelPanIndia,
      district,
      state,
      havePassport,
      canFlyDrone,
      experience,
      haveDCGACertificate,
      dronesHaving,
      uinNumber,
      flyAutonomousPaths,
      noOfBatteries,
      flyHillyAreas,
      flyFPVDrone,
      deviceConnectToRC,
      singleDayCharge,
      skills,
    } = req.body;
    const { id } = req.params;
    const pilot2 = Pilot.findByIdAndUpdate(
      id,
      {
        name,
        email,
        number,
        aadharPdf,
        aadharNumber,
        willingToJoinAs,
        willingEvents,
        canTravelPanIndia,
        district,
        state,
        havePassport,
        canFlyDrone,
        experience,
        haveDCGACertificate,
        dronesHaving,
        uinNumber,
        flyAutonomousPaths,
        noOfBatteries,
        flyHillyAreas,
        flyFPVDrone,
        deviceConnectToRC,
        singleDayCharge,
        skills,
      },
      { new: true },
      (err, pilot) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong!" });
        }
        return res.json({ status: true, pilot });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.getPilotsByIds = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id || !Array.isArray(id) || id.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "An array of Pilot IDs is required!",
      });
    }

    const pilots = await Pilot.find({ _id: { $in: id } });

    return res.status(200).json({
      status: true,
      pilot: pilots,
    });
  } catch (error) {
    console.error("Error fetching pilots:", error);
    return res.status(500).json({
      status: false,
      msg: "Server error while fetching pilots.",
    });
  }
};

module.exports.updateAssignedProjectsInPilot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedProjects } = req.body;
    const pilot = Pilot.findByIdAndUpdate(
      id,
      {
        assignedProjects,
      },
      { new: true },
      (err, obj) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong!" });
        }
        return res.json({ status: true, msg: "Updated!" });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.updatePilotSoftwares = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { softwares } = req.body;
    const pilot = Pilot.findByIdAndUpdate(
      id,
      {
        softwares,
      },
      { new: true },
      (err, obj) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong!" });
        }
        return res.json({ status: true, pilot: obj });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.updatePilotDronesId = async (req, res, next) => {
  try {
    const { dronesId } = req.body;
    const { id } = req.params;
    const pilot = Pilot.findByIdAndUpdate(
      id,
      {
        dronesId,
      },
      { new: true },
      (err, obj) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong" });
        }
        return res.json({ status: true, pilot: obj });
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.updatePilotBatteriesId = async (req, res, next) => {
  try {
    const { batteriesId } = req.body;
    const { id } = req.params;
    const pilot = Pilot.findByIdAndUpdate(
      id,
      {
        batteriesId,
      },
      { new: true },
      (err, obj) => {
        if (err) {
          return res.json({ status: false, msg: "Something went wrong" });
        }
        return res.json({ status: true, pilot: obj });
      }
    );
  } catch (ex) {
    next(ex);
  }
};
