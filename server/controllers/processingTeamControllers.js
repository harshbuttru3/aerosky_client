const ProcessingTeam = require("../models/processingTeamModel");
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
    subject: `Your aero2astro processing team account access granted`,
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
		            <h1>Hello ${name}! Your aero2astro Processing Team Account Access Granted</h1>
		        </div>
		        <div class="content">
		            <p>This mail is to inform you that your account access has been granted by our team. </p>
		            
		            <h2>Your Login Credentials:</h2>
		            <ul>
		                <li><strong>Gmail ID:</strong> ${email}</li>
		                <li><strong>Password:</strong> ${password}</li>
		            </ul>
		            
		            <p>Please keep these credentials secure and do not share them with anyone. If you ever forget your password, you can use the "Forgot Password" option on our login page to reset it.</p>

		            <p>To access your account, simply visit our website <a href="https://aero2astro.com">https://aero2astro.com</a> and click on the "Login" button. Enter your Gmail ID and the provided password to get started.</p>

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

module.exports.registerProcessingTeam = async (req, res, next) => {
  try {
    const { name, email, number, location, password, previousWorkExperience } =
      req.body;

    const emailCheck = await ProcessingTeam.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "account already exist", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const processingTeam = await ProcessingTeam.create({
      name,
      email,
      number,
      location,
      password: hashedPassword,
      previousWorkExperience,
    });
    delete processingTeam.hashedPassword;
    if (processingTeam) {
      let result = await sendMail(name, email, password);
      return res.json({ status: true, processingTeam });
    }
    return res.json({ status: true, processingTeam });
  } catch (ex) {
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.loginProcessingTeam = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const processingTeam = await ProcessingTeam.findOne({ email });
    console.log(processingTeam, password);
    if (!processingTeam)
      return res.json({ msg: "Incorrect email or password", status: false });
    const isPasswordValid = await bcrypt.compare(
      password,
      processingTeam.password
    );
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect email or password", status: false });
    delete processingTeam.password;
    return res.json({ status: true, processingTeam });
  } catch (ex) {
    next(ex);
  }
};

module.exports.checkForProcessingTeamExist = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await ProcessingTeam.findOne({ email });
    if (user) {
      return res.json({ status: true, msg: "Email ID is already in use" });
    }
    return res.json({ status: false, msg: "Okay" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateProcessingTeamStatus = async (req, res, next) => {
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

module.exports.getProcessingTeamByIds = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Processing Team ID is required!" });
    }

    const processingTeam = await ProcessingTeam.findById(id);

    if (processingTeam) {
      return res.status(200).json({ status: true, processingTeam });
    } else {
      return res
        .status(404)
        .json({ status: false, msg: "Processing Team not found!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, msg: "Server error!" });
  }
};

module.exports.updateAssignedProjectsInProcessingTeam = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { assignedProjects } = req.body;
    const pilot = ProcessingTeam.findByIdAndUpdate(
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

module.exports.getAllProcessingTeam = async (req, res, next) => {
  try {
    const { key } = req.body;
    if (key === "Wq1t9EDJVFfPXJXxjtL577/jETBDoUKeSz2KfclReCw=") {
      const processingTeam = await ProcessingTeam.find();
      if (processingTeam) {
        return res.json({ status: true, processingTeam });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    }
  } catch (ex) {
    next(ex);
  }
};
