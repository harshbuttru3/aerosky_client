const EmailVerify = require("../models/emailVerifyModel");
const AccessRequest = require("../models/accessRequestModel");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

function generateRandomToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }

    return token;
}


const sendMail = async (name,email,id,token,organizationName) => {
	const clientUrls = process.env.CLIENT_URLS.split(",");
	const firstClientUrl = clientUrls[0];

	const activationLink = `${firstClientUrl}/submitRequest/${id}?token=${token}`

  let mailOptions = {
      from: {
        name:'TNS Academy',
        address:'tnsacademy1@gmail.com'
      },
      to: email,
      subject: `Activate Your aero2astro Account!`,
      html: `
       <!DOCTYPE html>
		<html>
		<head>
		    <meta charset="UTF-8">
		    <title>Welcome to aero2astro</title>
		    <style>
		        body {
		            font-family: Arial, sans-serif;
		            background-color: #f4f4f4;
		            margin: 0;
		            padding: 0;
		        }

		        #container {
		            max-width: 600px;
		            margin: 0 auto;
		            background-color: #ffffff;
		            padding: 20px;
		            border-radius: 5px;
		            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		        }

		        #header {
		            text-align: center;
		            margin-bottom: 20px;
		        }

		        #header img {
		            max-width: 100%;
		            height: auto;
		        }

		        #content {
		            font-size: 16px;
		            line-height: 1.6;
		            margin-bottom: 20px;
		        }

		        #activation-button {
		            display: inline-block;
		            padding: 10px 20px;
		            background-color: #007BFF;
		            color: #ffffff;
		            text-decoration: none;
		            border-radius: 5px;
		        }

		        #activation-button:hover {
		            background-color: #0056b3;
		        }

		        #footer {
		            text-align: center;
		            font-size: 12px;
		            margin-top: 20px;
		            color: #777;
		        }
		    </style>
		</head>
		<body>
		    <div id="container">
		        <div id="header">
		            <img src="[Company Logo URL]" alt="aero2astro Logo">
		        </div>
		        <div id="content">
		            <p>Hello ${name} from ${organizationName} ! Welcome to aero2astro, where we're pioneering a new era in the world of aviation, space modeling, and unmanned aerial vehicles (UAVs). We're thrilled that you've chosen to join us on this exciting journey!</p>
		            <p>aero2astro is India's first organization to offer career opportunities in Research & Development within the aeronautical and aerospace sectors. But we're not just about professional growth; we're also dedicated to promoting scholastic applications related to aeromodeling, spacemodeling, and fulfilling the hobbyist needs of Radio Controller enthusiasts.</p>
		            <p>Here's a bit more about our vision:</p>
		            <ol>
		                <li><strong>Aeronautics and Aerospace for All:</strong> We believe that the fascinating world of aviation and space should be accessible to everyone. For too long, these fields have been exclusive, but our primary mission is to change that. With India at the forefront of the global aviation sector, it's time to make aviation, space travel, and UAVs the next big thing for all to explore.</li>
		                <li><strong>Realizing the Future:</strong> At aero2astro, we envision a future where the boundaries of the sky are limitless. We are committed to pushing the boundaries of innovation and technology to ensure that the dream of aviation becomes a reality for everyone.</li>
		                <li><strong>Workshops and Exploration:</strong> We're excited to offer you a range of workshops and experiences, including aerodynamics and rocket propulsion workshops. These hands-on opportunities will allow you to dive deep into the world of aerospace and aviation.</li>
		            </ol>
		            <p>But before you can embark on this journey with us, we need to verify your email address to ensure the security of your account. Please click the button below to activate your account:</p>
		            <a id="activation-button" href="${activationLink}">Activate Your Account</a>
		            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at aero2astro.support@gmail.com . We're here to help you every step of the way.</p>
		        </div>
		        <div id="footer">
		            &copy; Team aero2astro | Email: aero2astro@gmail.com
		        </div>
		    </div>
		</body>
		</html>


      `
    };
    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log(`Email sent Successfully to ${email}`);
      }
    });
} 

module.exports.createEmailVerify = async(req,res,next) => {
	try{
		const {name,email,number,organizationType,organizationName,
			organizationId,clientIndustry} = req.body;
		const randomToken = await generateRandomToken(10);
		const emailVerify = await EmailVerify.create({
			name,email,number,organizationType,organizationName,
			organizationId,clientIndustry,token:randomToken
		})
		if(emailVerify){
			let result = await sendMail(name,email,emailVerify._id,randomToken,organizationName);
			return res.json({status:true,msg:"Verification email sent!"});
		}
		return res.json({status:false,msg:"Something went wrong"})
	}catch(ex){
		next(ex)
	}
}

module.exports.getEmailVerify = async(req,res,next) => {
	try{
		const {token,id} = req.body;
		const emailVerify = await EmailVerify.findOne({_id:id,token:token})
		if(emailVerify){
			const {name,email,number,organizationType,clientIndustry,
			organizationName,organizationId} = emailVerify
			const request = await AccessRequest.create({
				name,email,number,organizationType,clientIndustry,
				organizationName,organizationId
			})
			if(request){
				const result = await EmailVerify.findByIdAndRemove(id);
				console.log(result);
			    if(result){
					return res.json({status:true,msg:"Request was successfully submitted!"})
			    }
				return res.json({status:false,msg:"Request is invalid"})
			}else{
				return res.json({status:false,msg:"Request is invalid"})
			}
		}		
		return res.json({status:false,msg:"Request is invalid"})
	}catch(ex){
		next(ex)
	}
}