

const mongoose = require('mongoose')
		
const pilotVerifySchema =  new mongoose.Schema({
	name:{
		type: String,
		required: true,
		max:40,
	},
	email:{
		type:String,
		default:'',
		required:true,
		unique:true
	},
	image:{
		type:String,
		default:'',
	},
	number:{
		type:String,
		default:''
	},
	location:{
		type:String,
		default:''
	},
	token:{
		type:String,
		required:true
	},
	previousWorkExperience:{
		type:String,
		default:''
	},
	roles:{
		type:Array,
		default:['pilot']
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("PilotVerify",pilotVerifySchema)



